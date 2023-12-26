import React from "react";
import "./AuthFooter.css";
import { useNavigate } from "react-router-dom";

function AuthFooter({ path }) {
  const navigate = useNavigate();
  const handleAuthToggle = () => {
    if (path === "signin") {
      navigate("/signup");
    } else if (path === "signup") {
      navigate("/signin");
    }
  };
  return (
    <div>
      {path === "signup" ? (
        <p className="auth_toggle_text">
          Already have an account?{" "}
          <span className="auth_toggle_link" onClick={handleAuthToggle}>
            Sign in
          </span>{" "}
        </p>
      ) : (
        <p className="auth_toggle_text">
          Don't have an account?{" "}
          <span className="auth_toggle_link" onClick={handleAuthToggle}>
            Create account
          </span>{" "}
        </p>
      )}
    </div>
  );
}

export default AuthFooter;
