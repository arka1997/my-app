// Modal.js

import React from "react";

const ModalPassword = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<div className="modalBox" onClick={onClose} >
			<div className="modalUI">
				{children}
			</div>
		</div>
	);
};

export default ModalPassword;
