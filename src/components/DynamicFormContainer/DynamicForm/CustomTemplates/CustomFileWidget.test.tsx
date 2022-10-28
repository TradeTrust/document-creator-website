import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CustomFileWidget } from "./CustomFileWidget";

const propsToPassIntoWidget = (): any => {
  return {
    onChange: () => {},
    options: {
      text: "Upload Cover Letter Logo",
      accept: ".png, .jpeg, .jpg",
    },
  };
};

describe("CustomFileWidget",  () => {
  it("should display file name after upload",async () => {
    const mockFile = new File(["(⌐□_□)"], "mockFile.png", { type: "image/png" });
    const {findByText } = render(<CustomFileWidget {...propsToPassIntoWidget()} />);
    const fileWidget = screen.getByTestId("custom-file-widget") as HTMLInputElement;
    userEvent.upload(fileWidget, mockFile);
    findByText("mockFile.png");
    expect(fileWidget.files?.length).toBe(1);
  });
});
