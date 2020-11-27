import React, { FunctionComponent } from "react";
import { Container } from "../../Container";
import { WalletDecryption } from "./WalletDecryption";
export default {
  title: "Home/WalletDecryption",
  component: WalletDecryption,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default: FunctionComponent = () => (
  <Container>
    <WalletDecryption
      decryptProgress={0}
      isIncorrectPassword={false}
      onDecryptConfigFile={alert}
      onResetConfigFile={() => alert("Reset")}
    />
  </Container>
);

export const Decrypting: FunctionComponent = () => (
  <Container>
    <WalletDecryption
      decryptProgress={0.75}
      isIncorrectPassword={false}
      onDecryptConfigFile={alert}
      onResetConfigFile={() => alert("Reset")}
    />
  </Container>
);

export const Error: FunctionComponent = () => (
  <Container>
    <WalletDecryption
      decryptProgress={0}
      onDecryptConfigFile={alert}
      onResetConfigFile={() => alert("Reset")}
      isIncorrectPassword={true}
    />
  </Container>
);
