import React, { useState } from "react";

const LaunchTestModal = ({ isOpen, onClose, onLaunch }) => {
  if (!isOpen) return null;

  const [stages, setStages] = useState([{ duration: '', target: '' }]);

  const handleStageChange = (index, field, value) => {
    const updated = [...stages];
    updated[index][field] = value;
    setStages(updated);
  };

  const handleAddStage = () => {
    setStages([...stages, { duration: '', target: '' }]);
  };

  const handleLaunchTest = async () => {
    const formatted = stages.map(stage => ({
      duration: stage.duration.endsWith('s') ? stage.duration : `${stage.duration}s`,
      target: parseInt(stage.target, 10),
    }));

    if (onLaunch) {
      onLaunch(formatted);
    }

    try {
      const token = sessionStorage.getItem("authToken") || "";

      console.log("JWT token:", token); //Debug token

      if (!token) {
        alert("No JWT token found. Please login first.");
        return;
      }

      const response = await fetch("http://localhost:6060/api/scenarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formatted)
      });

      if (!response.ok) {
        throw new Error(`Failed to launch test: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Scenario created:", result);
      alert("Scenario launched successfully!");
      onClose();

    } catch (error) {
      console.error("Error launching scenario:", error);
      alert("Error launching scenario.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Launch Load Test</h2>

        {stages.map((stage, index) => (
          <div className="stage-row" key={index}>
            <div className="field">
              <label>Duration :</label>
              <input
                type="text"
                value={stage.duration}
                onChange={(e) => handleStageChange(index, 'duration', e.target.value)}
                style={{ marginTop: 10 }}
                placeholder="e.g. 2s"
              />
            </div>
            <div className="field">
              <label>Target</label>
              <input
                type="number"
                value={stage.target}
                onChange={(e) => handleStageChange(index, 'target', e.target.value)}
                style={{ marginTop: 10 }}
              />
            </div>
          </div>
        ))}

        <button className="add-stage" onClick={handleAddStage}>+ Add Stage</button>

        <div className="modal-actions">
          <button className="launch-btn" onClick={handleLaunchTest}>Launch Test</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LaunchTestModal;
