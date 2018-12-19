import * as axios from "axios";
import * as H from "history";
import * as React from "react";

interface IProps {
  history: H.History;
}

interface IState {
  projectName: string;
  projectContent: string;
  errorMessage: string | null;
}

export class CreateProject extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      errorMessage: null,
      projectName: "",
      projectContent: ""
    };
  }

  public render() {
    const { errorMessage } = this.state;

    if (errorMessage !== null) {
      return (
        <div className="alert alert-warning">{errorMessage}</div>
      )
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-3" />
          <div className="col-6">
            <h3>Create Project</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="projectName">Name</label>
                <input
                  name="projectName"
                  type="text"
                  className="form-control form-control-sm"
                  onChange={(e) => this.setState({ projectName: e.target.value })}
                  value={this.state.projectName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="projectContent">Content</label>
                <textarea
                  name="projectContent"
                  className="form-control form-control-sm"
                  onChange={(e) => this.setState({ projectContent: e.target.value })}
                  value={this.state.projectContent}
                />
              </div>
              <button type="submit" className="btn btn-primary">Create Project</button>
            </form>
          </div>
          <div className="col-3" />
        </div>
      </div>
    )
  }

  private onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await axios.default.post("http://localhost:8080/api/v1/projects/", {
      name: this.state.projectName,
      content: this.state.projectContent
    });
    if (result.status >= 400) {
      this.setState({
        errorMessage: result.data ? result.data.message : "Could not create project"
      });
    } else {
      this.props.history.push("projects");
    }
  };
}
