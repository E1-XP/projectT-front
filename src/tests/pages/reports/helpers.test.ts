import {
  getMatchingPeriodType,
  periods,
} from "./../../../pages/reports/helpers";

describe("getMatchingPeriodType returns expected period type", () => {
  it("recognizes full week range", () => {
    const startDate = new Date(2022, 2, 28, 0, 0, 0);
    const endDate = new Date(2022, 3, 3, 23, 59, 59);

    const range = { startDate, endDate };
    expect(getMatchingPeriodType(range)).toBe(periods.WEEK);
  });

  it("recognizes full year range", () => {
    const startDate = new Date(2022, 0, 1, 0, 0, 0);
    const endDate = new Date(2022, 11, 31, 23, 59, 59);

    const range = { startDate, endDate };
    expect(getMatchingPeriodType(range)).toBe(periods.YEAR);
  });

  it("fallbacks to custom period type", () => {
    const startDate = new Date(2022, 1, 1, 12, 41, 3);
    const endDate = new Date(2022, 1, 16, 21, 21, 55);

    const range = { startDate, endDate };
    expect(getMatchingPeriodType(range)).toBe(periods.CUSTOM);
  });
});
