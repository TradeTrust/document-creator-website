import styled from "@emotion/styled";
import React from "react";
import { Copy } from "react-feather";

const CodeBlockWrap = styled.div`
  padding: 16px;
  height: 160px;
  position: relative;
  overflow-y: scroll;
  border-radius: 4px;

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
    <CodeBlockWrap className="bg-blue-300">
      <p className="mb-0" id="copy-textarea">
        {code}
      </p>
      <div className="absolute copy-icon">
        <Copy onClick={copyToClipboard} />
      </div>
    </CodeBlockWrap>
  );
};
