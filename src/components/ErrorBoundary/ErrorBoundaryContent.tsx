import { FunctionComponent } from "react";
import { ErrorPage } from "@govtechsg/tradetrust-ui-components";
import { Link } from "react-router-dom";

export const ErrorBoundaryContent: FunctionComponent<{
  error?: string;
}> = ({ error }) => {
  const description = error ? error : "TradeTrust has encountered an issue, please try again later.";
  return (
    <ErrorPage pageTitle="ERROR" header="Something Went Wrong" description={description} image="/error-boundary.png">
      <h3 className="font-normal my-2 sm:my-4 text-lg sm:text-2xl">
        Go to
        <Link className="text-cerulean-200" to="/">
          {" "}
          Homepage
        </Link>
        ?
      </h3>
    </ErrorPage>
  );
};
