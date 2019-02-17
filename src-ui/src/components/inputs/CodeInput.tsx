import * as React from "react";
import * as CodeMirror from "react-codemirror";
import { Field } from "react-final-form";

interface IProps {
  name: string;
  label?: string;
  mode: "javascript";
  height?: number;
}

export class CodeInput extends React.Component<IProps> {

  public render() {
    const { height, name, mode, label } = this.props;

    return (
      <Field
        name={name}
        render={({ input }) => (
          <div className="form-group code-input mb-1">
            {label && <label>{label}</label>}
            <div
              style={{ height: height ? `${height}px` : "100px" }}
            >
              <CodeMirror
                value={input.value}
                onChange={input.onChange}
                options={{ mode: `text/${mode}` }}
              />
            </div>
          </div>
        )}
      />
    );
  }
}
