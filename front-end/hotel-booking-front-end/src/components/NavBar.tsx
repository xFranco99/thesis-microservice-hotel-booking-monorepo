import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthProvider";

interface Props {
  name: string;
  account: string;
}

function NavBar(props: Props) {
  const myStyle = {
    padding: "12px",
  };

  const { auth, user, isAdmin } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        {isAdmin ? (
          <div>
            <Link
              className="navbar-brand mb-0 h1"
              to="/console"
              style={myStyle}
            >
              Hotel
            </Link>
            <Link className="navbar-brand mb-0 h1" to="/console/services" style={myStyle}>
              Services
            </Link>
            <Link className="navbar-brand mb-0 h1" to="/console/mail" style={myStyle}>
              Mail
            </Link>
          </div>
        ) : (
          <Link className="navbar-brand mb-0 h1" to="/" style={myStyle}>
            {props.name}
          </Link>
        )}

        {auth ? (
          <Link
            className="navbar-brand mb-0 h1"
            to="/privateArea"
            style={myStyle}
          >
            {user?.username}
          </Link>
        ) : (
          <Link className="navbar-brand mb-0 h1" to="/logIn" style={myStyle}>
            {props.account}
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
