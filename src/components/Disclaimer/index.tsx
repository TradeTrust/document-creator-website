import React, { useEffect, useState } from "react";
import { X } from "react-feather";

export const Disclaimer: React.FunctionComponent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="bg-cerulean-800 text-white py-2 px-0 mb-2" data-testid="old-verifier-banner">
      <div className="container">
        <div className="flex items-start justify-between">
          <div className="flex-1 flex justify-center">
            <p className="mb-0 text-center">
              <strong>Disclaimer:</strong> The Creator tool and Config file are for testing and demonstration purposes
              only. They are not recommended for production or live issuance of documents. Use the TrustVC library for
              production use.
            </p>
          </div>
          <div className="cursor-pointer hover:text-gray-500">
            <X data-testid="disclaimer-close" onClick={() => setShow(false)} />
          </div>
        </div>
      </div>
    </div>
  );
};
