import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LogInCard from "./components/LogIn/LogInCard";
import SignInForm from "./components/LogIn/SignInForm";
import SignUpForm from "./components/LogIn/SignUpForm";
import SignInCode from "./components/LogIn/SignInCodeForm";

function App() {
  return (
    <Router>
      <NavBar name="Hotel" account="Sign-In"></NavBar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/logIn"
          element={
            <LogInCard>
              <SignInForm></SignInForm>
            </LogInCard>
          }
        />
        <Route
          path="/signUp"
          element={
            <LogInCard>
              <SignUpForm></SignUpForm>
            </LogInCard>
          }
        />
        <Route
          path="/signInCode"
          element={
            <LogInCard>
              <SignInCode></SignInCode>
            </LogInCard>
          }
        />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
