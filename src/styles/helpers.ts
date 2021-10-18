export const getBP = (width: string) =>
  `@media only screen and (max-width: ${width})`;

export const visuallyHidden = `
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
`;
