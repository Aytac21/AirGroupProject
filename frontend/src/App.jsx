import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshToken } from './actions/auth';
import { RouterProvider } from "react-router-dom";
import { routers } from "../Routers"

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshToken());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <RouterProvider router={routers} />
  );
};

export default App;
