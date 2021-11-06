import React from "react";

interface Props {
  name: string;
  fill?: string;
  size?: string;
  className?: string;
}

export const Icon = ({ fill, size, name, className }: Props) => (
  <span
    className={`material-icons ${className}`}
    style={{ color: fill, fontSize: size, userSelect: "none" }}
  >
    {name}
  </span>
);
