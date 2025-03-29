import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomeRoute, LoginRoute, CustomerRegisterRoute,AdminRegisterRoute, EmailVerification } from "./routes/routes";
import Navbar from "./components/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  
function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path={HomeRoute.path} element={HomeRoute.element} />
          <Route path={LoginRoute.path} element={LoginRoute.element} />
          <Route path={CustomerRegisterRoute.path} element={CustomerRegisterRoute.element} />
          <Route path={AdminRegisterRoute.path} element={AdminRegisterRoute.element} />
          <Route path={EmailVerification.path} element={EmailVerification.element} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
