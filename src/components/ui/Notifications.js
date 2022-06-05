import React, { useMemo } from "react";
import { Alert } from "react-bootstrap";

const Notification = ({ text, status }) => {
  const variant = useMemo(() => {
    switch (status) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      default:
        return "danger";
    }
  }, [status])

  return (
    <Alert variant={variant} className="my-2">
      <span>{text}</span>
    </Alert>
  )
};

const NotificationSuccess = ({ text }) => (
  <div>
    <i className="bi bi-check-circle-fill text-success mx-2" />
    <span className="text-secondary mx-1">{text}</span>
  </div>
);

const NotificationError = ({ text }) => (
  <div>
    <i className="bi bi-x-circle-fill text-danger mx-2" />
    <span className="text-secondary mx-1">{text}</span>
  </div>
);

export { Notification, NotificationSuccess, NotificationError };
