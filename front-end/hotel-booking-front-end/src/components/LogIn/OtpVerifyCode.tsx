import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import InputText from "../common/InputText";
import OtpCode from "../common/OtpCode";
import { useState } from "react";

function OtpVerifyCode() {
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleMobileNumberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowOtpInput(true);
  };

  return (
    <div>
      {!showOtpInput ? (
        <form onSubmit={handleMobileNumberSubmit} style={{ paddingTop: "20px" }}>
          <div className="mb-3">
            <InputText
              placeholder="Email or Username"
              id="InputEmailUser4Code"
            ></InputText>
          </div>
          <div className="mb-3" style={{ display: "grid" }}>
            <button type="submit" className="btn btn-danger" id="CodeButton">
              Send Code
            </button>
          </div>
        </form>
      ) : (
        <Fragment>
          <div className="mb-3">
            <p>Insert the code sended at</p>
            <OtpCode></OtpCode>
          </div>
          <div className="mb-3" style={{ display: "grid" }}>
            <button type="submit" className="btn btn-danger" id="SignInButton">
              Verify
            </button>
          </div>
        </Fragment>
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
