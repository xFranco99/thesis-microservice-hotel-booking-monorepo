import React from "react";

interface Props {
  name: string;
}

function LogInCard() {
  const logInImage =
    "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=600";

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
          <h1>Sign In</h1>
          <form style={{ paddingTop: "20px" }}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Email or Username"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
              />
            </div>
            <div className="mb-3" style={{ display: "grid" }}>
              <button type="submit" className="btn btn-danger">
                Sign In
              </button>
            </div>
            <h3 style={{ display: "flex", justifyContent: "center" }}>OR</h3>
            <div className="mb-3" style={{ display: "grid" }}>
              <button type="submit" className="btn btn-outline-light">
                Use a Sign-In Code
              </button>
            </div>
            <div className="mb-3">
              <p style={{ display: "flex", justifyContent: "center" }}>
                <a className="text-white" href="#">Forgot password?</a>
              </p>
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              />
              <label className="form-check-label" htmlFor="exampleCheck1">
                Remember me
              </label>
            </div>
            <div className="mb-3">
              <p>
                You don't have an account?&nbsp;
                <a className="text-white" href="#">Sign Up</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogInCard;
