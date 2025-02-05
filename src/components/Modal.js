// Modal.js
import React from 'react';
import './Modal.css'; // Add some basic styles

const Modal = ({ show, message, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Are you sure?</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-button confirm" onClick={onConfirm}>
            Yes
          </button>
          <button className="modal-button cancel" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
