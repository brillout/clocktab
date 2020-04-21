import React from "react";

export default UseCases;

function UseCases() {
  return (
    <Center>
      <Title>Use Cases</Title>
      <Item>
        School & Universities - Communicate to students without speaking, e.g.
        during examination.
      </Item>
      <Item>At the library - You are forbidden to talk.</Item>
      <Item>
        Audio not working - Video call, or presentation with large audience.
      </Item>
      <Item>For Fun.</Item>
    </Center>
  );
}
function Center({ children }) {
  return (
    <div style={{ textAlign: "center", padding: "30px 0" }}>
      <div style={{ textAlign: "left", display: "inline-block" }}>
        {children}
      </div>
    </div>
  );
}
function Title({ children }) {
  return (
    <span
      style={{
        textDecoration: "underline",
        fontSize: "1.2em",
        /*
      display: 'block',
      textAlign: 'center',
      */
      }}
    >
      {children}
    </span>
  );
}
function Item({ children }) {
  return <div style={{ paddingLeft: 7, marginTop: 5 }}>• {children}</div>;
}
