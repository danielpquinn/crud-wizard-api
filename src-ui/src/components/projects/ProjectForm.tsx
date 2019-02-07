import arrayMutators from "final-form-arrays";
import * as React from "react";
import { Form as FinalForm } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { CheckboxInput } from "src/components/inputs/CheckboxInput";
import { CodeInput } from "src/components/inputs/CodeIndex";
import { TextInput } from "src/components/inputs/TextInput";


interface IProps {
  initialValues: object | undefined;
  onSubmit: (values: object) => any;
}

export class ProjectForm extends React.Component<IProps> {

  public render() {
    const { initialValues, onSubmit } = this.props;

    return (
      <FinalForm
        mutators={{ ...arrayMutators }}
        initialValues={initialValues}
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="card">
            <div className="card-body">
              <TextInput name="name" label="Name" />
              <div className="code-input-height-100">
                <CodeInput name="initialize" label="Initialize function" mode="javascript" />
                <CodeInput name="signOut" label="Sign Out function" mode="javascript" />
                <CodeInput name="addPageParams" label="Add page params function" mode="javascript" />
                <CodeInput name="getTotalResults" label="Get total results function" mode="javascript" />
              </div>
              <FieldArray
                name="resources"
                render={({ fields }) => (
                  <div className="card mb-4">
                    <div className="card-header">
                      Resources
                    </div>
                    <div className="card-body">
                      {fields.map((name, index) => (
                        <div className="card mb-2">
                          <div className="card-header text-right">
                            <button
                              className="btn btn-sm btn-secondary"
                              type="button"
                              onClick={() => fields.remove(index)}
                            >
                              <i className="zmdi zmdi-delete" />
                            </button>
                          </div>
                          <div className="card-body">
                            <div className="d-flex" key={index}>
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.id`} label="ID" /></div>
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.idField`} label="ID Field" /></div>
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.name`} label="Name" /></div>
                            </div>
                            <div className="d-flex">
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.nameField`} label="Name Field" /></div>
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.namePlural`} label="Name Plural" /></div>
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.createOperation`} label="Create Operation" /></div>
                            </div>
                            <div className="d-flex">
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.listOperation`} label="List Operation" /></div>
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.listItemSchema`} label="List Item Schema" /></div>
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.getListItems`} label="Get List Items Function" /></div>
                            </div>
                            <div className="d-flex">
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.getOperation`} label="Get Operation" /></div>
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.parameterName`} label="Parameter Name" /></div>
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.spec`} label="Spec name" /></div>
                            </div>
                            <div className="d-flex">
                              <div className="flex-grow-1 mr-3"><TextInput name={`${name}.deleteOperation`} label="Delete Operation" /></div>
                              <div className="flex-grow-1 mr-3" />
                              <div className="flex-grow-1 mr-3" />
                            </div>
                            <FieldArray
                              name={`${name}.relationships`}
                              render={(props) => (
                                <div className="card">
                                  <div className="card-header">
                                    Relationships
                                  </div>
                                  <div className="card-body">
                                    {props.fields.map((innerName, innerIndex) => (
                                      <div  className="d-flex" key={innerIndex}>
                                        <div className="flex-grow-1 mr-3"><TextInput name={`${innerName}.resourceId`} label="Resource ID" /></div>
                                        <div className="flex-grow-1 mr-3"><TextInput name={`${innerName}.field`} label="Field" /></div>
                                        <div className="flex-grow-1 mr-3"><TextInput name={`${innerName}.getId`} label="Get ID" /></div>
                                        <div className="flex-grow-1 mr-3"><CheckboxInput name={`${innerName}.many`} label="Many" /></div>
                                        <div className="flex-grow-1">
                                          <button
                                            className="btn btn-sm btn-secondary"
                                            type="button"
                                            onClick={() => fields.remove(innerIndex)}
                                          >
                                            <i className="zmdi zmdi-delete" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="card-footer text-right">
                                    <button
                                      className="btn btn-sm btn-secondary"
                                      type="button"
                                      onClick={() => props.fields.push({})}
                                    >
                                      <i className="zmdi zmdi-plus" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="card-footer text-right">
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
              <FieldArray
                name="specs"
                render={({ fields }) => (
                  <div className="card">
                    <div className="card-header">
                      OpenAPI JSON Specs
                    </div>
                    <div className="card-body">
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
                    </div>
                    <div className="card-footer text-right">
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
            <div className="card-footer">
              <button className="btn btn-primary" type="submit">Save changes</button>
            </div>
          </form>
        )}
      />
    );
  }
}