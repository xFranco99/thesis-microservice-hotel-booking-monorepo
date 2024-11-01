import React from "react";

interface Props {
  name: string;
}

function NavBar(props: Props) {
  const myStyle = {
    padding: "12px",
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand mb-0 h1" href="#" style={myStyle}>
          {props.name}
        </a>
      </div>
    </nav>
  );
}

export default NavBar;
