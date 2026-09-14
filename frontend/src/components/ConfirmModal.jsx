import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger"
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <h3 className={`modal-title ${type}`}>{title}</h3>
          <p className="modal-message">{message}</p>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
            <button className={`btn-confirm ${type}`} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
