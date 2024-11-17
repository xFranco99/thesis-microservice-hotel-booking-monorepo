import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthProvider";
import { useState } from "react";
import axios from "axios";

function SignUpForm() {

  const { setAuth } = useAuth();
  const navigate = useNavigate();

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
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/sign-up",
        signUpFormData
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
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ paddingTop: "20px" }}>
        <div className="row mb-4">
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
