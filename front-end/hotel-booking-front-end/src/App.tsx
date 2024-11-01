import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import NavBar from "./components/NavBar";
import LogInCard from "./components/LogIn/LogInCard";
import { Fragment } from "react";
import Footer from "./components/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Fragment>
      <NavBar name="Hotel"></NavBar>
      <LogInCard></LogInCard>
      <Footer></Footer>
    </Fragment>
  );
}

export default App;
