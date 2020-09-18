import React from "react";
import styled from "@emotion/styled";
import { vars } from "../../../styles";
import { Copy } from "react-feather";

const CodeBlockWrap = styled.div`
  background-color: ${vars.blueLighter};
  color: ${vars.greyDark};
  padding: 16px;
  height: 160px;
  position: relative;
  overflow-y: scroll;
  border-radius: ${vars.buttonRadius};

  svg {
    color: ${vars.blue};
    cursor: pointer;

    &:hover {
      color: ${vars.blueDark};
    }
  }

  .copy-icon {
    bottom: 16px;
    right: 16px;
  }
`;

interface CodeBlockProps {
  code: string;
}

export const CodeBlock: React.FunctionComponent<CodeBlockProps> = ({ code }: CodeBlockProps) => {
  const copyToClipboard = (): void => {
    const str = document.getElementById("copy-textarea")?.innerText || "";
    // Needs to be input element to copy so created a temp
    const temporaryDomElement = document.createElement("textarea");
    temporaryDomElement.value = str;
    temporaryDomElement.setAttribute("readonly", "");
    temporaryDomElement.style.position = "absolute";
    temporaryDomElement.style.left = "-9999px";
    document.body.appendChild(temporaryDomElement);
    temporaryDomElement.select();
    document.execCommand("copy");
    document.body.removeChild(temporaryDomElement);
  };

  return (
    <CodeBlockWrap>
      <p className="mb-0" id="copy-textarea">
        {code}
      </p>
      <div className="absolute copy-icon">
        <Copy onClick={copyToClipboard} />
      </div>
    </CodeBlockWrap>
  );
};
