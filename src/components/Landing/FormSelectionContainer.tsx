import React, { FunctionComponent } from "react";
// import { Redirect } from "react-router";
// import { useConfigContext } from "../../common/context/config";
import { FormSelection } from "./FormSelection";

const forms = [
  {
    name: "Electronic Bill of Lading (Carrier)",
    type: "Transferable",
    img: "./bill_of_lading.png",
  },
  {
    name: "Electronic Promissory Note",
    type: "Transferable",
    img: "./epn.png",
  },
  {
    name: "Warehouse Receipt",
    type: "Transferable",
    img: "warehouse_reciept.png",
  },
  {
    name: "Certificate of Origin",
    type: "Non-Transferable",
    img: "./coo.png",
  },
  {
    name: "Invoice",
    type: "Non-Transferable",
    img: "./invoice.png",
  },
];
const formTypes = ["Transferable", "Non-Transferable"];
export const FormSelectionContainer: FunctionComponent = () => {
  // const { config } = useConfigContext();

  // if (!config) {
  //   return <Redirect to="/" />;
  // }

  return (
    <>
      <div>
        <h1 data-testid="form-selection-title" className="p-8">
          Create Document
        </h1>
      </div>
      <FormSelection forms={forms} formTypes={formTypes} />
    </>
  );
};
