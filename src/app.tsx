import React, { useEffect, useState } from "react";
import styled from "styled-components";

export const App = () => {
  const [state, setState] = useState("hello world!");

  return <div>{state}</div>;
};
