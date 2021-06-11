import { Button } from "@govtechsg/tradetrust-ui-components";
import Ajv from "ajv";
import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormsContext } from "../../../common/context/forms";
import { readFileAsCsv, readFileAsJson } from "../../../common/utils";
import { getLogger } from "../../../utils/logger";
import { FormError, FormErrorBanner } from "./../FormErrorBanner";

const { stack } = getLogger("DataFileButton");

type Schema = boolean | Record<string, unknown>;

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
  schema: Schema;
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

  const validateDataFile = (schema: Schema, data: unknown): ValidateDataFile => {
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

  return (
    <>
      {error && (
        <div className="my-2" data-testid="file-read-error">
          <FormErrorBanner formErrorTitle="Uploaded data file format has errors." formError={dataFileError} />
        </div>
      )}
      <div data-testid="data-upload-zone" {...getRootProps()}>
        <input data-testid="config-file-drop-zone" {...getInputProps()} />
        <Button
          data-testid="data-upload-button"
          className="w-full bg-white text-orange border-grey-400 hover:bg-grey-100"
        >
          Upload Data File
        </Button>
      </div>
    </>
  );
};
