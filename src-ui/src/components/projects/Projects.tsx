import * as axios from "axios";
import * as React from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "src/lib/error";
import { getToastManager } from "src/lib/ToastManager";
import { IProject } from "src/types/Project";

interface IState {
  projects: IProject[] | null;
  errorMessage: string | null;
}

export class Projects extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      projects: [],
      errorMessage: null
    };
  }

  public componentDidMount() {
    this.loadProjects();
  }

  public render() {
    const { projects } = this.state;
    let content: React.ReactNode = null;

    if (!projects || projects.length === 0) {
      content = (
        <div className="container">
          <p>You don"t have any projects</p>
        </div>
      );
    } else {
      content = (
        <table className="table w-100">
          <tbody>
            {projects.map((project) => {
              return (
                <tr key={project.id}>
                  <td><Link to={`/projects/${project.id}`}>{project.name}</Link></td>
                  <td><Link to={`/desktop/${project.id}`}>Desktop</Link></td>
                  <td><button className="btn" onClick={() => this.deleteProject(project.id)}><i className="zmdi zmdi-delete" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <p><Link to="create-project">Create Project</Link></p>
            {content}
          </div>
        </div>
      </div>
    );
  }

  private loadProjects = async () => {
    try {
      const response = await axios.default.get("http://localhost:8080/api/v1/projects/");
      if (response.data) {
        this.setState({ projects: response.data });
      }
    } catch (e) {
      this.setState({ errorMessage: getErrorMessage(e) });
    }
  }

  private deleteProject = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await axios.default.delete(`http://localhost:8080/api/v1/projects/${id}`);
    
        if (response.status < 400) {
          this.loadProjects();
          getToastManager().addToast("Deleted project");
        } else {
          getToastManager().addToast("Error deleting project", "danger");
        }
      } catch (e) {
        getToastManager().addToast(getErrorMessage(e), "danger");
      }
    }
  }
}
