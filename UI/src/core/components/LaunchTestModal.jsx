// components/LaunchTestModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaPlay, FaTimes } from "react-icons/fa";
import ChooseExecutionOption from "./ChooseExecutionOption";

const LaunchTestModal = ({ isOpen, onClose, onLaunch }) => {
  const [stages, setStages] = useState([{ duration: '', target: '' }]);
  const [showExecutionOptions, setShowExecutionOptions] = useState(false);

  const handleStageChange = (index, field, value) => {
    const updated = [...stages];
    updated[index][field] = value;
    setStages(updated);
  };

  const handleAddStage = () => {
    setStages([...stages, { duration: '', target: '' }]);
  };

  const handleLaunchTest = () => {
    setShowExecutionOptions(true);
  };

  const handleSelectOption = (option) => {
    const formatted = stages.map(stage => ({
      duration: stage.duration.endsWith('s') ? stage.duration : `${stage.duration}s`,
      target: parseInt(stage.target),
    }));

    onLaunch(formatted, option);
    setShowExecutionOptions(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {showExecutionOptions ? (
        <ChooseExecutionOption
          onSelectOption={handleSelectOption}
          onCancel={() => setShowExecutionOptions(false)}
        />
      ) : (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <h2 className="modal-title" style={{ color: 'white' }}>Launch Load Test</h2>
            <p className="modal-subtitle">Configure your test stages below</p>

            <div className="stages-container">
              {stages.map((stage, index) => (
                <motion.div 
                  className="stage-row"
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="stage-header">
                    <span className="stage-number">Stage {index + 1}</span>
                  </div>
                  <div className="stage-fields">
                    <div className="field">
                      <label>Duration (seconds)</label>
                      <input
                        type="number"
                        value={stage.duration}
                        onChange={(e) => handleStageChange(index, 'duration', e.target.value)}
                        placeholder="e.g. 30"
                        min="1"
                      />
                    </div>
                    <div className="field">
                      <label>Target VUs</label>
                      <input
                        type="number"
                        value={stage.target}
                        onChange={(e) => handleStageChange(index, 'target', e.target.value)}
                        placeholder="e.g. 100"
                        min="1"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button 
              className="add-stage"
              onClick={handleAddStage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="icon" />
              Add Another Stage
            </motion.button>

            <div className="modal-actions">
              <motion.button 
                className="launch-btn"
                onClick={handleLaunchTest}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={!stages.every(s => s.duration && s.target)}
              >
                <FaPlay className="icon" />
                Launch Test
              </motion.button>
              <motion.button 
                className="cancel-btn"
                onClick={onClose}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTimes className="icon" />
                Cancel
              </motion.button>
            </div>
          </motion.div>

          <style jsx>{`
            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(0, 0, 0, 0.7);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
              backdrop-filter: blur(5px);
            }
            
            .modal-content {
              background: linear-gradient(145deg, #2d3748, #1a202c);
              border-radius: 12px;
              padding: 2rem;
              width: 90%;
              max-width: 600px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
              color: white;
              border: 1px solid #4a5568;
            }
            
            .modal-title {
              font-size: 1.5rem;
              margin-bottom: 0.5rem;
              color: #e2e8f0;
              text-align: center;
            }
            
            .modal-subtitle {
              color: #a0aec0;
              text-align: center;
              margin-bottom: 2rem;
              font-size: 0.9rem;
            }
            
            .stages-container {
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
              margin-bottom: 1.5rem;
              max-height: 60vh;
              overflow-y: auto;
              padding-right: 8px;
            }
            
            .stage-row {
              background: rgba(45, 55, 72, 0.5);
              border-radius: 8px;
              padding: 1rem;
              border: 1px solid #4a5568;
            }
            
            .stage-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1rem;
            }
            
            .stage-number {
              font-weight: 600;
              color: #e2e8f0;
              font-size: 0.95rem;
            }
            
            .stage-fields {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1rem;
            }
            
            .field {
              display: flex;
              flex-direction: column;
            }
            
            .field label {
              font-size: 0.8rem;
              color: #a0aec0;
              margin-bottom: 0.5rem;
            }
            
            .field input {
              background: #1a202c;
              border: 1px solid #4a5568;
              border-radius: 6px;
              padding: 0.75rem;
              color: white;
              font-size: 0.9rem;
              transition: all 0.2s ease;
            }
            
            .field input:focus {
              outline: none;
              border-color: #4299e1;
              box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
            }
            
            .add-stage {
              background: rgba(66, 153, 225, 0.1);
              border: 1px dashed #4299e1;
              color: #4299e1;
              padding: 0.75rem 1rem;
              border-radius: 6px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              width: 100%;
              margin-bottom: 1.5rem;
              font-size: 0.9rem;
              transition: all 0.2s ease;
            }
            
            .add-stage:hover {
              background: rgba(66, 153, 225, 0.2);
            }
            
            .modal-actions {
              display: flex;
              justify-content: space-between;
              gap: 1rem;
            }
            
            .launch-btn {
              background: #4299e1;
              border: none;
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-weight: 500;
              flex: 1;
              justify-content: center;
            }
            
            .launch-btn:disabled {
              background: #4a5568;
              cursor: not-allowed;
              opacity: 0.7;
            }
            
            .cancel-btn {
              background: none;
              border: 1px solid #4a5568;
              color: #a0aec0;
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              transition: all 0.2s ease;
            }
            
            .cancel-btn:hover {
              background: rgba(255, 255, 255, 0.05);
              color: #e2e8f0;
            }
            
            .icon {
              font-size: 0.9rem;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LaunchTestModal;