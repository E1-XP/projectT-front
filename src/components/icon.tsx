import React from "react";

interface Props {
  name: string;
  fill?: string;
  size?: string;
}

export const Icon = ({ fill, size, name }: Props) => (
  <span
    className="material-icons"
    style={{ color: fill, fontSize: size, userSelect: "none" }}
  >
    {name}
  </span>
);
