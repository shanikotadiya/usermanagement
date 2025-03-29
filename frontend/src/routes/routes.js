import React from 'react';
import Home from '../components/Home.jsx';
import Login from '../components/Login.jsx';
import CustomerRegister from '../components/CustomerRegister.jsx';
import AdminRegister from '../components/AdminRegistre.jsx';
import VerifySuccess from '../components/EmailVerification.jsx';
export const HomeRoute = {
  path: "/",
  element: <Home />,
};

export const LoginRoute = {
  path: "/login",
  element: <Login />,
};

export const CustomerRegisterRoute = {
  path: "/customerregister",
  element: <CustomerRegister />,
};

export const AdminRegisterRoute = {
  path: "/adminregister",
  element: <AdminRegister />,
};
export const EmailVerification = {
  path: "/verify-success",
  element: <VerifySuccess />,
};

