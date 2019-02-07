import * as React from "react";
import { Field } from "react-final-form";

interface IProps {
  name: string;
  label: string;
}

export class CheckboxInput extends React.Component<IProps> {

  public render() {
    const { name, label } = this.props;

    return (
      <Field
        name={name}
        render={({ input, meta }) => (
          <div className="form-group">
            <label>{label}</label>
            <input type="checkbox" className="form-control form-control-sm" {...input} />
            {meta.touched && meta.error && <small>{meta.error}</small>}
          </div>
        )}
      />
    );
  }
}