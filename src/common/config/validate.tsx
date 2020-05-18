import Joi from "@hapi/joi";
import { ConfigFile } from "../../types";

const configFileSchema = Joi.object({
  wallet: Joi.string().required(), // Using string type since it's ethers type for encrypted JSON
});

export const validateConfigFile = configFileSchema.validate;
export const assertConfigFile = (value: ConfigFile): void => Joi.assert(value, configFileSchema);
