export const normalize = (str: number | undefined) =>
  `${str}`.length > 1 ? str : `0${str}`;

export const formatDuration = ({ days, hours, minutes, seconds }: Duration) =>
  `${(days || 0) * 24 + (hours || 0)}:${normalize(minutes)}:${normalize(
    seconds
  )}`;
