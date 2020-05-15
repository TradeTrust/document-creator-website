import React from "react";
import { Container } from "../../components/Container";
import { ConfigDropZone } from "../../components/Dropzone/ConfigDropzone";
import { NavigationBar } from "../../components/NavigationBar";
export const Home: React.FunctionComponent = () => (
  <div>
    <NavigationBar />
    <Container>
      <div className="py-3">
        <h1>Upload Configuration File</h1>
      </div>
      <ConfigDropZone onConfig={(config) => alert(JSON.stringify(config))} />
    </Container>
  </div>
);
