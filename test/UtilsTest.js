import { dateFormatToPattern } from "../src/util";
import assert from "assert";
import { describe } from "mocha";

const equal = assert.equal;
describe("utils", function() {
  it("should translate date format to pattern", function() {
    const expectedPattern = "[0-9]{4}-[01]?[0-9]-[0-3]?[0-9]";
    equal(expectedPattern, dateFormatToPattern("YYYY-MM-DD"));
    equal(expectedPattern, dateFormatToPattern("yyyy-mm-dd"));
    const regexp = new RegExp("^" + expectedPattern + "$");
    assert(regexp.test("2014-1-1"));
    assert(regexp.test("2014-12-31"));
    assert(regexp.test("2014-09-09"));
  });
});
