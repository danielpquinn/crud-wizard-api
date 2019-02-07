import * as React from "react";
import * as CodeMirror from "react-codemirror";
import { Field } from "react-final-form";

interface IProps {
  name: string;
  label: string;
  mode: "javascript";
}

export class CodeInput extends React.Component<IProps> {

  public render() {
    const { name, mode, label } = this.props;

    return (
      <Field
        name={name}
        render={({ input }) => (
          <div className="form-group">
            <label>{label}</label>
            <CodeMirror
              value={input.value}
              onChange={input.onChange}
              options={{ mode: `text/${mode}` }}
            />
          </div>
        )}
      />
    );
  }
}