import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import tw from "twin.macro";

const spin = keyframes`
  from, 0%, to {
    transform: rotate(360deg);
  }

  0% {
    transform: rotate(0deg);
  }
`;

export const PublishLoader = styled.div`
  ${tw`rounded-full border-4 border-solid border-grey-300 w-full h-full`}
  border-top-color: #00cbbc; // use teal from config later
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: ${spin} 2s linear infinite;
`;
