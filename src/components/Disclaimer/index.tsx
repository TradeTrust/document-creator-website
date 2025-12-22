import React from "react";

export const Disclaimer: React.FunctionComponent = () => {
  return (
    <div className="bg-cerulean-800 text-white py-2 px-0" data-testid="old-verifier-banner">
      <div className="container">
        <div className="flex flex-wrap">
          <div className="col-auto flex items-center justify-between w-full">
            <p className="mb-0">
              <strong>Disclaimer:</strong> The Creator tool and Config file are for testing and demonstration purposes
              only. They are not recommended for production or live issuance of documents. Use the TrustVC library for
              production use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
