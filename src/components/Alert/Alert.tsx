// See https://tailwindcss.com/components/alerts/
import React, { FunctionComponent } from "react";

interface Alert {
  title?: string;
  message?: string;
}

export const ErrorAlert: FunctionComponent<Alert> = ({ title, message }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
    {title && <p className="font-bold">{title}</p>}
    {message && <p>{message}</p>}
  </div>
);
