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

type tabIds = "general" | "specs" | "resources" | "advanced";

interface IState {
  selectedTab: tabIds;
}

export class ProjectForm extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedTab: "general"
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
          const specOptions = specs.map((spec: any) => ({ value: spec.id, label: spec.id }));

          return (
            <form onSubmit={handleSubmit} className="card">
              <div className="card-body d-flex p-0">
                <ul className="nav nav-tabs nav-tabs--vertical nav-tabs--left" role="navigation">
                  {this.renderNavItem("General", "general")}
                  {this.renderNavItem(<>Specs <small className="text-muted">({specs.length})</small></>, "specs")}
                  {this.renderNavItem(<>Resources <small className="text-muted">({resources.length})</small></>, "resources")}
                  {this.renderNavItem("Advanced", "advanced")}
                </ul>
                <div className="tab-pane show active">
                  {selectedTab === "general" && (
                    <TextInput name="name" label="Project name" />
                  )}
                  {selectedTab === "specs" && (                 
                    <FieldArray
                      name="specs"
                      render={({ fields }) => (
                        <>
                          {fields.map((name, index) => (
                            <div className="card mb-4 bg-light" key={index}>
                              <div className="card-header d-flex">
                                <div className="flex-grow-1 mr-3">
                                  <TextInput
                                    name={`${name}.id`}
                                    label="OpenAPI specification file name"
                                    placeholder="e.g. petstore-api.json"
                                  />
                                </div>
                                <button
                                  className="btn btn-sm btn-secondary"
                                  type="button"
                                  onClick={() => fields.remove(index)}
                                >
                                  <i className="zmdi zmdi-delete" />
                                </button>
                              </div>
                              <div className="card-body">
                                <CodeInput
                                  name={`${name}.spec`}
                                  label="OpenAPI specification file (JSON format)"
                                  mode="javascript"
                                  height={600}
                                />
                              </div>
                            </div>
                          ))}
                          <button
                            className="btn btn-sm btn-secondary"
                            type="button"
                            onClick={() => fields.push({ id: "" })}
                          >
                            Add OpenAPI Spec
                          </button>
                        </>
                      )}
                    />
                  )}
                  {selectedTab === "resources" && (                  
                    <FieldArray
                      name="resources"
                      render={({ fields }) => (
                        <>
                          {fields.map((name, index) => (
                            <div className="card mb-4 bg-light" key={index}>
                              <div className="card-header d-flex">
                                <div className="flex-grow-1 mr-3"><TextInput name={`${name}.name`} label="Resource name" /></div>
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
                                      <td className="text-right pr-1">OpenAPI Spec</td>
                                      <td className="pr-3"><Select options={specOptions} name={`${name}.spec`} /></td>
                                      <td className="text-right pr-1">ID</td>
                                      <td className="pr-3"><TextInput name={`${name}.id`} /></td>
                                      <td className="text-right pr-1">ID Field</td>
                                      <td><TextInput name={`${name}.idField`}/></td>
                                    </tr>
                                    <tr>
                                      <td className="text-right pr-1">Create Operation</td>
                                      <td className="pr-3"><TextInput name={`${name}.createOperation`} /></td>
                                      <td className="text-right pr-1">List Operation</td>
                                      <td className="pr-3"><TextInput name={`${name}.listOperation`}/></td>
                                      <td className="text-right pr-1">Get Operation</td>
                                      <td><TextInput name={`${name}.getOperation`}/></td>
                                    </tr>
                                    <tr>
                                      <td className="text-right pr-1">Delete Operation</td>
                                      <td className="pr-3"><TextInput name={`${name}.deleteOperation`} /></td>
                                      <td className="text-right pr-1">Parameter Name</td>
                                      <td className="pr-3"><TextInput name={`${name}.parameterName`}/></td>
                                      <td className="text-right pr-1">Get List Items</td>
                                      <td><TextInput name={`${name}.getListItems`}/></td>
                                    </tr>
                                    <tr>
                                      <td className="text-right pr-1">List Item Schema</td>
                                      <td className="pr-3"><TextInput name={`${name}.listItemSchema`}/></td>
                                      <td className="text-right pr-1">Name Plural</td>
                                      <td className="pr-3"><TextInput name={`${name}.namePlural`}/></td>
                                      <td className="text-right pr-1">Name Field</td>
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
                                                <td className="text-right pr-1">
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
                  )}
                  {selectedTab === "advanced" && (
                    <>
                      <CodeInput name="initialize" label="Initialize function" mode="javascript" height={400} />
                      <CodeInput name="signOut" label="Sign Out function" mode="javascript" height={200} />
                      <CodeInput name="addPageParams" label="Add page params function" mode="javascript" height={200} />
                      <CodeInput name="getTotalResults" label="Get total results function" mode="javascript" height={200} />
                    </>
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

  private renderNavItem(label: React.ReactNode, id: tabIds): React.ReactNode {
    const { selectedTab } = this.state;

    return (
      <li className="nav-item">
        <a
          href="javascript:void(0);"
          className={`nav-link ${selectedTab === id ? "active": ""}`}
          data-toggle="tab"
          role="tab"
          aria-controls="lorem"
          onClick={() => this.setState({ selectedTab: id })}
        >
          {label}
        </a>
      </li>
    );
  }
}