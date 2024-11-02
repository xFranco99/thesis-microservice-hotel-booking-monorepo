import React from "react";
import { ReactNode } from "react";

interface Props{
  children: ReactNode
}

function LogInCard({children}: Props) {
  const logInDivClass = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    backgroundImage:
      "url('https://images.pexels.com/photos/122244/pexels-photo-122244.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div style={logInDivClass}>
        <div
          className="card text-white"
          style={{
            width: "25rem",
            padding: "25px",
            backgroundColor: "rgba(33, 37, 41, .7)",
          }}
        >
          <div className="card-body">
            {children}
          </div>
        </div>
      </div>
  );
}

export default LogInCard;
