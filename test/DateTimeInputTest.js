import "jsdom-global/register";
import React from "react";
import DateTimeInput from "../src/DateTimeInput";
import assert from "assert";
import { describe } from "mocha";
import { mount, configure } from "enzyme";
import moment from "moment";
import sinon from "sinon";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

// const fail = msg => () => ok(false, msg)
const equal = assert.equal;
function format({ value }) {
  assert(value);
  return moment(value).format("YYYY-MM-DD HH:mm");
}
describe("DateTimeInput", function() {
  let value;
  let component;
  let dateInput;
  let timeInput;

  function mountInput({ ...props } = {}) {
    component = mount(<DateTimeInput {...props} />);
    dateInput = component.find(".dt-input-date");
    timeInput = props.showTime !== false && component.find(".dt-input-time");
    assert(dateInput);
    props.showTime !== false && assert(timeInput);
  }

  it("should render with empty date", function() {
    mountInput();
    assert.equal("", dateInput.prop("value"));
    assert.equal("", timeInput.prop("value"));
  });

  it("should render with non-empty date", function() {
    const value = moment("2014-10-25T10:20").toDate();
    mountInput({ value });
    assert.equal("2014-10-25", dateInput.prop("value"));
    assert.equal("10:20", timeInput.prop("value"));
  });

  it("should react to introduction of text", function() {
    const onChange = sinon.spy();
    mountInput({ onChange });

    // edit date
    dateInput.simulate("focus");
    dateInput.simulate("change", { target: { value: "2014-10-05" } });
    equal(0, onChange.callCount);
    dateInput.simulate("blur");
    equal(1, onChange.callCount);
    equal("2014-10-05 00:00", format(onChange.getCall(0).args[0]));

    // edit time
    timeInput.simulate("change", { target: { value: "17:10" } });
    dateInput.simulate("blur");
    equal("2014-10-05 17:10", format(onChange.getCall(1).args[0]));

    // empty date
    dateInput.simulate("change", { target: { value: "" } });
    dateInput.simulate("blur");
    equal(undefined, onChange.getCall(2).args[0].value);
    equal(undefined, onChange.getCall(2).args[0].strValue);
  });

  it("should render a calendar", function() {
    const value = moment("2014-10-25T10:20").toDate();
    mountInput({ value });
    dateInput.simulate("focus");
    equal("October 2014", component.find(".dt-current-date").text());
    equal("25", component.find(".dt-current-day").text());
  });

  it("handle invalid date", function() {
    const onChange = sinon.spy();
    mountInput({ onChange });
    dateInput.simulate("focus");
    dateInput.simulate("change", { target: { value: "xxx" } });
    dateInput.simulate("blur");
    component.update();
    equal(0, onChange.callCount);
    //equal("xxx", dateInput.prop("value"));
  });

  it("should render disabled inputs", function() {
    const onChange = sinon.spy();
    const value = moment("2014-10-25T10:20").toDate();
    mountInput({ onChange, disabled: true, value });
    dateInput.simulate("focus");
    dateInput.simulate("change", { target: { value: "2014-10-05" } });
    dateInput.simulate("blur");
    equal(dateInput.getDOMNode().disabled, true);
    equal(0, onChange.callCount);
    equal("2014-10-25", dateInput.prop("value"));
  });
});
