import React from "react";
import styled from "@emotion/styled";
import { vars } from "../../../styles";
import { SvgIcon, SvgIconCopy } from "../SvgIcon";

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
    const $temp = document.createElement("textarea");
    $temp.value = str;
    $temp.setAttribute("readonly", "");
    $temp.style.position = "absolute";
    $temp.style.left = "-9999px";
    document.body.appendChild($temp);
    $temp.select();
    document.execCommand("copy");
    document.body.removeChild($temp);
  };

  return (
    <CodeBlockWrap>
      <p className="mb-0" id="copy-textarea">
        {code}
      </p>
      <div className="absolute copy-icon">
        <SvgIcon onClick={copyToClipboard}>
          <SvgIconCopy />
        </SvgIcon>
      </div>
    </CodeBlockWrap>
  );
};
