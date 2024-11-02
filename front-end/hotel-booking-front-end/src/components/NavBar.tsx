import React from "react";
import { Link } from "react-router-dom";

interface Props {
  name: string;
  account: string;
}

function NavBar(props: Props) {
  const myStyle = {
    padding: "12px",
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand mb-0 h1" to="/" style={myStyle}>
          {props.name}
        </Link>
        <Link className="navbar-brand mb-0 h1" to="/logIn" style={myStyle}>
          {props.account}
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
