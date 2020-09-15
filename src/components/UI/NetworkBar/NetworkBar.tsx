import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { vars } from "../../../styles";
import { X } from "react-feather";

const NetworkWrap = styled.div`
  background-color: ${vars.greenDarker};
  color: ${vars.white};
  padding: 8px 0;

  .network {
    text-transform: capitalize;
  }

  svg {
    cursor: pointer;

    &:hover {
      color: ${vars.grey};
    }
  }
`;

interface NetworkBarProps {
  network?: string;
}

export const NetworkBar: React.FunctionComponent<NetworkBarProps> = ({
  network,
}: NetworkBarProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (network) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [network]);

  if (!show) return null;

  return (
    <NetworkWrap data-testid="network-bar">
      <div className="container mx-auto">
        <div className="flex flex-wrap">
          <div className="col-auto ml-auto">
            <p className="mb-0">
              You are currently on <span className="network">{network}</span> network. To change it,
              please upload a new config file.
            </p>
          </div>
          <div className="col-auto ml-auto">
            <X onClick={() => setShow(false)} />
          </div>
        </div>
      </div>
    </NetworkWrap>
  );
};
