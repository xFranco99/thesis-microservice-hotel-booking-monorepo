import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

function SignInForm() {
  return (
    <Fragment>
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
            <a className="text-white" href="#">
              Forgot password?
            </a>
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
            <Link className="text-white" to="/signUp">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </Fragment>
  );
}

export default SignInForm;
