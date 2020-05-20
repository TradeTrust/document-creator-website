import React, { FunctionComponent } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { NavigationBar } from "../NavigationBar";
import { FormSelection } from "./FormSelection";

// interface FormSelection {
//   config: Config;
// }

// export const FormSelection: FunctionComponent<FormSelection> = ({ config }) => {
//   return (
//     <Container>
//       <h1>Successfully decrypted wallet</h1>
//       <div data-testid="wallet-info">Wallet Address: {config.wallet.address}</div>
//     </Container>
//   );
// };

export const FormSelectionContainer: FunctionComponent = () => {
  const { config, setConfig } = useConfigContext();
  const logout = (): void => setConfig(undefined);
  if (!config) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <NavigationBar logout={logout} />
      <div>
        <FormSelection config={config} />
      </div>
    </>
  );
};
