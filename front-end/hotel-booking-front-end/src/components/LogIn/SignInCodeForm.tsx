import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

function SignInCode() {
  const [sendCode, setSendCode] = useState(false);

  const handleClick = () => {
    console.log("Clicked");

    setSendCode(!sendCode);
  };

  return (
    <Fragment>
      <h1>Sign In Code</h1>
      <form style={{ paddingTop: "20px" }}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="InputEmailUser4Code"
            aria-describedby="emailHelp"
            placeholder="Email or Username"
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            id="InputEmailUser4Code"
            aria-describedby="emailHelp"
            placeholder="Code"
          />
        </div>

        <div className="mb-3" style={{ display: "grid" }}>
            <button
              type="submit"
              className="btn btn-danger"
              id="CodeButton"
              onClick={handleClick}
            >
              Send Code
            </button>
          </div>
        {sendCode && (
          <div className="mb-3" style={{ display: "grid" }}>
          <button type="submit" className="btn btn-danger" id="SignInButton">
            Sign In
          </button>
        </div>
        )}

        <div className="mb-3">
          <p>
            You don't have an account?&nbsp;
            <Link className="text-white" to="/signUp">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </Fragment>
  );
}

export default SignInCode;
