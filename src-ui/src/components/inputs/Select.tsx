import * as React from "react";
import { Field } from "react-final-form";
import { default as ReactSelect } from "react-select";

interface IOption {
  value: string;
  label: string;
}

interface IProps {
  name: string;
  options: IOption[];
  label?: string;
}

export class Select extends React.Component<IProps> {
  public render() {
    const { name, label, options } = this.props;

    return (
      <Field
        name={name}
        render={({ input, meta }) => (
          <div className="form-inline form-group mb-1">
            {label && <label className="mb-0"><small>{label}</small></label>}
            <ReactSelect
              styles={{
                container: (provided) => ({ ...provided, width: "100%" }),
                control: (provided) => ({ ...provided, minHeight: "31px", height: "31px" })
              }}
              options={options}
              value={{ value: input.value, label: input.value }}
              onChange={(option: IOption) => input.onChange(option.value)}
            />
            {meta.touched && meta.error && <small>{meta.error}</small>}
          </div>
        )}
      />
    );
  }
}