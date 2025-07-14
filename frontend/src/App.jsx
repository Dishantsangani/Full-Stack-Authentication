import React from "react";
import SignUp from "./Page/SignUp";
import Signin from "./Page/Signin";
import Home from "./Page/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Forgotpassword from "./Page/component/Forgotpassword";
import ProtectedRoute from "./Page/Protected Routes/ProtectedRoute";
import SetPassword from "./Page/component/SetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/setpassword" element={<SetPassword />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
