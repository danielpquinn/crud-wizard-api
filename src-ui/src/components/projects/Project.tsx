import * as axios from "axios";
import { Form, FormApi, Text, TextArea } from "informed";
import * as React from "react";
import { Link, match } from "react-router-dom";
import { getErrorMessage } from "src/lib/error";
import { getToastManager } from "src/lib/ToastManager";
import { IProjectResponseBody } from "src/types/ProjectResponseBody";

interface IProps {
  match: match<{ id: string }>
}

interface IState {
  project: IProjectResponseBody | null;
}

interface IFormValues {
  name: string;
  specs: string;
  resources: string;
  initialize: string;
  addPageParams: string;
  getTotalResults: string;
}

export class Project extends React.Component<IProps, IState> {
  private formApi: FormApi<IFormValues>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      project: null
    };
  }

  public componentDidMount() {
    this.loadProject();
  }

  public render() {
    const { project } = this.state;

    if (!project) {
      return null;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active"><Link to="/projects">Projects</Link></li>
                <li className="breadcrumb-item active">{project.name}</li>
              </ol>
            </nav>

            <h3>Edit Project</h3>

            <Form<IFormValues>
              onSubmit={this.onSubmit}
              getApi={this.getFormApi}
            >
              {({ formApi }) => (
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <label>Name</label>
                    <Text className="form-control form-control-sm" field="name"/>
                    <small>{formApi.getError("name")}</small>
                  </div>
                  <div className="form-group">
                    <label>Initialize function</label>
                    <TextArea className="form-control form-control-sm" field="initialize"/>
                    <small>{formApi.getError("initialize")}</small>
                  </div>
                  <div className="form-group">
                    <label>Add page params function</label>
                    <TextArea className="form-control form-control-sm" field="addPageParams"/>
                    <small>{formApi.getError("addPageParams")}</small>
                  </div>
                  <div className="form-group">
                    <label>Get total results function</label>
                    <TextArea className="form-control form-control-sm" field="getTotalResults"/>
                    <small>{formApi.getError("getTotalResults")}</small>
                  </div>
                  <div className="form-group">
                    <label>Resources</label>
                    <TextArea className="form-control form-control-sm" field="resources"/>
                    <small>{formApi.getError("resources")}</small>
                  </div>
                  <div className="form-group">
                    <label>Specs</label>
                    <TextArea className="form-control form-control-sm" field="specs"/>
                    <small>{formApi.getError("content")}</small>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary" type="submit">Save changes</button>
                </div>
              </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    );
  }

  private getFormApi = (formApi: FormApi<IFormValues>) => {
    this.formApi = formApi;
  }

  private loadProject = async () => {
    const id = this.props.match.params.id;
    try {
      const response = await axios.default.get(`http://localhost:8080/api/v1/projects/${id}`);
      if (response.data) {
        this.setState({ project: response.data });
        if (this.formApi) {
          this.formApi.setValues(response.data);
        }
      }
    } catch (e) {
      getToastManager().addToast(getErrorMessage(e), "danger");
    }
  }

  private onSubmit = async (values: IFormValues) => {
    const id = this.props.match.params.id;
    try {
      await axios.default.put(`http://localhost:8080/api/v1/projects/${id}`, values);
      getToastManager().addToast(`Edited project "${values.name}"`, "success");
    } catch (e) {
      getToastManager().addToast(`Error updating project ${values.name}: ${getErrorMessage(e)}`, "danger");
    }
  };
}
