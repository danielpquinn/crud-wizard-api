import arrayMutators from "final-form-arrays";
import * as React from "react";
import { Form as FinalForm } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { TextArea } from "src/components/inputs/TextArea";
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
              <TextArea name="initialize" label="Initialize function" />
              <TextArea name="signOut" label="Sign Out function" />
              <TextArea name="addPageParams" label="Add page params function" />
              <TextArea name="getTotalResults" label="Get total results function" />
              <FieldArray
                name="resources"
                render={({ fields }) => (
                  <div className="card">
                    <div className="card-header">
                      Resources
                    </div>
                    <div className="card-body">
                      {fields.map((name, index) => (
                        <div className="card">
                          <div className="d-flex" key={index}>
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.id`} label="ID" /></div>
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.idField`} label="ID Field" /></div>
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.name`} label="Name" /></div>
                          </div>
                          <div className="d-flex">
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.nameField`} label="Name Field" /></div>
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.namePlural`} label="Name Plural" /></div>
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.createOperation`} label="Create Operation" /></div>
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.listOperation`} label="List Operation" /></div>
                          </div>
                          <div className="d-flex">
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.listItemSchema`} label="List Item Schema" /></div>
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.getListItems`} label="Get List Items Function" /></div>
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.getOperation`} label="Get Operation" /></div>
                          </div>
                          <div className="d-flex">
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.parameterName`} label="Parameter Name" /></div>
                            <div className="flex-grow-1 mr-3"><TextInput name={`${name}.spec`} label="Spec name" /></div>
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
                          <div className="flex-grow-1 mr-3"><TextInput name={`${name}.spec`} label="Spec" /></div>
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