import arrayMutators from "final-form-arrays";
import * as React from "react";
import { Form as FinalForm } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { CheckboxInput } from "src/components/inputs/CheckboxInput";
import { CodeInput } from "src/components/inputs/CodeInput";
import { Select } from "src/components/inputs/Select";
import { TextInput } from "src/components/inputs/TextInput";

interface IProps {
  initialValues: object | undefined;
  onSubmit: (values: object) => any;
}

interface IState {
  selectedTab: "specs" | "resources" | "advanced";
}

export class ProjectForm extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedTab: "specs"
    };
  }

  public render() {
    const { initialValues, onSubmit } = this.props;
    const { selectedTab } = this.state;

    return (
      <FinalForm
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ handleSubmit, form }) => {
          const values = form.getState().values || {};
          const specs = values && values.specs || [];
          const resources = values && values.resources || [];
          const specOptions = specs.map((spec: any) => ({ value: spec.id, lable: spec.name }));

          return (
            <form onSubmit={handleSubmit} className="card">
              <div className="card-body d-flex flex-row p-0">
                <ul className="nav nav-tabs nav-tabs--vertical nav-tabs--left" role="navigation">
                  <li className="nav-item">
                    <a
                      href="javascript:void(0);"
                      className={`nav-link ${selectedTab === "specs" ? "active": ""}`}
                      data-toggle="tab"
                      role="tab"
                      aria-controls="lorem"
                      onClick={() => this.setState({ selectedTab: "specs" })}
                    >
                      Specs <small className="text-muted">({specs.length})</small>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="javascript:void(0);"
                      className={`nav-link ${selectedTab === "resources" ? "active": ""}`}
                      data-toggle="tab"
                      role="tab"
                      aria-controls="lorem"
                      onClick={() => this.setState({ selectedTab: "resources" })}
                    >
                      Resources <small className="text-muted">({resources.length})</small>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="javascript:void(0);"
                      className={`nav-link ${selectedTab === "advanced" ? "active": ""}`}
                      data-toggle="tab"
                      role="tab"
                      aria-controls="lorem"
                      onClick={() => this.setState({ selectedTab: "advanced" })}
                    >
                      Advanced
                    </a>
                  </li>
                </ul>
                <div className="tab-content flex-grow-1">
                  {selectedTab === "specs" && (
                    <div className="tab-pane show active" id="lorem" role="tabpanel">
                      <TextInput name="name" label="Name" />
                      <FieldArray
                        name="specs"
                        render={({ fields }) => (
                          <div>
                            {fields.map((name, index) => (
                              <div  className="d-flex" key={index}>
                                <div className="flex-grow-1 mr-3"><TextInput name={`${name}.id`} label="ID" /></div>
                                <div className="flex-grow-1 mr-3"><CodeInput name={`${name}.spec`} label="Spec" mode="javascript" /></div>
                                <div className="flex-grow-1">
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    type="button"
                                    onClick={() => fields.remove(index)}
                                  >
                                    <i className="zmdi zmdi-delete" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <div className="text-right">
                              <button
                                className="btn btn-sm btn-secondary"
                                type="button"
                                onClick={() => fields.push({ id: "" })}
                              >
                                <i className="zmdi zmdi-plus" />
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  )}
                  {selectedTab === "resources" && (
                    <div className="tab-pane show active" id="lorem" role="tabpanel">           
                      <FieldArray
                        name="resources"
                        render={({ fields }) => (
                          <>
                            {fields.map((name, index) => (
                              <div className="card mb-4 bg-light" key={index}>
                                <div className="card-header d-flex">
                                  <div className="flex-grow-1 mr-3"><TextInput name={`${name}.name`} /></div>
                                  <button
                                    className="btn btn-sm btn-secondary"
                                    type="button"
                                    onClick={() => fields.remove(index)}
                                  >
                                    <i className="zmdi zmdi-delete" />
                                  </button>
                                </div>
                                <div className="card-body">
                                  <table className="mb-3 w-100">
                                    <tbody>
                                      <tr>
                                        <td><small>Spec</small></td>
                                        <td className="pr-5"><Select options={specOptions} name={`${name}.spec`} /></td>
                                        <td><small>ID</small></td>
                                        <td className="pr-5"><TextInput name={`${name}.id`} /></td>
                                        <td><small>ID Field</small></td>
                                        <td><small><TextInput name={`${name}.idField`}/></small></td>
                                      </tr>
                                      <tr>
                                        <td><small>Create Operation</small></td>
                                        <td className="pr-5"><TextInput name={`${name}.createOperation`} /></td>
                                        <td><small>List Operation</small></td>
                                        <td className="pr-5"><TextInput name={`${name}.listOperation`}/></td>
                                        <td><small>Get Operation</small></td>
                                        <td><small><TextInput name={`${name}.getOperation`}/></small></td>
                                      </tr>
                                      <tr>
                                        <td><small>Delete Operation</small></td>
                                        <td className="pr-5"><TextInput name={`${name}.deleteOperation`} /></td>
                                        <td><small>Parameter Name</small></td>
                                        <td className="pr-5"><TextInput name={`${name}.parameterName`}/></td>
                                        <td><small>Get List Items</small></td>
                                        <td><small><TextInput name={`${name}.getListItems`}/></small></td>
                                      </tr>
                                      <tr>
                                        <td><small>List Item Schema</small></td>
                                        <td className="pr-5"><TextInput name={`${name}.listItemSchema`}/></td>
                                        <td><small>Name Plural</small></td>
                                        <td className="pr-5"><TextInput name={`${name}.namePlural`}/></td>
                                        <td><small>Name Field</small></td>
                                        <td><TextInput name={`${name}.nameField`}/></td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <FieldArray
                                    name={`${name}.relationships`}
                                    render={(props) => (
                                      <>
                                        <h5>Relationships <small className="text-muted">({props.fields.length})</small></h5>
                                        {props.fields.length ? (
                                          <table className="table table-sm mb-0">
                                            <thead>
                                              <tr>
                                                <th><small>Resource ID</small></th>
                                                <th><small>Field</small></th>
                                                <th><small>Get ID</small></th>
                                                <th><small>Many</small></th>
                                                <th/>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {props.fields.map((innerName, innerIndex) => (
                                                <tr key={innerIndex}>
                                                  <td><TextInput name={`${innerName}.resourceId`} /></td>
                                                  <td><TextInput name={`${innerName}.field`} /></td>
                                                  <td><TextInput name={`${innerName}.getId`} /></td>
                                                  <td><CheckboxInput name={`${innerName}.many`} /></td>
                                                  <td className="text-right">
                                                    <button
                                                      className="btn btn-sm btn-link"
                                                      type="button"
                                                      onClick={() => props.fields.remove(innerIndex)}
                                                    >
                                                      <i className="zmdi zmdi-delete" />
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        ) : null}
                                        <div className="text-right">
                                          <button
                                            className="btn btn-sm btn-link"
                                            type="button"
                                            onClick={() => props.fields.push({})}
                                          >
                                            <i className="zmdi zmdi-plus" /> Add Relationship
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  />
                                </div>
                              </div>
                            ))}
                            <button
                              className="btn btn-sm btn-secondary"
                              type="button"
                              onClick={() => fields.push({ id: "" })}
                            >
                              <i className="zmdi zmdi-plus" /> Add Resource
                            </button>
                          </>
                        )}
                      />
                    </div>
                  )}
                  {selectedTab === "advanced" && (
                    <div className="tab-pane show active" id="lorem" role="tabpanel">
                      <CodeInput name="initialize" label="Initialize function" mode="javascript" />
                      <CodeInput name="signOut" label="Sign Out function" mode="javascript" />
                      <CodeInput name="addPageParams" label="Add page params function" mode="javascript" />
                      <CodeInput name="getTotalResults" label="Get total results function" mode="javascript" />
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-primary" type="submit">Save changes</button>
              </div>
            </form>
          );
        }}
      />
    );
  }
}