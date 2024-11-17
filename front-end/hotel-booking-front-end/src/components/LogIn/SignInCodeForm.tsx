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
      <h1>Sign In Code</h1>
      <OtpVerifyCode></OtpVerifyCode>
    </Fragment>
  );
}

export default SignInCodeForm;
