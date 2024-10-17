from rest_framework_simplejwt.exceptions import TokenError
from .models import User, OneTimePassword
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str, smart_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import send_normal_email
from rest_framework_simplejwt.tokens import RefreshToken, TokenError, AccessToken
from rest_framework.authtoken.models import Token
from datetime import timedelta


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=68, min_length=6, write_only=True)
    password2 = serializers.CharField(
        max_length=68, min_length=6, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name',
                  'phone', 'username', 'password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password', '')
        password2 = attrs.get('password2', '')
        if password != password2:
            raise serializers.ValidationError("passwords do not match")

        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            password=validated_data.get('password'),
            username=validated_data.get('username')
        )
        return user


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=155, min_length=6)
    password = serializers.CharField(max_length=68, write_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'access_token', 'refresh_token']

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        request = self.context.get('request')
        user = authenticate(email=email, password=password)

        if not user:
            raise AuthenticationFailed(
                "Etibarsız etimadnamələr, yenidən cəhd edin.")

        refresh = RefreshToken.for_user(user)
        print(refresh)
        access_token = refresh.access_token

        return {
            'email': user.email,
            'access_token': str(access_token),
            'refresh_token': str(refresh)
        }



class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ['email']

    def validate(self, attrs):

        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            request = self.context.get('request')
            current_site = get_current_site(request).domain
            relative_link = reverse(
                'reset-password-confirm', kwargs={'uidb64': uidb64, 'token': token})
            abslink = f"http://{current_site}{relative_link}"
            print(abslink)
            email_body = f"Hi {user.first_name} use the link below to reset your password {abslink}"
            data = {
                'email_body': email_body,
                'email_subject': "Reset your Password",
                'to_email': user.email
            }
            send_normal_email(data)

        return super().validate(attrs)


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        max_length=100, min_length=6, write_only=True)
    confirm_password = serializers.CharField(
        max_length=100, min_length=6, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)
    token = serializers.CharField(min_length=3, write_only=True)

    class Meta:
        fields = ['password', 'confirm_password', 'uidb64', 'token']

    def validate(self, attrs):
        try:
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            password = attrs.get('password')
            confirm_password = attrs.get('confirm_password')

            user_id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed(
                    "reset link is invalid or has expired", 401)
            if password != confirm_password:
                raise AuthenticationFailed("passwords do not match")
            user.set_password(password)
            user.save()
            return user
        except Exception as e:
            return AuthenticationFailed("link is invalid or has expired")


class VerifyOTPSerializer(serializers.Serializer):
    otp = serializers.CharField()

    def validate(self, data):
        otp = data['otp']
        try:
            otp_record = OneTimePassword.objects.get(otp=otp)
            user = otp_record.user
            data['user'] = user
        except OneTimePassword.DoesNotExist:
            raise serializers.ValidationError('Invalid OTP.')

        token, created = Token.objects.get_or_create(user=user)
        data['token'] = token.key
        otp_record.delete()

        return data


class LogoutUserSerializer(serializers.Serializer):
    refresh_token = serializers.CharField()
    access_token = serializers.CharField()

    default_error_messages = {
        'bad_token': 'Token is expired or invalid'
    }

    def validate(self, attrs):
        self.refresh_token = attrs.get('refresh_token')
        self.access_token = attrs.get('access_token')
        return attrs

    def save(self, **kwargs):
        try:
            refresh_token = RefreshToken(self.refresh_token)
            refresh_token.blacklist()

            access_token = AccessToken(self.access_token)
            access_token.blacklist()

        except TokenError:
            self.fail('bad_token')


class VerifyUserEmailSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)


class ProfileSerializer(serializers.ModelSerializer):
    profil_picture = serializers.ImageField(
        allow_empty_file=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone', 'username',
            'profil_picture'
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name',
                  'phone', 'username']


class UpdateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=False, allow_blank=True, allow_null=True)
    password2 = serializers.CharField(
        write_only=True, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'username',
            'password', 'password2', 'first_name', 'last_name'
        ]
        extra_kwargs = {
            'email': {'required': False},
            'phone': {'required': False, 'allow_blank': True, 'allow_null': True},
            'username': {'required': False, 'allow_blank': True, 'allow_null': True},
            'password': {'required': False},
            'password2': {'required': False},
            'first_name': {'read_only': True},
            'last_name': {'read_only': True},
        }

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')

        if (password or password2) and not password:
            raise serializers.ValidationError(
                {"password": "Bu sahə təkrar şifrə təmin edildikdə tələb olunur."})
        if (password or password2) and not password2:
            raise serializers.ValidationError(
                {"password2": "Şifrə təmin edildikdə bu sahə tələb olunur."})
        if password and password2 and password != password2:
            raise serializers.ValidationError(
                {"password2": "İki şifrə sahəsi eyni olmalıdır."})

        return data

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
