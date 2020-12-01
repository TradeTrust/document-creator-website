import React from "react";
import { addDecorator } from "@storybook/react";
import "../src/index.css";
import "./storybook.css";

addDecorator((storyFn) => <>{storyFn()}</>);
