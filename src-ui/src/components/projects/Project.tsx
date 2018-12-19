import * as axios from "axios";
import * as React from "react";
import { match } from "react-router-dom";
import { getErrorMessage } from "src/lib/error";

interface IProps {
  match: match<{ id: string }>
}

interface IState {
  projectName: string | null;
  projectContent: string | null;
  errorMessage: string | null;
}

export class Project extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      projectName: null,
      projectContent: null,
      errorMessage: null
    };
  }

  public componentDidMount() {
    this.loadProject();
  }

  public render() {
    const { projectContent, projectName } = this.state;

    if (projectName === null) {
      return (
        <div className="container">
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-3" />
          <div className="col-6">
            <h3>Update Project</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="projectName">Name</label>
                <input
                  name="projectName"
                  type="text"
                  className="form-control form-control-sm"
                  onChange={(e) => this.setState({ projectName: e.target.value })}
                  value={projectName || ""}
                />
              </div>
              <div className="form-group">
                <label htmlFor="projectContent">Content</label>
                <textarea
                  name="projectContent"
                  className="form-control form-control-sm"
                  onChange={(e) => this.setState({ projectContent: e.target.value })}
                  value={projectContent || ""}
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Project</button>
            </form>
          </div>
          <div className="col-3" />
        </div>
      </div>
    );
  }

  private loadProject = async () => {
    const id = this.props.match.params.id;
    try {
      const response = await axios.default.get(`http://localhost:8080/api/v1/projects/${id}`);
      if (response.data) {
        const { name, content } = response.data;
        this.setState({
          projectName: name,
          projectContent: content
        });
      }
    } catch (e) {
      this.setState({ errorMessage: getErrorMessage(e) });
    }
  }

  private onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = this.props.match.params.id;
    const result = await axios.default.put(`http://localhost:8080/api/v1/projects/${id}`, {
      name: this.state.projectName,
      content: this.state.projectContent
    });
    if (result.status >= 400) {
      this.setState({
        errorMessage: result.data ? result.data.message : "Could not update project"
      });
    }
  };
}
