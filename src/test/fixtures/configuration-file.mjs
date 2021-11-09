import * as V2DocumentTypes from "./forms/v2/index.mjs";
import * as V3DocumentTypes from "./forms/v3/index.mjs";

export const configFileV2 = {
  network: "",
  wallet: {},
  forms: [...Object.values(V2DocumentTypes)],
  documentStorage: {
    apiKey: "randomKey",
    url: "",
  },
};

export const configFileV3 = {
  network: "",
  wallet: {},
  forms: [...Object.values(V3DocumentTypes)],
  documentStorage: {
    apiKey: "randomKey",
    url: "",
  },
};
