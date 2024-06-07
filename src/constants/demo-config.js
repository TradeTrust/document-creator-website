export const DEMO_CONFIG = {
  network: "stability",
  wallet: {
    type: "ENCRYPTED_JSON",
    encryptedJson:
      '{"address":"f11e3850f0bb8c72925c329ec446a2026cd4bb94","id":"d3993295-32ed-40e1-8e44-3ca8bd84fbeb","version":3,"crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"91325d439195204264b16f5a8ea33e80"},"ciphertext":"6608eace3ffbf32e898919ac00babe014aab140ffd6eebd4c5b0e71577378e51","kdf":"scrypt","kdfparams":{"salt":"6f3ea4ca2f20b5e3a851738e719f576107462d0f48fd02efffe20e15bab3dbfa","n":131072,"dklen":32,"p":1,"r":8},"mac":"c7418015ab04f60c9cf58d9670799da0e8ea00bb893e61ca73fa4ca25756aecc"}}',
  },
  forms: [
    {
      name: "TradeTrust Bill of Lading v2 (Carrier)",
      type: "TRANSFERABLE_RECORD",
      defaults: {
        $template: {
          type: "EMBEDDED_RENDERER",
          name: "BILL_OF_LADING_CARRIER",
          url: "https://generic-templates.tradetrust.io",
        },
        issuers: [
          {
            name: "DEMO TOKEN REGISTRY",
            tokenRegistry: "0x7d7C1C8B4eB6edD23BCA43F4d032EBb21c9258F9",
            identityProof: {
              type: "DNS-TXT",
              location: "sandbox.tradetrust.io",
            },
            revocation: {
              type: "NONE",
            },
          },
        ],
        network: {
          chain: "FREE",
          chainId: "101010",
        },
      },
      schema: {
        type: "object",
        additionalProperties: false,
        required: ["blNumber", "scac"],
        properties: {
          blNumber: {
            type: "string",
            title: "BL Number",
          },
          scac: {
            type: "string",
            title: "Standard Carrier Alpha Code (SCAC)",
          },
          carrierName: {
            title: "Signed for the Carrier",
            type: "string",
          },
          logo: {
            type: "string",
            title: "Company Logo",
          },
          shipper: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              address: {
                type: "object",
                properties: {
                  street: {
                    type: "string",
                  },
                  country: {
                    type: "string",
                  },
                },
              },
            },
          },
          onwardInlandRouting: {
            type: "string",
            title: "Onward Inland Routing",
          },
          consignee: {
            type: "object",
            properties: {
              toOrderOfText: {
                title: "is consigned to (e.g. TO ORDER OF, TO ORDER, etc..)",
                type: "string",
              },
              name: {
                type: "string",
              },
            },
          },
          notifyParty: {
            title: "Notify Party",
            type: "object",
            properties: {
              name: {
                type: "string",
              },
            },
          },
          vessel: {
            type: "string",
          },
          voyageNo: {
            title: "Voyage No.",
            type: "string",
          },
          portOfLoading: {
            title: "Port of Loading",
            type: "string",
          },
          portOfDischarge: {
            title: "Port of Discharge",
            type: "string",
          },
          placeOfReceipt: {
            title: "Place of Receipt",
            type: "string",
          },
          placeOfDelivery: {
            title: "Place of Delivery",
            type: "string",
          },
          packages: {
            type: "array",
            title: "Packages",
            items: {
              type: "object",
              properties: {
                description: {
                  type: "string",
                },
                measurement: {
                  type: "string",
                },
                weight: {
                  type: "string",
                },
              },
            },
          },
          carrierReceipt: {
            title: "Carrier's Receipt",
            type: "string",
          },
          placeOfIssueBL: {
            title: "Place of Issue of B/L",
            type: "string",
          },
          numberOfOriginalBL: {
            title: "Number of original B/L",
            type: "string",
          },
          dateOfIssueBL: {
            title: "Date of Issue of B/L",
            type: "string",
          },
          shippedOnBoardDate: {
            title: "Shipped on Board Date",
            type: "string",
          },
          signForTermsAndCondition: {
            title: "Signed for Terms and Conditions",
            type: "string",
          },
          signedForCarrierText: {
            title: "Text for signed for carrier",
            type: "string",
          },
          carrierSignature: {
            type: "string",
            title: "Carrier Signature",
          },
          termsOfCarriage: {
            type: "string",
            title: "Terms Of Carriage",
          },
        },
      },
      uiSchema: {
        logo: {
          "ui:widget": "file",
          "ui:options": {
            text: "Upload Company Logo",
            accept: ".png, .jpeg, .jpg",
          },
        },
        notifyParty: {
          name: {
            "ui:widget": "textarea",
          },
        },
        packages: {
          items: {
            description: {
              "ui:widget": "textarea",
            },
          },
        },
        carrierReceipt: {
          "ui:widget": "textarea",
        },
        placeOfIssueBL: {
          "ui:widget": "textarea",
        },
        numberOfOriginalBL: {
          "ui:widget": "textarea",
        },
        dateOfIssueBL: {
          "ui:widget": "date",
        },
        shippedOnBoardDate: {
          "ui:widget": "date",
        },
        signForTermsAndCondition: {
          "ui:widget": "textarea",
        },
        carrierSignature: {
          "ui:widget": "file",
          "ui:options": {
            text: "Upload Carrier Signature",
            accept: ".png, .jpeg, .jpg",
          },
        },
        termsOfCarriage: {
          "ui:widget": "textarea",
        },
      },
      attachments: {
        allow: true,
        accept: ".pdf, .json",
      },
      extension: "tt",
      fileName: "bill-<%= blNumber %>",
    },
    {
      name: "TradeTrust ChAFTA Certificate of Origin v2",
      type: "VERIFIABLE_DOCUMENT",
      defaults: {
        $template: {
          type: "EMBEDDED_RENDERER",
          name: "CHAFTA_COO",
          url: "https://generic-templates.tradetrust.io",
        },
        issuers: [
          {
            name: "Demo Issuer",
            documentStore: "0x70f83193bE363348Ec769c8752690eB915E640A4",
            identityProof: {
              type: "DNS-TXT",
              location: "sandbox.tradetrust.io",
            },
            revocation: {
              type: "NONE",
            },
          },
        ],
        network: {
          chain: "FREE",
          chainId: "101010",
        },
      },
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          iD: {
            type: "string",
            title: "COO ID",
          },
          issueDateTime: {
            type: "string",
            title: "Issued Date & Time",
          },
          firstSignatoryAuthentication: {
            title: "Signatory Authentication",
            type: "object",
            properties: {
              signature: {
                type: "string",
                title: "First Signatory",
              },
            },
          },
          supplyChainConsignment: {
            title: "Supply Chain Consignment",
            type: "object",
            properties: {
              iD: {
                type: "string",
                title: "ID",
              },
              information: {
                type: "string",
                title: "Consignment Information",
              },
              exportCountry: {
                title: "Export Country",
                type: "object",
                properties: {
                  code: {
                    type: "string",
                    title: "Country Code",
                  },
                },
              },
              exporter: {
                title: "Exporter",
                type: "object",
                properties: {
                  iD: {
                    title: "ID",
                    type: "string",
                  },
                  name: {
                    title: "Name",
                    type: "string",
                  },
                  postalAddress: {
                    title: "",
                    type: "object",
                    properties: {
                      line1: {
                        type: "string",
                        title: "Address Line 1",
                      },
                      line2: {
                        type: "string",
                        title: "Address Line 2",
                      },
                      cityName: {
                        type: "string",
                        title: "City",
                      },
                      postcode: {
                        type: "string",
                        title: "Postal Code",
                      },
                      countrySubDivisionName: {
                        type: "string",
                        title: "Country Sub Division Name",
                      },
                      countryCode: {
                        type: "string",
                        title: "Country Code",
                      },
                    },
                  },
                },
              },
              importCountry: {
                type: "object",
                title: "Import Country",
                properties: {
                  code: {
                    type: "string",
                    title: "Country Code",
                  },
                },
              },
              importer: {
                title: "Importer's Details (if known)",
                type: "object",
                properties: {
                  iD: {
                    title: "Importer ID",
                    type: "string",
                  },
                  name: {
                    title: "Name",
                    type: "string",
                  },
                  postalAddress: {
                    title: "",
                    type: "object",
                    properties: {
                      line1: {
                        type: "string",
                        title: "Address Line 1",
                      },
                      line2: {
                        type: "string",
                        title: "Address Line 2",
                      },
                      cityName: {
                        type: "string",
                        title: "City",
                      },
                      postcode: {
                        type: "string",
                        title: "Postal Code",
                      },
                      countrySubDivisionName: {
                        type: "string",
                        title: "Country Sub Division Name",
                      },
                      countryCode: {
                        type: "string",
                        title: "Country Code",
                      },
                    },
                  },
                },
              },
              includedConsignmentItems: {
                type: "array",
                title: "Included Consignment Items",
                items: {
                  type: "object",
                  properties: {
                    iD: {
                      type: "string",
                      title: "ID",
                    },
                    information: {
                      type: "string",
                      title: "Information",
                    },
                    crossBorderRegulatoryProcedure: {
                      type: "object",
                      title: "",
                      properties: {
                        originCriteriaText: {
                          type: "string",
                          title: "Origin Criteria Text",
                        },
                      },
                    },
                    manufacturer: {
                      type: "object",
                      title: "Manufacturer",
                      properties: {
                        iD: {
                          type: "string",
                          title: "ID",
                        },
                        name: {
                          type: "string",
                          title: "Name",
                        },
                        postalAddress: {
                          title: "",
                          type: "object",
                          properties: {
                            line1: {
                              type: "string",
                              title: "Address Line 1",
                            },
                            line2: {
                              type: "string",
                              title: "Address Line 2",
                            },
                            cityName: {
                              type: "string",
                              title: "City",
                            },
                            postcode: {
                              type: "string",
                              title: "Postal Code",
                            },
                            countrySubDivisionName: {
                              type: "string",
                              title: "Country Sub Division Name",
                            },
                            countryCode: {
                              type: "string",
                              title: "Country Code",
                            },
                          },
                        },
                      },
                    },
                    tradeLineItems: {
                      type: "array",
                      title: "Trade line Items",
                      items: {
                        type: "object",
                        properties: {
                          sequenceNumber: {
                            type: "integer",
                            title: "Sequence Number",
                          },
                          invoiceReference: {
                            type: "object",
                            title: "Invoice Reference",
                            properties: {
                              iD: {
                                type: "string",
                                title: "ID",
                              },
                              formattedIssueDateTime: {
                                type: "string",
                                title: "Formatted Issue Date & Time",
                              },
                              attachedBinaryFile: {
                                type: "object",
                                title: "",
                                properties: {
                                  uRI: {
                                    type: "string",
                                    title: "Attached Binary File URI",
                                  },
                                },
                              },
                            },
                          },
                          tradeProduct: {
                            type: "object",
                            title: "Trade Product",
                            properties: {
                              iD: {
                                type: "string",
                                title: "ID",
                              },
                              description: {
                                type: "string",
                                title: "Description",
                              },
                              harmonisedTariffCode: {
                                type: "object",
                                title: "",
                                properties: {
                                  classCode: {
                                    type: "string",
                                    title: "Harmonised Tariff Class Code",
                                  },
                                  className: {
                                    type: "string",
                                    title: "Harmonised Tariff Class Name",
                                  },
                                },
                              },
                              originCountry: {
                                type: "object",
                                title: "Origin Country",
                                properties: {
                                  code: {
                                    type: "string",
                                    title: "Code",
                                  },
                                },
                              },
                            },
                          },
                          transportPackages: {
                            type: "array",
                            title: "Transport Packages",
                            items: {
                              type: "object",
                              properties: {
                                iD: {
                                  type: "string",
                                  title: "ID",
                                },
                                grossVolume: {
                                  type: "string",
                                  title: "Gross Volume",
                                },
                                grossWeight: {
                                  type: "string",
                                  title: "Gross Weight",
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              loadingBaseportLocation: {
                type: "object",
                title: "Loading Baseport Location",
                properties: {
                  iD: {
                    type: "string",
                    title: "ID",
                  },
                  name: {
                    type: "string",
                    title: "Name",
                  },
                },
              },
              mainCarriageTransportMovement: {
                title: "Main Carriage Transport Movement",
                type: "object",
                properties: {
                  iD: {
                    type: "string",
                    title: "ID",
                  },
                  information: {
                    type: "string",
                    title: "Information",
                  },
                  usedTransportMeans: {
                    title: "",
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        title: "Used Transport",
                      },
                      iD: {
                        type: "string",
                        title: "Used Transport ID",
                      },
                    },
                  },
                  departureEvent: {
                    title: "",
                    type: "object",
                    properties: {
                      departureDateTime: {
                        type: "string",
                        title: "Departure Date and Time",
                      },
                    },
                  },
                },
              },
              unloadingBaseportLocation: {
                type: "object",
                title: "Unloading Baseport Location",
                properties: {
                  iD: {
                    type: "string",
                    title: "ID",
                  },
                  name: {
                    type: "string",
                    title: "Name",
                  },
                },
              },
            },
          },
        },
      },
      uiSchema: {
        issueDateTime: {
          "ui:widget": "datetime",
        },
        firstSignatoryAuthentication: {
          signature: {
            "ui:widget": "file",
            "ui:options": {
              text: "Upload Signature",
              accept: ".png, .jpeg, .jpg",
            },
          },
        },
        supplyChainConsignment: {
          includedConsignmentItems: {
            items: {
              tradeLineItems: {
                items: {
                  invoiceReference: {
                    formattedIssueDateTime: {
                      "ui:widget": "datetime",
                    },
                  },
                },
              },
            },
          },
          mainCarriageTransportMovement: {
            departureEvent: {
              departureDateTime: {
                "ui:widget": "datetime",
              },
            },
          },
        },
      },
      attachments: {
        allow: true,
        accept: ".pdf",
      },
      extension: "tt",
    },

    {
      name: "TradeTrust Invoice v2 (DNS-DID)",
      type: "VERIFIABLE_DOCUMENT",
      defaults: {
        $template: {
          type: "EMBEDDED_RENDERER",
          name: "INVOICE",
          url: "https://generic-templates.tradetrust.io",
        },
        issuers: [
          {
            id: "did:ethr:0xf11e3850f0bb8c72925c329ec446a2026cd4bb94",
            name: "Demo DNS-DID",
            identityProof: {
              type: "DNS-DID",
              location: "sandbox.tradetrust.io",
              key: "did:ethr:0xf11e3850f0bb8c72925c329ec446a2026cd4bb94#controller",
            },
            revocation: {
              type: "NONE",
            },
          },
        ],
        network: {
          chain: "FREE",
          chainId: "101010",
        },
      },
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: {
            type: "string",
            title: "Invoice ID",
          },
          date: {
            type: "string",
            title: "Date",
          },
          customerId: {
            type: "string",
            title: "Customer ID",
          },
          terms: {
            type: "string",
            title: "Terms",
          },
          billFrom: {
            type: "object",
            title: "Bill From",
            properties: {
              name: {
                type: "string",
                title: "Name",
              },
              streetAddress: {
                type: "string",
                title: "Street Address",
              },
              city: {
                type: "string",
                title: "City",
              },
              postalCode: {
                type: "string",
                title: "Postal Code",
              },
              phoneNumber: {
                type: "string",
                title: "Phone Number",
              },
            },
          },
          billTo: {
            type: "object",
            title: "Bill To",
            properties: {
              name: {
                type: "string",
                title: "Name",
              },
              email: {
                type: "string",
                title: "Email",
              },
              company: {
                type: "object",
                title: "Bill To Company",
                properties: {
                  name: {
                    type: "string",
                    title: "Name",
                  },
                  streetAddress: {
                    type: "string",
                    title: "Street Address",
                  },
                  city: {
                    type: "string",
                    title: "City",
                  },
                  postalCode: {
                    type: "string",
                    title: "Postal Code",
                  },
                  phoneNumber: {
                    type: "string",
                    title: "Phone Number",
                  },
                },
              },
            },
          },
          billableItems: {
            type: "array",
            title: "Billable Items",
            items: {
              type: "object",
              properties: {
                description: {
                  type: "string",
                  title: "Description",
                },
                quantity: {
                  type: "string",
                  title: "Quantity",
                },
                unitPrice: {
                  type: "string",
                  title: "Unit Price",
                },
                amount: {
                  type: "string",
                  title: "Amount",
                },
              },
            },
          },
          subtotal: {
            type: "string",
            title: "Subtotal",
          },
          tax: {
            type: "string",
            title: "Tax (%)",
          },
          taxTotal: {
            type: "string",
            title: "Tax Total",
          },
          total: {
            type: "string",
            title: "Total",
          },
        },
      },
      uiSchema: {
        date: {
          "ui:widget": "date",
        },
      },
      extension: "tt",
    },
  ],
};

export const DEMO_PRIVATE_KEY = "2094fe88ad9d99fd3691af27adcf2fce39789e19f3d04119f1f8c258b5c678c3";
