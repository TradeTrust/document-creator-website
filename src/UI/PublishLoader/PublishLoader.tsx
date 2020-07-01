import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { vars } from "../../styles";

const spin = keyframes`
  from, 0%, to {
    transform: rotate(360deg); 
  }
  
  0% { 
    transform: rotate(0deg); 
  }
`;

export const PublishLoader = styled.div`
  ${tw`rounded-full border-8 border-solid border-grey-lighter w-48 h-48 absolute`}
  border-top: 8px solid ${vars.teal};
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: ${spin} 2s linear infinite;
`;
