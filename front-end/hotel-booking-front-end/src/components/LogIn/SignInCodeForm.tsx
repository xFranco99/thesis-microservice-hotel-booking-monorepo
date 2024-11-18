import React, { useState } from "react";
import OtpVerifyCode from "./OtpVerifyCode";
import { Fragment } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";

function SignInCodeForm() {

  const location = useLocation();
  const isForgotPassword = location.state?.isForgotPassword || false;

  return (
    <Fragment>
      {isForgotPassword ? <h1>Reset Password</h1> : <h1>Access by Code</h1>}
      <p>Use your e-mail to recieve the access code</p>
      <OtpVerifyCode isForgotPassword={isForgotPassword}></OtpVerifyCode>
    </Fragment>
  );
}

export default SignInCodeForm;
