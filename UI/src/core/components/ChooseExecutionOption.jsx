// components/ChooseExecutionOption.jsx
import React, { useState } from 'react';
import { FaCloud, FaServer, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ChooseExecutionOption = ({ onSelectOption, onCancel }) => {
  const [hoveredOption, setHoveredOption] = useState(null);

  return (
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
        <h2 className="modal-title" style={{ color: 'white' }}>Choose Execution Method</h2>
        <p className="modal-subtitle">Select where you want to run your performance test</p>
        
        <div className="option-buttons">
          <motion.button 
            onClick={() => onSelectOption("local")} 
            className={`launch-btn ${hoveredOption === 'local' ? 'btn-hovered' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHoveredOption('local')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <div className="btn-content">
              <div className="btn-icon">
                <FaServer size={24} />
                {hoveredOption === 'local' && (
                  <motion.span 
                    className="pulse-dot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </div>
              <div className="btn-text">
                <h3>Run Locally</h3>
                <p>Execute test on your local machine using K6</p>
              </div>
            </div>
          </motion.button>

          <motion.button 
            onClick={() => onSelectOption("k6-operator")} 
            className={`launch-btn cloud ${hoveredOption === 'cloud' ? 'btn-hovered' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHoveredOption('cloud')}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <div className="btn-content">
              <div className="btn-icon">
                <FaCloud size={24} />
                {hoveredOption === 'cloud' && (
                  <motion.span 
                    className="pulse-dot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </div>
              <div className="btn-text">
                <h3>K6 Operator VM</h3>
                <p>Run in cloud environment with distributed load</p>
              </div>
            </div>
          </motion.button>
        </div>

        <div className="modal-actions">
          <motion.button 
            className="cancel-btn"
            onClick={onCancel}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Back
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
          max-width: 500px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          color: white;
          border: 1px solid #4a5568;
        }
        
        .modal-title {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color:rgb(255, 255, 255);
          text-align: center;
        }
        
        .modal-subtitle {
          color: #a0aec0;
          text-align: center;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }
        
        .option-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .launch-btn {
          background: #2d3748;
          border: none;
          border-radius: 10px;
          padding: 1.5rem;
          color: white;
          cursor: pointer;
          text-align: left;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .launch-btn.cloud {
          background: linear-gradient(135deg, #4299e1, #3182ce);
        }
        
        .launch-btn.btn-hovered {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .btn-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .btn-icon {
          position: relative;
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .pulse-dot {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }
        
        .btn-text h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #e2e8f0;
        }
        
        .btn-text p {
          margin: 0.3rem 0 0;
          font-size: 0.85rem;
          color: #a0aec0;
        }
        
        .modal-actions {
          display: flex;
          justify-content: center;
        }
        
        .cancel-btn {
          background: none;
          border: 1px solid #4a5568;
          color: #a0aec0;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }
        
        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
        }
      `}</style>
    </motion.div>
  );
};

export default ChooseExecutionOption;