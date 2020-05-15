import React from "react";
import { NavigationBar } from "../../components/NavigationBar";
import { Counter } from "../../components/Counter";
import logo from "./logo.svg";
import "./Home.css";
import { Container } from "../../components/Container";

export const Home: React.FunctionComponent = () => (
  <div>
    <NavigationBar />
    <Container>
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
    </Container>
  </div>
);
