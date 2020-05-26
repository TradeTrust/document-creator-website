import React from "react";
import { Container } from "./Container";

export default {
  title: "Container",
  component: Container,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => (
  <Container>
    <h1>Some Title Here</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Morbi tristique senectus et netus. Odio morbi quis commodo odio
      aenean. Mauris sit amet massa vitae tortor condimentum lacinia quis vel. Ac odio tempor orci
      dapibus ultrices in iaculis. In hac habitasse platea dictumst vestibulum. Elit duis tristique
      sollicitudin nibh. Odio pellentesque diam volutpat commodo sed egestas. Porta nibh venenatis
      cras sed. Mi proin sed libero enim sed faucibus. A erat nam at lectus urna duis convallis
      convallis. Tempus urna et pharetra pharetra massa massa ultricies. Ornare massa eget egestas
      purus viverra accumsan in. Massa placerat duis ultricies lacus sed turpis. Tempus iaculis urna
      id volutpat lacus. Adipiscing vitae proin sagittis nisl rhoncus. Massa tempor nec feugiat nisl
      pretium. Odio euismod lacinia at quis risus sed vulputate odio ut. Sodales neque sodales ut
      etiam sit amet nisl.
    </p>
    <p>
      Ut etiam sit amet nisl. Sed risus ultricies tristique nulla aliquet. Duis at tellus at urna
      condimentum. Ultrices vitae auctor eu augue ut lectus arcu. Urna molestie at elementum eu
      facilisis sed odio morbi quis. Lectus magna fringilla urna porttitor rhoncus dolor purus non
      enim. Id aliquet risus feugiat in ante. Amet porttitor eget dolor morbi non arcu risus quis.
      Curabitur vitae nunc sed velit. Elementum integer enim neque volutpat ac tincidunt vitae
      semper quis. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium
      vulputate. Ut tortor pretium viverra suspendisse potenti nullam. Nunc faucibus a pellentesque
      sit amet porttitor eget.
    </p>
  </Container>
);
