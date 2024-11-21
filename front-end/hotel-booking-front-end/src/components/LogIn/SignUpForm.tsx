import { Link, Navigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthProvider";
import { useState } from "react";
import axios, { AxiosError } from "axios";

function SignUpForm() {
  const { setAuth, auth } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();

  const [signUpFormData, setSignInFormData] = useState<User>({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    role: "USER",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const apiBaseUrl = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;
      const url = apiBaseUrl + "/api/v1/auth/sign-up";

      const response = await axios.post(url, signUpFormData);
      const token: Token = response.data;

      localStorage.setItem("jwtToken", token.access_token);

      setAuth(true);
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const e = error as AxiosError;
        const errorDetail =
          error.response?.data?.detail || "An unknown error occurred.";
        setErrorMessage(errorDetail);
      }
      setAuth(false);
    }
  };

  return (
    <Fragment>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ paddingTop: "20px" }}>
        <div className="row mb-4">
          {errorMessage && <p>{errorMessage}</p>}
          <div className="col">
            <input
              type="text"
              className="form-control"
              id="FirstName"
              aria-describedby="emailHelp"
              placeholder="First Name"
              onChange={handleChange}
              name="first_name"
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              id="LastName"
              aria-describedby="emailHelp"
              placeholder="Last Name"
              onChange={handleChange}
              name="last_name"
            />
          </div>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="PhoneNumber"
            aria-describedby="emailHelp"
            placeholder="Phone Number"
            onChange={handleChange}
            name="phone_number"
            pattern="^\+?[1-9]\d{1,14}$"
            title="Please enter a valid international phone number, starting with a '+' followed by up to 15 digits."
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="Username"
            placeholder="Username"
            onChange={handleChange}
            name="username"
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            id="Password"
            placeholder="Password"
            onChange={handleChange}
            name="password"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            id="Email"
            aria-describedby="emailHelp"
            placeholder="email@example.com"
            onChange={handleChange}
            name="email"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Please enter a valid email address in the format: example@domain.com"
          />
        </div>
        <div className="mb-3" style={{ display: "grid" }}>
          <button type="submit" className="btn btn-danger" id="SignUpButton">
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
