import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { getCsvHeaders, getJsonSchema } from "../../../common/utils";
import { getLogger } from "../../../utils/logger";
import { useFormsContext } from "../../../common/context/forms";

const { stack } = getLogger("DataSchemaButton");

interface DataSchemaButton {
  isTransferableRecord: boolean;
}

type DataFileDefault = {
  data: unknown;
  ownership?: {
    beneficiaryAddress: string;
    holderAddress: string;
  };
  fileName: string;
};

export const DataSchemaButton: FunctionComponent<DataSchemaButton> = ({ isTransferableRecord }) => {
  const { currentFormTemplate } = useFormsContext();

  function downloader(data: string, type: string, name: string): void {
    const blob = new Blob([data], { type });
    const uri = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
    window.URL.revokeObjectURL(uri);
  }

  const generateCsvFile = (inputSchemaProperties: string, fileName: string): void => {
    try {
      const headers = Array<string>();
      getCsvHeaders(inputSchemaProperties, headers);
      headers.unshift("fileName");
      if (isTransferableRecord) {
        headers.splice(1, 0, "ownership.beneficiaryAddress", "ownership.holderAddress");
      }
      downloader(headers.join(","), "text/csv", fileName);
    } catch (e) {
      stack(e);
    }
  };

  const generateJsonFile = (inputSchemaProperties: string, fileName: string): void => {
    try {
      const jsonObject = {} as DataFileDefault;
      getJsonSchema(inputSchemaProperties).then((data) => {
        jsonObject.data = data;
        jsonObject.fileName = "fileName";
        if (isTransferableRecord) {
          jsonObject.ownership = {
            beneficiaryAddress: "beneficiaryAddress",
            holderAddress: "holderAddress",
          };
        }
        downloader(JSON.stringify(jsonObject), "application/json", fileName);
      });
    } catch (e) {
      stack(e);
    }
  };

  return (
    <div data-testid="data-download-zone" className="flex mt-5">
      <Button
        data-testid="data-schema-download-button"
        onClick={() =>
          generateJsonFile(
            currentFormTemplate?.schema.properties,
            `${currentFormTemplate?.name}-data-schema` ?? "Data Schema"
          )
        }
        className="flex-1 mr-5 bg-white text-orange border-grey-400 hover:bg-grey-100"
      >
        Download .JSON Data Schema
      </Button>
      <Button
        data-testid="data-schema-download-button"
        onClick={() =>
          generateCsvFile(
            currentFormTemplate?.schema.properties,
            `${currentFormTemplate?.name}-data-schema` ?? "Data Schema"
          )
        }
        className="flex-1 ml-5 bg-white text-orange border-grey-400 hover:bg-grey-100"
      >
        Download .CSV Data Schema
      </Button>
    </div>
  );
};
