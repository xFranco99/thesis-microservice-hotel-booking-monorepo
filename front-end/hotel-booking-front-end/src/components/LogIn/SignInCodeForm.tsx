import React, { useState } from "react";
import OtpVerifyCode from "./OtpVerifyCode";
import { Fragment } from "react/jsx-runtime";

function SignInCodeForm() {
  const [sendCode, setSendCode] = useState(false);

  const handleClick = () => {
    console.log("Clicked");

    setSendCode(!sendCode);
  };

  return (
    <Fragment>
      <h1>Access by Code</h1>
      <p>Use your e-mail to recieve the access code</p>
      <OtpVerifyCode></OtpVerifyCode>
    </Fragment>
  );
}

export default SignInCodeForm;
