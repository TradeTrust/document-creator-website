import { v2CoverLetter } from "./forms/v2";
import { v3Invoice } from "./forms/v3";
import tmp from "tmp";
import { Credential, EmptyConfig, Forms } from "./types";
import { generateConfigFile } from "./generator";
import { readFileSync } from "fs";

const localCredential: Credential = {
  network: "local",
  wallet: {
    type: "ENCRYPTED_JSON",
    encryptedJson:
      '{"address":"e0a71284ef59483795053266cb796b65e48b5124","id":"04c746c3-fbef-453a-8c63-5e915021f57a","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"0f6963939595d04cb27a4d4abe689e32"},"ciphertext":"c80c8ca9acb96cf2f87279fef71508a06d4cf166e46e06a8beecd1420f2f525f","kdf":"scrypt","kdfparams":{"salt":"bf52c3386a9235e74a075c533ec1febd6e9221b57d649a2e156775fce984a58e","n":1,"dklen":32,"p":1,"r":8},"mac":"5014d1d53e9294028eb808fbc9dd36394ebec22381946724111b9ee5ab46fd06"}}',
  },
  tokenRegistry: "0x9Eb613a88534E2939518f4ffBFE65F5969b491FF",
  documentStore: "0x63a223e025256790e88778a01f480eba77731d04",
  identityProof: "demo-tradetrust.openattestation.com",
};

const configFile: EmptyConfig = {
  network: "",
  wallet: "",
  forms: [],
};

describe("generateConfigFile", () => {
  it("generate V2 configuration file correctly", () => {
    const v2TestForm: Forms[] = [{ version: "v2", forms: [v2CoverLetter] }];
    const tempConfigFile = tmp.fileSync({ postfix: ".json" });
    generateConfigFile({
      configFile: configFile,
      formsList: v2TestForm,
      credential: localCredential,
      directory: tempConfigFile.name,
      validationBypass: false,
    });
    const fileContent = readFileSync(tempConfigFile.name, "utf8");
    expect(fileContent).toMatchInlineSnapshot(`
      "{
        \\"network\\": \\"local\\",
        \\"wallet\\": {
          \\"type\\": \\"ENCRYPTED_JSON\\",
          \\"encryptedJson\\": \\"{\\\\\\"address\\\\\\":\\\\\\"e0a71284ef59483795053266cb796b65e48b5124\\\\\\",\\\\\\"id\\\\\\":\\\\\\"04c746c3-fbef-453a-8c63-5e915021f57a\\\\\\",\\\\\\"version\\\\\\":3,\\\\\\"Crypto\\\\\\":{\\\\\\"cipher\\\\\\":\\\\\\"aes-128-ctr\\\\\\",\\\\\\"cipherparams\\\\\\":{\\\\\\"iv\\\\\\":\\\\\\"0f6963939595d04cb27a4d4abe689e32\\\\\\"},\\\\\\"ciphertext\\\\\\":\\\\\\"c80c8ca9acb96cf2f87279fef71508a06d4cf166e46e06a8beecd1420f2f525f\\\\\\",\\\\\\"kdf\\\\\\":\\\\\\"scrypt\\\\\\",\\\\\\"kdfparams\\\\\\":{\\\\\\"salt\\\\\\":\\\\\\"bf52c3386a9235e74a075c533ec1febd6e9221b57d649a2e156775fce984a58e\\\\\\",\\\\\\"n\\\\\\":1,\\\\\\"dklen\\\\\\":32,\\\\\\"p\\\\\\":1,\\\\\\"r\\\\\\":8},\\\\\\"mac\\\\\\":\\\\\\"5014d1d53e9294028eb808fbc9dd36394ebec22381946724111b9ee5ab46fd06\\\\\\"}}\\"
        },
        \\"forms\\": [
          {
            \\"name\\": \\"TradeTrust Covering Letter v2\\",
            \\"type\\": \\"VERIFIABLE_DOCUMENT\\",
            \\"defaults\\": {
              \\"$template\\": {
                \\"type\\": \\"EMBEDDED_RENDERER\\",
                \\"name\\": \\"COVERING_LETTER\\",
                \\"url\\": \\"https://generic-templates.tradetrust.io\\"
              },
              \\"issuers\\": [
                {
                  \\"identityProof\\": {
                    \\"type\\": \\"DNS-TXT\\",
                    \\"location\\": \\"demo-tradetrust.openattestation.com\\"
                  },
                  \\"name\\": \\"DEMO DOCUMENT STORE\\",
                  \\"documentStore\\": \\"0x63a223e025256790e88778a01f480eba77731d04\\"
                }
              ]
            },
            \\"schema\\": {
              \\"type\\": \\"object\\",
              \\"properties\\": {
                \\"logo\\": {
                  \\"type\\": \\"string\\",
                  \\"title\\": \\"Document Title\\"
                },
                \\"title\\": {
                  \\"type\\": \\"string\\",
                  \\"title\\": \\"Document Title\\"
                },
                \\"remarks\\": {
                  \\"type\\": \\"string\\",
                  \\"title\\": \\"Remarks\\"
                },
                \\"backgroundColor\\": {
                  \\"type\\": \\"string\\",
                  \\"title\\": \\"Background Color\\"
                },
                \\"titleColor\\": {
                  \\"type\\": \\"string\\",
                  \\"title\\": \\"Title Color\\"
                },
                \\"remarksColor\\": {
                  \\"type\\": \\"string\\",
                  \\"title\\": \\"Remarks Color\\"
                }
              }
            },
            \\"attachments\\": {
              \\"allow\\": true
            },
            \\"uiSchema\\": {
              \\"logo\\": {
                \\"ui:widget\\": \\"file\\",
                \\"ui:options\\": {
                  \\"text\\": \\"Upload Cover Letter Logo\\",
                  \\"accept\\": \\".png, .jpeg, .jpg\\"
                }
              },
              \\"remarks\\": {
                \\"ui:widget\\": \\"textarea\\"
              },
              \\"backgroundColor\\": {
                \\"ui:widget\\": \\"color\\",
                \\"ui:options\\": {
                  \\"emptyValue\\": \\"#ffffff\\"
                }
              },
              \\"titleColor\\": {
                \\"ui:widget\\": \\"color\\",
                \\"ui:options\\": {
                  \\"emptyValue\\": \\"#4e4e50\\"
                }
              },
              \\"remarksColor\\": {
                \\"ui:widget\\": \\"color\\",
                \\"ui:options\\": {
                  \\"emptyValue\\": \\"#4e4e50\\"
                }
              }
            },
            \\"extension\\": \\"tt\\"
          }
        ]
      }"
    `);
  });

  it("generate V3 configuration file correctly", () => {
    const v3TestForm: Forms[] = [{ version: "v3", forms: [v3Invoice] }];
    const tempConfigFile = tmp.fileSync({ postfix: ".json" });
    generateConfigFile({
      configFile: configFile,
      formsList: v3TestForm,
      credential: localCredential,
      directory: tempConfigFile.name,
      validationBypass: false,
    });
    const fileContent = readFileSync(tempConfigFile.name, "utf8");
    expect(fileContent).toMatchInlineSnapshot(`
      "{
        \\"network\\": \\"local\\",
        \\"wallet\\": {
          \\"type\\": \\"ENCRYPTED_JSON\\",
          \\"encryptedJson\\": \\"{\\\\\\"address\\\\\\":\\\\\\"e0a71284ef59483795053266cb796b65e48b5124\\\\\\",\\\\\\"id\\\\\\":\\\\\\"04c746c3-fbef-453a-8c63-5e915021f57a\\\\\\",\\\\\\"version\\\\\\":3,\\\\\\"Crypto\\\\\\":{\\\\\\"cipher\\\\\\":\\\\\\"aes-128-ctr\\\\\\",\\\\\\"cipherparams\\\\\\":{\\\\\\"iv\\\\\\":\\\\\\"0f6963939595d04cb27a4d4abe689e32\\\\\\"},\\\\\\"ciphertext\\\\\\":\\\\\\"c80c8ca9acb96cf2f87279fef71508a06d4cf166e46e06a8beecd1420f2f525f\\\\\\",\\\\\\"kdf\\\\\\":\\\\\\"scrypt\\\\\\",\\\\\\"kdfparams\\\\\\":{\\\\\\"salt\\\\\\":\\\\\\"bf52c3386a9235e74a075c533ec1febd6e9221b57d649a2e156775fce984a58e\\\\\\",\\\\\\"n\\\\\\":1,\\\\\\"dklen\\\\\\":32,\\\\\\"p\\\\\\":1,\\\\\\"r\\\\\\":8},\\\\\\"mac\\\\\\":\\\\\\"5014d1d53e9294028eb808fbc9dd36394ebec22381946724111b9ee5ab46fd06\\\\\\"}}\\"
        },
        \\"forms\\": [
          {
            \\"name\\": \\"TradeTrust Invoice v3\\",
            \\"type\\": \\"VERIFIABLE_DOCUMENT\\",
            \\"defaults\\": {
              \\"version\\": \\"https://schema.openattestation.com/3.0/schema.json\\",
              \\"@context\\": [
                \\"https://www.w3.org/2018/credentials/v1\\",
                \\"https://schemata.openattestation.com/io/tradetrust/Invoice/1.0/invoice-context.json\\",
                \\"https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json\\"
              ],
              \\"type\\": [
                \\"VerifiableCredential\\",
                \\"OpenAttestationCredential\\"
              ],
              \\"issuanceDate\\": \\"2010-01-01T19:23:24Z\\",
              \\"openAttestationMetadata\\": {
                \\"template\\": {
                  \\"type\\": \\"EMBEDDED_RENDERER\\",
                  \\"name\\": \\"INVOICE\\",
                  \\"url\\": \\"https://generic-templates.tradetrust.io\\"
                },
                \\"proof\\": {
                  \\"type\\": \\"OpenAttestationProofMethod\\",
                  \\"method\\": \\"DOCUMENT_STORE\\",
                  \\"value\\": \\"0x63a223e025256790e88778a01f480eba77731d04\\"
                },
                \\"identityProof\\": {
                  \\"type\\": \\"DNS-TXT\\",
                  \\"identifier\\": \\"demo-tradetrust.openattestation.com\\"
                }
              },
              \\"credentialSubject\\": {},
              \\"issuer\\": {
                \\"id\\": \\"https://example.com\\",
                \\"name\\": \\"DEMO DOCUMENT STORE\\",
                \\"type\\": \\"OpenAttestationIssuer\\"
              }
            },
            \\"schema\\": {
              \\"type\\": \\"object\\",
              \\"properties\\": {
                \\"credentialSubject\\": {
                  \\"type\\": \\"object\\",
                  \\"properties\\": {
                    \\"id\\": {
                      \\"type\\": \\"string\\",
                      \\"title\\": \\"Invoice ID\\"
                    },
                    \\"date\\": {
                      \\"type\\": \\"string\\",
                      \\"title\\": \\"Date\\"
                    },
                    \\"customerId\\": {
                      \\"type\\": \\"string\\",
                      \\"title\\": \\"Customer ID\\"
                    },
                    \\"terms\\": {
                      \\"type\\": \\"string\\",
                      \\"title\\": \\"Terms\\"
                    },
                    \\"billFrom\\": {
                      \\"type\\": \\"object\\",
                      \\"title\\": \\"Bill From\\",
                      \\"properties\\": {
                        \\"name\\": {
                          \\"type\\": \\"string\\",
                          \\"title\\": \\"Name\\"
                        },
                        \\"streetAddress\\": {
                          \\"type\\": \\"string\\",
                          \\"title\\": \\"Street Address\\"
                        },
                        \\"city\\": {
                          \\"type\\": \\"string\\",
                          \\"title\\": \\"City\\"
                        },
                        \\"postalCode\\": {
                          \\"type\\": \\"string\\",
                          \\"title\\": \\"Postal Code\\"
                        },
                        \\"phoneNumber\\": {
                          \\"type\\": \\"string\\",
                          \\"title\\": \\"Phone Number\\"
                        }
                      }
                    },
                    \\"billTo\\": {
                      \\"type\\": \\"object\\",
                      \\"title\\": \\"Bill To\\",
                      \\"properties\\": {
                        \\"name\\": {
                          \\"type\\": \\"string\\",
                          \\"title\\": \\"Name\\"
                        },
                        \\"email\\": {
                          \\"type\\": \\"string\\",
                          \\"title\\": \\"Email\\"
                        },
                        \\"company\\": {
                          \\"type\\": \\"object\\",
                          \\"title\\": \\"Bill To Company\\",
                          \\"properties\\": {
                            \\"name\\": {
                              \\"type\\": \\"string\\",
                              \\"title\\": \\"Name\\"
                            },
                            \\"streetAddress\\": {
                              \\"type\\": \\"string\\",
                              \\"title\\": \\"Street Address\\"
                            },
                            \\"city\\": {
                              \\"type\\": \\"string\\",
                              \\"title\\": \\"City\\"
                            },
                            \\"postalCode\\": {
                              \\"type\\": \\"string\\",
                              \\"title\\": \\"Postal Code\\"
                            },
                            \\"phoneNumber\\": {
                              \\"type\\": \\"string\\",
                              \\"title\\": \\"Phone Number\\"
                            }
                          }
                        }
                      }
                    },
                    \\"billableItems\\": {
                      \\"type\\": \\"array\\",
                      \\"title\\": \\"Billable Items\\",
                      \\"items\\": {
                        \\"type\\": \\"object\\",
                        \\"properties\\": {
                          \\"description\\": {
                            \\"type\\": \\"string\\",
                            \\"title\\": \\"Description\\"
                          },
                          \\"quantity\\": {
                            \\"type\\": \\"string\\",
                            \\"title\\": \\"Quantity\\"
                          },
                          \\"unitPrice\\": {
                            \\"type\\": \\"string\\",
                            \\"title\\": \\"Unit Price\\"
                          },
                          \\"amount\\": {
                            \\"type\\": \\"string\\",
                            \\"title\\": \\"Amount\\"
                          }
                        }
                      }
                    },
                    \\"subtotal\\": {
                      \\"type\\": \\"string\\",
                      \\"title\\": \\"Subtotal\\"
                    },
                    \\"tax\\": {
                      \\"type\\": \\"string\\",
                      \\"title\\": \\"Tax (%)\\"
                    },
                    \\"taxTotal\\": {
                      \\"type\\": \\"string\\",
                      \\"title\\": \\"Tax Total\\"
                    },
                    \\"total\\": {
                      \\"type\\": \\"string\\",
                      \\"title\\": \\"Total\\"
                    }
                  }
                }
              }
            }
          }
        ]
      }"
    `);
  });
});
