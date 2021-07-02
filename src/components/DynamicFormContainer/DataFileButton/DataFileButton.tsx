import { Button } from "@govtechsg/tradetrust-ui-components";
import Ajv, { AnySchema } from "ajv";
import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormsContext } from "../../../common/context/forms";
import { readFileAsCsv, readFileAsJson } from "../../../common/utils";
import { getLogger } from "../../../utils/logger";
import { FormError, FormErrorBanner } from "./../FormErrorBanner";
import { HelpCircle } from "react-feather";

const { stack } = getLogger("DataFileButton");

const text = {
  header: "You can either upload data file(.JSON or .CSV) to pre-fill fields on this form or enter the fields manually",
  buttonText: "Upload Data File",
  downloadJson: "Download .JSON Data Schema",
  downloadCsv: "Download .CSV Data Schema",
};

type DataFileDefault = {
  data: unknown;
  ownership?: {
    beneficiaryAddress: string;
    holderAddress: string;
  };
};

type DataFileCsv = JSON[];

type DataFileUpload = DataFileDefault | DataFileCsv;

interface DataFileButton {
  onDataFile: (dataFile: unknown) => void;
  schema: AnySchema;
}

interface ValidateDataFile {
  isValidated: boolean;
  errors: FormError;
}

interface GetDataFileBasedOnExtension {
  dataFile: DataFileUpload;
  dataToValidate: unknown;
}

export const DataFileButton: FunctionComponent<DataFileButton> = ({ onDataFile, schema }) => {
  const { currentFormTemplate } = useFormsContext();

  const [error, setError] = useState(false);
  const [dataFileError, setDataFileError] = useState<FormError>(null);

  const getDataFileBasedOnExtension = async (file: File): Promise<GetDataFileBasedOnExtension> => {
    let dataFile;
    let dataToValidate;
    if (file.name.indexOf(".csv") > 0) {
      dataFile = await readFileAsCsv(file, currentFormTemplate?.headers);
      dataToValidate = dataFile[0]; // use 1 item for fields validation
    } else {
      dataFile = await readFileAsJson<DataFileDefault>(file);
      dataToValidate = dataFile.data;
    }
    return { dataFile, dataToValidate };
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const validateDataFile = (schema: AnySchema, data: unknown): ValidateDataFile => {
    const ajv = new Ajv({ allErrors: true });
    const isValidated = ajv.validate(schema, data) as boolean;
    return { isValidated, errors: ajv.errors };
  };

  const onDrop = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      const { dataFile, dataToValidate } = await getDataFileBasedOnExtension(file);
      const { isValidated, errors } = validateDataFile(schema, dataToValidate);

      if (!isValidated) {
        setError(true);
        setDataFileError(errors);
        return;
      }

      setError(false);
      setDataFileError(null);

      onDataFile(dataFile);
    } catch (e) {
      stack(e);

      setError(true);
      setDataFileError([
        // ajv set error manually, printing out error message on UI
        {
          instancePath: "",
          keyword: "type",
          message: e.message,
          params: {},
          schemaPath: "#/type",
        },
      ]);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  console.log("schema: ", schema);

  // const JsonData = ()

  // console.log("Data: ", JsonData);

  // TODO: when change to Tailwindcss v2 for ui Update please update the background color, or use a color that is closes to this color.
  return (
    <>
      {error && (
        <div className="my-2" data-testid="file-read-error">
          <FormErrorBanner formErrorTitle="Uploaded data file format has errors." formError={dataFileError} />
        </div>
      )}
      <div className="p-8 font-light" style={{ backgroundColor: "#FFECA7" }}>
        <p className="text-sm font-hairline mb-4">{text.header}</p>
        <div className="mb-4" data-testid="data-upload-zone" {...getRootProps()}>
          <input data-testid="config-file-drop-zone" {...getInputProps()} />
          <Button
            data-testid="data-upload-button"
            className="w-full bg-white text-orange border-grey-400 hover:bg-grey-100"
          >
            {text.buttonText}
          </Button>
        </div>
        <div className="flex text-sm justify-between text-grey-800">
          <div className="flex items-end">
            <HelpCircle className="h-5 w-5" />
            <a href="/downloads/sample-data.json" className="underline ml-2 cursor-pointer" download="sample-data.json">
              {text.downloadJson}
            </a>
          </div>
          <div className="flex items-end">
            <HelpCircle className="h-5 w-5" />
            <a href="/downloads/sample-data.csv" className="underline ml-2 cursor-pointer" download="sample-data.csv">
              {text.downloadCsv}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
