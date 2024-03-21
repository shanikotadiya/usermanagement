import React from "react";
import Registrean from "./regstren/registrean";
import Datatbl from "./DataTable/DataTable";
import LoginApp from "./login/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
    
       <Route path="/" element={<Datatbl />} />
       <Route path="/Registrean" element={<Registrean />} />
       <Route path="/login" element={<LoginApp />} /> 
      </Routes>
    </BrowserRouter>
  );
}
export default App;
