import React from "react";

const LoginButton = () => {
  return (
          <button
            className="btn btn-primary btn-block"
            onClick={() => redirect()}
          >
            Log In
          </button>
  );
};

export default LoginButton;

function redirect() {
    window.location.href = "/api/auth/login";
}