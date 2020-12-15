import React from "react";
import { addDecorator } from "@storybook/react";
import "../src/index.css";

addDecorator((storyFn) => <>{storyFn()}</>);
