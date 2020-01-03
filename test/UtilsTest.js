import { dateFormatToPattern } from "../src/util";

describe("utils", function() {
  it("should translate date format to pattern", function() {
    const expectedPattern = "[0-9]{4}-[01]?[0-9]-[0-3]?[0-9]";
    expect(dateFormatToPattern("yyyy-MM-dd")).toBe(expectedPattern);
    expect(dateFormatToPattern("yyyy-mm-dd")).toBe(expectedPattern);
    const regexp = new RegExp("^" + expectedPattern + "$");
    expect(regexp.test("2014-1-1")).toBe(true);
    expect(regexp.test("2014-12-31")).toBe(true);
    expect(regexp.test("2014-09-09")).toBe(true);
  });
});
