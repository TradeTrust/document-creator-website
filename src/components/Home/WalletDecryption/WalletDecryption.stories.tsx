import React from "react";
import { Container } from "../../Container";
import { WalletDecryption } from "./WalletDecryption";
export default {
  title: "Home|WalletDecryption",
  component: WalletDecryption,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => (
  <Container>
    <WalletDecryption
      isDecrypting={false}
      isIncorrectPassword={false}
      onDecryptConfigFile={alert}
      onResetConfigFile={() => alert("Reset")}
    />
  </Container>
);

export const Decrypting = () => (
  <Container>
    <WalletDecryption
      isDecrypting={true}
      isIncorrectPassword={false}
      onDecryptConfigFile={alert}
      onResetConfigFile={() => alert("Reset")}
    />
  </Container>
);

export const Error = () => (
  <Container>
    <WalletDecryption
      isDecrypting={false}
      onDecryptConfigFile={alert}
      onResetConfigFile={() => alert("Reset")}
      isIncorrectPassword={true}
    />
  </Container>
);
