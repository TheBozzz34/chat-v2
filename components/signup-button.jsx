import React from 'react';

const SignupButton = () => {
  return (
    <button
      className="btn btn-primary btn-block ml-2"
      onClick={() =>
        window.location.href = "/register"
      }
    >
      Sign Up
    </button>
  );
};

export default SignupButton;