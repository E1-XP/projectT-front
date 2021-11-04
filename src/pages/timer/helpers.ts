export const normalize = (str: number | undefined) =>
  `${str}`.length > 1 ? str : `0${str}`;

export const formatDuration = ({ hours, minutes, seconds }: Duration) =>
  `${hours}:${normalize(minutes)}:${normalize(seconds)}`;
