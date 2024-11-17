import { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import axios from "axios";
import { useAuth } from "../../state/AuthProvider";
import { useNavigate } from "react-router-dom";

function SignInForm() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [signInFormData, setSignInFormData] = useState<SignInInput>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/sign-in",
        signInFormData
      );
      const token: Token = response.data;

      localStorage.setItem("jwtToken", token.access_token);

      setAuth(true);
      navigate("/");
    } catch (error) {
      console.error(error);
      setAuth(false);
    }
  };

  return (
    <Fragment>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} style={{ paddingTop: "20px" }}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="InputEmailUser"
            name="username"
            aria-describedby="emailHelp"
            placeholder="Email or Username"
            onChange={handleChange}
            value={signInFormData.username}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            id="InputPassword"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={signInFormData.password}
          />
        </div>
        <div className="mb-3" style={{ display: "grid" }}>
          <button type="submit" className="btn btn-danger" id="SignInButton">
            Sign In
          </button>
        </div>
        <h3 style={{ display: "flex", justifyContent: "center" }}>OR</h3>
        <div className="mb-3" style={{ display: "grid" }}>
          <Link
            to="/signInCode"
            className="btn btn-outline-light"
            id="SignInCodeButton"
          >
            Use a Sign-In Code
          </Link>
        </div>
        <div className="mb-3">
          <p style={{ display: "flex", justifyContent: "center" }}>
            <a className="text-white" href="/signInCode">
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
