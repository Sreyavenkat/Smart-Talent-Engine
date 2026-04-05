import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay">
        <h1 className="title">Smart Talent Engine</h1>
        <p className="subtitle">
          AI-powered resume ranking & intelligent candidate matching
        </p>

        <button
          className="start-btn"
          onClick={() => navigate("/dashboard")}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}