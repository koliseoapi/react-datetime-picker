import { getCalendarFragments } from "../src/Calendar";
import { parseISO } from "date-fns/esm";

describe("Calendar", function() {
  it("should create a Calendar with trailing and leading days", function() {
    const { lastMonth, currentMonth, nextMonth } = getCalendarFragments(
      parseISO("2020-01-06")
    );
    expect(lastMonth).toStrictEqual([29, 30, 31]);
    expect(currentMonth).toHaveLength(31);
    expect(nextMonth).toStrictEqual([1]);
  });

  it("should create a Calendar without leading days", function() {
    const { lastMonth, currentMonth, nextMonth } = getCalendarFragments(
      parseISO("2019-12-01")
    );
    expect(lastMonth).toHaveLength(0);
    expect(currentMonth).toHaveLength(31);
    expect(nextMonth).toStrictEqual([1, 2, 3, 4]);
  });

  it("should create a Calendar without trailing days", function() {
    const { lastMonth, currentMonth, nextMonth } = getCalendarFragments(
      parseISO("2019-11-30")
    );
    expect(lastMonth).toStrictEqual([27, 28, 29, 30, 31]);
    expect(currentMonth).toHaveLength(30);
    expect(nextMonth).toHaveLength(0);
  });
});
