import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@govtechsg/tradetrust-ui-components";
import { Wrapper } from "../components/UI/Wrapper";
import { ContentFrame } from "../components/UI/ContentFrame";

export const PageLogout: FunctionComponent = () => {
  return (
    <Wrapper>
      <h2 className="mb-8">Logged out</h2>
      <ContentFrame>
        <div className="max-w-xl w-100 p-4 font-normal rounded-xl bg-white shadow-xl">
          <p>
            You’ve been inactive for a while, and we have logged you out for security reasons. To get back in, just log
            in.
          </p>
          <Link className="text-cerulean-300" to="/">
            <Button className="bg-cerulean-500 text-white hover:bg-cerulean-800 mt-4">Login</Button>
          </Link>
        </div>
      </ContentFrame>
    </Wrapper>
  );
};
