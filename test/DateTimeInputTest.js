import React from "react";
import renderer from "react-test-renderer";
import DateTimeInput from "../src/DateTimeInput";
import { parseISO, setDate } from "date-fns/esm";

describe("DateTimeInput", function() {
  const date = parseISO("2014-10-25T10:20Z");

  it("should render with empty date", function() {
    renderer.create(<DateTimeInput />);
  });

  it("should render with non-empty date", function() {
    const tree = renderer.create(<DateTimeInput value={date} />);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  function getDateInput(tree) {
    return tree.root.findByProps({
      className: "dt-input dt-input-date"
    });
  }

  function getTimeInput(tree) {
    return tree.root.findByProps({
      className: "dt-input dt-input-time"
    });
  }

  it("should respond to text introduced by the user", function() {
    const onChange = jest.fn();
    const tree = renderer.create(
      <DateTimeInput name="foobar" value={date} onChange={onChange} />
    );

    // edit date
    const dateInput = getDateInput(tree);
    const timeInput = getTimeInput(tree);

    dateInput.props.onFocus();
    dateInput.props.onChange({ target: { value: "2014-10-05" } });
    expect(onChange).toHaveBeenCalledTimes(0);
    dateInput.props.onBlur({});
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      name: "foobar",
      strValue: "2014-10-05T12:20",
      value: setDate(date, 5)
    });

    // edit time
    timeInput.props.onChange({ target: { value: "17:10" } });
    dateInput.props.onBlur({});
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith({
      name: "foobar",
      strValue: "2014-10-05T17:10",
      value: parseISO("2014-10-05T17:10")
    });

    // empty date
    dateInput.props.onChange({ target: { value: "" } });
    dateInput.props.onBlur({});
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith({
      name: "foobar",
      strValue: undefined,
      value: undefined
    });
  });

  it("should render a calendar", function() {
    const tree = renderer.create(<DateTimeInput value={date} />);
    const dateInput = getDateInput(tree);
    dateInput.props.onFocus();
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("handle invalid date", function() {
    const onChange = jest.fn();
    const tree = renderer.create(<DateTimeInput onChange={onChange} />);
    const dateInput = getDateInput(tree);
    dateInput.props.onFocus();
    dateInput.props.onChange({ target: { value: "xxx" } });
    dateInput.props.onBlur({});
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it("should render disabled inputs", function() {
    const tree = renderer.create(
      <DateTimeInput value={date} disabled={true} />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
