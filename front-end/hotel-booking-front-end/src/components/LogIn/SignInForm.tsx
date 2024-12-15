import { SyntheticEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import axios, { AxiosError } from "axios";
import { useAuth } from "../../state/AuthProvider";
import { useNavigate } from "react-router-dom";
import { set } from "react-datepicker/dist/date_utils";

function SignInForm() {
  const { setAuth, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [authAlert, setAuthAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Username or password is incorrect"
  );

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
      const apiBaseUrl = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;
      const url = apiBaseUrl + "/api/v1/auth/sign-in";

      const response = await axios.post(url, signInFormData);
      const token: Token = response.data;

      localStorage.setItem("jwtToken", token.access_token);

      setAuth(true);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const e = error as AxiosError;
        if (e.status === 401) {
          setErrorMessage("Username or password is incorrect");
        } else {
          setErrorMessage("We have a problem, please try later");
        }
        setAuthAlert(true);
      }
      setAuth(false);
    }
  };

  return (
    <Fragment>
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit} style={{ paddingTop: "20px" }}>
        <div className="mb-3">
          <input
            autoFocus
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
          {authAlert && <p>{errorMessage}</p>}
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
            <Link
              to="/signInCode"
              state={{ isForgotPassword: true }}
              className="text-white"
              id="ForgotPassword"
            >
              Forgot password?
            </Link>
          </p>
        </div>
        <div className="mb-3">
          <p style={{ display: "flex", justifyContent: "center" }}>
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
