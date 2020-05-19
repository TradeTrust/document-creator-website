import {mapKeys} from "lodash";

it("works", () => {
  const inputFromForm = {
    serial: "SN-2020-abc123",
    items: [
      {
        name: "Red Wine",
        quantity: 500,
        unit: "bottle",
      },
      {
        name: "Standing Desk",
        quantity: 500,
        unit: "units",
      },
    ],
  };
  const defaultValue = {
    foo: "bar",
    existing: { foo: "bar" },
  };
  const expectedOutput = {
    id: "SN-2020-abc123",
    foo: "bar",
    existing: {
      foo: "bar",
      declaration: {
        items: [
          {
            name: "Red Wine",
            quantity: 500,
            unit: "bottle",
          },
          {
            name: "Standing Desk",
            quantity: 500,
            unit: "units",
          },
        ],
      },
    },
  };
  const mapping = {
    serial: "id",
    items: "existing.declaration.items",
  };
  mapKeys(inputFromForm, (value, key) => {
      
  })
});
