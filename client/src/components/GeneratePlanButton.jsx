import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GeneratePlanButton.css";

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
    }
  };

  return (
    <section className="generate-plan-section">
      <h2>AI Training Plan</h2>
      <button
        className="generate-plan-btn"
        onClick={handleGenerate}
        disabled={loading || !userId}
      >
        {loading ? "Generating..." : "Generate Training Plan"}
      </button>
      {error && <div className="error-message">{error}</div>}
    </section>
  );
};

export default GeneratePlanButton;