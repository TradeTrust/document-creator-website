import Joi from "@hapi/joi";
import { ConfigFile } from "../../types";

const configFileSchema = Joi.object({
  wallet: Joi.string().required(), // Using string type since it's ethers type for encrypted JSON
  forms: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        type: Joi.string().allow("TRANSFERABLE_RECORD", "VERIFIABLE_DOCUMENT").only().required(),
        defaults: Joi.object().required(),
        schema: Joi.object().required(),
      })
    )
    .required(),
});

export const validateConfigFile = configFileSchema.validate;
export const assertConfigFile = (value: ConfigFile): void => Joi.assert(value, configFileSchema);
