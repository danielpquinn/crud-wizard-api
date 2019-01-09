import * as axios from "axios";
import * as H from "history";
import { Form, Text, TextArea } from "informed";
import * as React from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "src/lib/error";
import { getToastManager } from "src/lib/ToastManager";

interface IProps {
  history: H.History;
}

interface IState {
  errorMessage: string | null;
}

interface IFormValues {
  name: string;
  specs: string;
  resources: string;
  initialize: string;
  addPageParams: string;
  getTotalResults: string;
}

export class CreateProject extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = { errorMessage: null };
  }

  public render() {
    const { errorMessage } = this.state;

    if (errorMessage !== null) {
      return (
        <div className="alert alert-warning">{errorMessage}</div>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active"><Link to="/projects">Projects</Link></li>
                <li className="breadcrumb-item active">Create Project</li>
              </ol>
            </nav>
            <h3>Create Project</h3>
            <Form<IFormValues> onSubmit={this.onSubmit} >
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
                  <button className="btn btn-primary" type="submit">Create project</button>
                </div>
              </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    );
  }

  private onSubmit = async (values: IFormValues) => {
    try {
      await axios.default.post("http://localhost:8080/api/v1/projects/", values);
      getToastManager().addToast(`Created project "${values.name}"`, "success");
      this.props.history.push("/projects");
    } catch (e) {
      getToastManager().addToast(`Error creating project ${values.name}: ${getErrorMessage(e)}`, "danger");
    }
  };
}
