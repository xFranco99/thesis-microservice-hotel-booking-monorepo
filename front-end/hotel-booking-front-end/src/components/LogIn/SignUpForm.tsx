import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

function SignUpForm() {
  return (
    <Fragment>
      <h1>Sign Up</h1>
      <form style={{ paddingTop: "20px" }}>
        <div className="row mb-4">
          <div className="col">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="First Name"
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Last Name"
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-4">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Prefix"
            />
          </div>
          <div className="col-8">
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Phone Number"
            />
          </div>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Username"
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
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="email@example.com"
          />
        </div>
        <div className="mb-3" style={{ display: "grid" }}>
          <button type="submit" className="btn btn-danger">
            Sign Up
          </button>
        </div>
        <div className="mb-3">
          <p>
            Already have an account?&nbsp;
            <Link className="text-white" to="/logIn">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </Fragment>
  );
}

export default SignUpForm;
