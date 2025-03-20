const formatSeconds = (s: number) => {
  const seconds = s % 60;
  const minutes = (s - seconds) / 60;
  const paddedSeconds = seconds > 9 ? seconds.toString() : `0${seconds}`;

  return `${minutes}m:${paddedSeconds}s`;
};

export default formatSeconds;
