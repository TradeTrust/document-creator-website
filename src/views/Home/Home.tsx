import React from "react";
import { Counter } from "../../components/Counter";
import logo from "./logo.svg";
import "./Home.css";

export const Home: React.FunctionComponent = () => (
  <div>
    <header className="flex flex-col items-center justify-center text-lg text-white min-h-screen bg-purple-700">
      <img src={logo} className="h-40 spin" alt="logo" />
      <Counter />
      <a
        data-testid="learn-react-link"
        className="text-teal-400"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);
