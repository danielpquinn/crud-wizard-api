import * as React from "react";
import * as CodeMirror from "react-codemirror";
import { Field } from "react-final-form";

interface IProps {
  name: string;
  label?: string;
  mode: "javascript";
}

export class CodeInput extends React.Component<IProps> {

  public render() {
    const { name, mode, label } = this.props;

    return (
      <Field
        name={name}
        render={({ input }) => (
          <div className="form-group code-input code-input-height-100 mb-1">
            {label && <label className="mb-0"><small>{label}</small></label>}
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