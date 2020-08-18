import React, { FunctionComponent } from "react";
import { FormEntry } from "../../../types";
import { Container } from "../../Container";
import { PublishLoader } from "../../UI/PublishLoader";
import { Wrapper } from "../../UI/Wrapper";

interface PublishingProps {
  forms: FormEntry[];
}

export const PublishingScreen: FunctionComponent<PublishingProps> = ({ forms }) => {
  return (
    <Container>
      <Wrapper>
        <div className="container mx-auto h-auto flex justify-center flex-col items-center mt-32">
          <div className="text-grey-dark font-bold text-lg">
            Please wait while we are publishing the document(s).
          </div>
          <div className="text-grey-dark font-medium text-lg flex flex-col justify-center items-center text-xl mt-24">
            <PublishLoader />
            Publishing <span className="text-blue font-bold">{forms.length}</span> document(s)
          </div>
        </div>
      </Wrapper>
    </Container>
  );
};
