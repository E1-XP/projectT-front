export const getBP = (width: string, direction = "max") => {
  if (direction === "min") {
    width = pxToEm(emToPx(width) + 1);
  }

  return `@media only screen and (${direction}-width: ${width})`;
};

export const pxToEm = (val: number) => `${val / 16}em`;

export const emToPx = (val: string) =>
  Number(val.slice(undefined, val.length - 2)) * 16;

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
