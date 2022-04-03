import { formatDuration } from "./../../helpers";

describe("formatDuration returns expected duration strings", () => {
  it("works with short periods", () => {
    const shortPeriod = { days: 0, hours: 0, minutes: 3, seconds: 44 };
    expect(formatDuration(shortPeriod)).toBe(`0:03:44`);
  });

  it("works with long periods", () => {
    const longPeriod = { days: 40, hours: 20, minutes: 12, seconds: 9 };
    expect(formatDuration(longPeriod)).toBe(`980:12:09`);
  });
});
