import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import Budget from "./budget_manager_jsx"
import Budget from "./budget"
import Login from "./components/pages/users/login"
import PrivateRoute from "./components/PrivateRoute";

function App() { 

   return (
    <BrowserRouter>
      <Routes>
        {/* page publique */}
        <Route path="/" element={<Login />} />

        {/* page protégée */}
        <Route
          path="/budget"
          element={
            <PrivateRoute>
              <Budget />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App