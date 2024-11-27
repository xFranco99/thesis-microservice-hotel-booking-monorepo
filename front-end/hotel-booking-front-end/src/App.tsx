import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LogInCard from "./components/LogIn/LogInCard";
import SignInForm from "./components/LogIn/SignInForm";
import SignUpForm from "./components/LogIn/SignUpForm";
import SignInCodeForm from "./components/LogIn/SignInCodeForm";
import BookingLabel from "./components/Booking/BookingLabel";
import RoomDetail from "./components/Booking/RoomDetail";
import PrivateAreaLabel from "./components/PrivateArea/PrivateAreaLabel";
import ConsoleModal from "./components/Console/ConsoleModal";
import Modal from "./components/common/Modal";

function App() {
  return (
    <Router>
      <NavBar name="Hotel" account="Sign-In"></NavBar>
      <Routes>
        <Route
          path="/"
          element={
            <Home>
              <Modal></Modal>
            </Home>
          }
        />
        <Route
          path="/console/*"
          element={
            <Home>
              <ConsoleModal />
            </Home>
          }
        />
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
              <SignInCodeForm></SignInCodeForm>
            </LogInCard>
          }
        />
        <Route path="/bookingLabel" element={<BookingLabel></BookingLabel>} />
        <Route path="/roomDetail" element={<RoomDetail></RoomDetail>} />
        <Route
          path="/privateArea/*"
          element={<PrivateAreaLabel></PrivateAreaLabel>}
        />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
