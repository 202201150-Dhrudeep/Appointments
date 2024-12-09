import React from "react";
import "../../styles/styles.css";

const RequestCard = ({ request, onApprove, onDeny }) => {
  return (
    <div className="request-card">
      <h3>{request.name}</h3>
      <p>Time: {request.time}</p>
      <p>Work: {request.work}</p>
      <div className="actions">
        <button className="approve-btn" onClick={onApprove}>
          Approve
        </button>
        <button className="deny-btn" onClick={onDeny}>
          Deny
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
