import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GeneratePlanButton.css";
import runnerLoadingGif from "../assets/running.gif";

const GeneratePlanButton = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/plans/generate-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      navigate("/training-plan");
    } catch (err) {
      setError("Could not generate training plan. Please try again.");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <>
      {loading && (
        <div style={{ 
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.9)",
          zIndex: 1000
        }}>
          <img 
            src={runnerLoadingGif} 
            alt="Running animation" 
            style={{
              width: "120px",
              height: "120px",
              objectFit: "contain",
              animation: "bounce 1s infinite"
            }}
          />
          <p style={{ marginTop: "16px", fontSize: "18px", color: "#666" }}>
            Generating your personalized plan...
            <br />
            <span style={{ display: "inline-block", marginLeft: "24px" }}>
            This may take a few seconds.
            </span>
          </p>
        </div>
      )}
      <section className="generate-plan-section">
        <button
          className="generate-plan-btn"
          onClick={handleGenerate}
          disabled={loading || !userId}
          >
          <h2>+</h2>
          {loading ? "Generating..." : "Update Training Plan"}
        </button>
        {error && <div className="error-message">{error}</div>}
      </section>
    </>
  );
};

export default GeneratePlanButton;