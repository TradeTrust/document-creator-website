import { getAcceptedFormatValue } from "./utils";

describe("getAcceptedFormatValue", () => {
  it("should get the 'accept' value if there is a accept in the schema", () => {
    const schema1 = {
      accept: "test",
    };
    expect(getAcceptedFormatValue(schema1)).toStrictEqual("test");

    const schema2 = {
      a: "d",
      b: {
        abc: "not",
        accept: "test",
      },
    };
    expect(getAcceptedFormatValue(schema2)).toStrictEqual("test");

    const schema3 = {
      a: "d",
      b: "2",
      c: {
        d: "e",
        t: {
          try2: "123",
          accept: "test",
        },
        e: {
          abc: "eeeee",
          accepted: "testt123",
        },
      },
      i: "22",
    };
    expect(getAcceptedFormatValue(schema3)).toStrictEqual("test");

    const schema4 = {
      a: "d",
      b: "2",
      c: {
        d: "e",
        t: {
          try2: "123",
          accept3: "test44",
        },
        e: {
          abc: "eeeee",
          accept: "test",
        },
      },
      i: "22",
    };
    expect(getAcceptedFormatValue(schema4)).toStrictEqual("test");
  });

  it("should return '' if there is no accept in the schema", () => {
    const schema = {
      a: "sdfds",
      b: "asdfasdf",
    };
    expect(getAcceptedFormatValue(schema)).toStrictEqual("");
  });
});
