// components/LaunchTestModal.jsx
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

  const handleLaunchTest = () => {
    const formatted = stages.map(stage => ({
      duration: stage.duration.endsWith('s') ? stage.duration : `${stage.duration}s`,
      target: parseInt(stage.target),
    }));
    onLaunch(formatted);
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
              type="number"
              value={stage.duration}
              onChange={(e) => handleStageChange(index, 'duration', e.target.value)}
              style={{marginTop:10}}
            />
          </div>
          <div className="field">
            <label>Target</label>
            <input
              type="number"
              value={stage.target}
              onChange={(e) => handleStageChange(index, 'target', e.target.value)}
              style={{marginTop:10}}
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
