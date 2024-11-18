import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import InputText from "../common/InputText";
import OtpCode from "../common/OtpCode";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../state/AuthProvider";
import { useNavigate } from "react-router-dom";

interface Props {
  isForgotPassword?: boolean;
}

function OtpVerifyCode({ isForgotPassword = false }: Props) {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [signInFormData, setSignInFormData] = useState<SignInInput>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAccessWithCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const apiBaseUrl = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;
      const url =
        apiBaseUrl +
        "/api/v1/auth/access-with-code?email=" +
        signInFormData.username;

      const response = await axios.post(url);
      const token: Token = response.data;

      localStorage.setItem("accessWithCodeToken", token.access_token);
      setShowOtpInput(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token_access = localStorage.getItem("accessWithCodeToken");
      const apiBaseUrl = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;

      const url = apiBaseUrl + "/api/v1/auth/validate-otp";

      const payload = {
        otp: otpCode,
      };

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `${token_access}`,
        },
      });
      const token: Token = response.data;

      localStorage.removeItem("accessWithCodeToken");
      localStorage.setItem("jwtToken", token.access_token);

      if (isForgotPassword) {
        setShowOtpInput(false);
        setShowChangePassword(true);
      } else {
        setAuth(true);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token_access = localStorage.getItem("jwtToken");
      const apiBaseUrl = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;

      const url = apiBaseUrl + "/api/v1/auth/reset-password";

      const payload = {
        new_password: signInFormData.password,
      };
      console.log(payload);
      const response = await axios.put(url, payload, {
        headers: {
          Authorization: `${token_access}`,
        },
      });

      setShowOtpInput(false);
      setShowChangePassword(false);

      setAuth(true);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {!showOtpInput ? (
        <form
          onSubmit={
            showChangePassword ? handleChangePassword : handleAccessWithCode
          }
          style={{ paddingTop: "20px" }}
        >
          <div className="mb-3">
            <input
              type={showChangePassword ? "password" : "text"}
              className="form-control"
              placeholder={
                showChangePassword ? "New Password" : "Email or Username"
              }
              id="InputEmailUser4Code"
              name={showChangePassword ? "password" : "username"}
              onChange={handleChange}
              value={
                showChangePassword
                  ? signInFormData.password
                  : signInFormData.username
              }
            />
          </div>
          <div className="mb-3" style={{ display: "grid" }}>
            <button type="submit" className="btn btn-danger" id="CodeButton">
              Send Code
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleCheckCode}>
          <div className="mb-3">
            <p>Insert the code sended at</p>
            <OtpCode length={6} onChange={(code) => setOtpCode(code)} />
          </div>
          <div className="mb-3" style={{ display: "grid" }}>
            <button type="submit" className="btn btn-danger" id="SignInButton">
              Verify
            </button>
          </div>
        </form>
      )}
      <div className="mb-3">
        <p>
          You don't have an account?&nbsp;
          <Link className="text-white" to="/signUp">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default OtpVerifyCode;
