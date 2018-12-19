import * as React from "react";
import { level } from "src/types/bootstrap";

interface IProps {

  /**
   * Level of the alert
   */
  level?: level;
}

/**
 * @class Alert
 * @description Simple wrapper around a bootstrap alert
 */
export class Alert extends React.Component<IProps> {

  public render(): JSX.Element {
    // tslint:disable:no-shadowed-variable
    const { children, level } = this.props;

    return <div className={`alert alert-${level ? level : "info"}`}>{children}</div>;
  }
}
