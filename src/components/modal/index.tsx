import React from 'react';
import './modal.css'

const Modal = ({ isOpen, onClose, children, height, width }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ height, width }}>
      <div className="modal" style={{ height, width }}>
        <button className="close-button" onClick={() => onClose(false)}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
