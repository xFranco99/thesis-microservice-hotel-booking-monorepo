import { Link } from "react-router-dom";

function SignInCode() {
  return (
    <form style={{ paddingTop: "20px" }}>
      <div className="mb-3">
        <p>Insert the code sended at</p>
        <input
          type="number"
          className="form-control"
          id="InputEmailUser4Code"
          aria-describedby="emailHelp"
          placeholder="Code"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="InputEmailUser4Code"
          aria-describedby="emailHelp"
          placeholder="Email or Username"
        />
      </div>
      <div className="mb-3" style={{ display: "grid" }}>
        <button type="submit" className="btn btn-danger" id="SignInButton">
          Sign In
        </button>
      </div>
      <div className="mb-3" style={{ display: "grid" }}>
        <button type="submit" className="btn btn-danger" id="CodeButton">
          Send Code
        </button>
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
  );
}

export default SignInCode;
