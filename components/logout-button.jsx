import React from 'react';

const LogoutButton = () => {
  return (
    <button
      className="btn btn-danger btn-block"
      onClick={() =>
        window.location.href = "/api/auth/logout"
      }
    >
      Log Out
    </button>
  );
};

export default LogoutButton;