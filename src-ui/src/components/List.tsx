import { AxiosResponse } from "axios";
import { get, startCase } from "lodash";
import * as React from "react";
import { Alert } from "src/components/Alert";
import { Button } from "src/components/Button";
import { JsonViewer } from "src/components/JsonViewer";
import { Loading } from "src/components/Loading";
import { ParamForm } from "src/components/ParamForm";
import { maxToggleColumnCheckboxWidth } from "src/constants";
import { getConfigManager } from "src/lib/ConfigManager";
import { getNumColumns } from "src/lib/layout";
import { findOperationObject, IOperationArguments, IOperationObjectWithPathAndMethod, operate } from "src/lib/swagger";
import { getWindowManager, WindowType } from "src/lib/WindowManager";
import { IBreadcrumb } from "src/types/breadcrumb";
import { IResource } from "src/types/resource";
import { Response, Schema } from "src/types/swagger";

/**
 * Map of column ID to visibility
 */
interface IVisibleColumns {
  [column: string]: boolean;
}

/**
 * Resource to render a list view for
 */
interface IProps {
  breadcrumbs: IBreadcrumb[];
  resourceId: string;
}

interface IState {

  /**
   * List operation response
   */
  axiosResponse: AxiosResponse | null;

  /**
   * Current page of results to display
   */
  currentPage: number;

  /**
   * Error message from server if list operation fails
   */
  errorMessage: string | null;

  /**
   * Default values for param form
   */
  defaultFormValues: { [key: string]: string }

  /**
   * Whether to display the list view settings form
   */
  showSettings: boolean;

  /**
   * Columns which are currently visible
   */
  visibleColumns: IVisibleColumns;
}

export class List extends React.Component<IProps, IState> {

  /**
   * Used to determine whether to attempt to stringify nested JSON fields
   */
  private static primativeTypes = new Set(["string", "number", "boolean"]);

  /**
   * Reference to this component's instance
   */
  private myRef: React.RefObject<HTMLDivElement>;

  /**
   * Arguments to list view operation collected from settings form
   */
  private args: IOperationArguments;

  /**
   * Resource from resource config
   */
  private resource: IResource | undefined;

  /**
   * List operation pulled from spec
   */
  private operation: IOperationObjectWithPathAndMethod | null;

  /**
   * Schema for list items pulled from operation
   */
  private schema: Schema | undefined;
  
  constructor(props: IProps) {
    super(props);

    this.myRef = React.createRef();

    // If initialization fails it will return an error message

    const errorMessage = this.initialize();

    // Initialize visible columns with an empty object

    const visibleColumns = {};

    // Start off with only the first x number of columns displayed
    if (this.resource) {
      visibleColumns[this.resource.nameField] = true;
      visibleColumns[this.resource.idField] = true;
    }

    const defaultFormValues = {};

    props.breadcrumbs.forEach((breadcrumb) => {
      defaultFormValues[breadcrumb.param] = breadcrumb.value;
    });

    this.args = {};

    props.breadcrumbs.forEach((breadcrumb) => {
      this.args[breadcrumb.param] = breadcrumb.value;
    });

    // Initialize state

    this.state = {
      axiosResponse: null,
      currentPage: 1,
      defaultFormValues,
      errorMessage,
      showSettings: false,
      visibleColumns
    };
  }

  /**
   * Load data when component mounts
   */
  public componentDidMount(): void {
    this.load();
  }

  public render() {
    const {
      axiosResponse,
      defaultFormValues,
      errorMessage,
      showSettings,
      visibleColumns
    } = this.state;

    // Get a list of visible column IDs
    
    const columns = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

    // Get properties from schema

    const properties = this.schema && this.schema.properties;

    // If there was an error loading items or something went wrong when trying
    // to pull data from the spec, display an error message

    if (errorMessage) {
      return <Alert level="danger">{errorMessage}</Alert>
    }

    // Bail if there's no resource or schema for some reason

    if (!this.resource || !this.schema) {
      return null;
    }

    // Get ID field from resource configuration

    const idField = this.resource.idField;
    
    // Get list items field from resource configuration. This is used to find
    // the list data within a response if the response isn't a simple array

    const { getListItems } = this.resource;
    
    // Get table column widths

    const columnWidth = visibleColumns ? Math.floor(100 / Object.keys(visibleColumns).length) : 100;

    // Initialize different parts of the list view template

    let table: JSX.Element;
    let rows: JSX.Element[] | null = null;
    let error: JSX.Element | null = null;
    let pagination: JSX.Element | null = null;

    // If there was an error loading data display an error message

    if (axiosResponse && axiosResponse.status >= 400) {
      error = <Alert level="danger"><JsonViewer value={axiosResponse.data}/></Alert>;
    } else if (axiosResponse && axiosResponse.data) {

      // Get list data from response

      let data: any[] = [];

      if (getListItems) {
        data = getListItems(axiosResponse);
      } else {
        data = axiosResponse.data;
      }

      // Create a row element for each item in the response

      rows = data.map((item: any, i: number) => {

        // Lambda is necessary to pass arguments to click handlers
        // tslint:disable:jsx-no-lambda

        return (
          <tr key={i}>{
            columns.map((column: string) => {

              if (!this.resource) {
                return null;
              }

              // If the data is a primitive type display it, otherwise stringify it so it's a little easier to read.

              const primitive = List.primativeTypes.has(typeof item[column]);
              const value = primitive ? item[column] : JSON.stringify(item[column]);

              return (
                <td
                  title={value}
                  style={{ width: `${columnWidth}%` }}
                  key={column}
                >
                  {column === this.resource.nameField ? (
                    <a href="javascript:void(0);" onClick={() => this.onClickName(item[idField]) }>{value || <em>None</em>}</a>
                  ) : value}
                </td>
              );
            })
          }</tr>
        );
      });
    }

    const headerCells = columns.map((column: string) => {
      return (
        <th
          title={startCase(column)}
          style={{ width: `${columnWidth}%` }}
          key={column}
        >
          {startCase(column)}
        </th>
      );
    });

    table = (
      <table className="table table-sm list-table">
        <thead>
          <tr>
            {headerCells}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );

    const hasNextPage = getConfigManager().getConfig().hasNextPage;

    if (axiosResponse && hasNextPage && hasNextPage(0, 0, axiosResponse)) {
      pagination = (
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item"><a className="page-link" href="#">Previous</a></li>
            <li className="page-item"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item"><a onClick={this.nextPage} className="page-link" href="#">Next</a></li>
          </ul>
        </nav>
      );
    }

    const toggleColumnRows: React.ReactNode[][] = [];

    if (this.myRef && this.myRef.current && properties) {
      const propertyKeys = Object.keys(properties);
      const numProperties = propertyKeys.length;
      const width = this.myRef.current.clientWidth;
      const numCols = getNumColumns(width, maxToggleColumnCheckboxWidth, numProperties);
      const numRows = Math.ceil(numProperties / numCols);

      for (let i = 0; i < numRows; i += 1) {
        toggleColumnRows.push([]);

        for (let j = 0; j < numCols; j += 1) {
          const key = propertyKeys[i * numCols + j];
          if (key) {
            toggleColumnRows[i].push(
              <td key={key}>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="defaultCheck1"
                    checked={visibleColumns[key]}
                    onChange={() => { this.toggleColumnVisibility(key); }}
                  />
                  <label className="form-check-label">
                    {startCase(key)}
                  </label>
                </div>
              </td>
            );
          }
        }
      }
    }

    return (
      <div  ref={this.myRef}>
        <h3>{this.resource.namePlural}</h3>
        <div className="d-flex">
          <div className="mr-auto">
            {this.resource.createOperation && (
              <Button size="sm" level="primary" onClick={this.onClickCreate}>Create {this.resource.name}</Button>
            )}
          </div>
          <div>
            <Button level="link" onClick={this.load}><i className="zmdi zmdi-refresh zmdi-hc-lg"/></Button>
            <Button level="link" onClick={this.onClickSettings}><i className="zmdi zmdi-filter-list zmdi-hc-lg"/></Button>
            <Button level="link" onClick={this.onClickSettings}><i className="zmdi zmdi-settings zmdi-hc-lg"/></Button>
          </div>
        </div>
        <div
          style={{
            height: showSettings ? "auto" : "0px",
            overflow: "hidden",
            visibility: showSettings ? "inherit" : "hidden"
          }}
        >
        <div className="card">
          <div className="card-body">
            <ParamForm
              defaults={defaultFormValues}
              onChange={this.onParamFormChange}
              operation={this.resource.listOperation}
              resource={this.resource}
            />
            <table className="table-toggle-columns">
              <tbody>
              {toggleColumnRows.map((row, i) => {
                return <tr key={i}>{row}</tr>;
              })}
              </tbody>
            </table>
            <p className="text-right">
              <Button onClick={this.load} level="primary" size="sm">Apply</Button>
            </p>
          </div>
          </div>
        </div>
        {axiosResponse ? table : <Loading />}
        {pagination}
        {error}
      </div>
    );
  }

  /**
   * Look up resource, operation and schema. Return an error message if we can't find something we need
   */
  private initialize(): string | null {
    const { resourceId } = this.props;

    this.resource = getConfigManager().getResource(resourceId);

    if (!this.resource) {
      return `Could not find resource with id ${resourceId}. Please make sure your resources.ts file is correct`;
    }

    const { listItemSchema, listOperation, spec } = this.resource;

    this.operation = findOperationObject(getConfigManager().getResolvedSpec(spec), listOperation);
    
    if (!this.operation) {
      return `Resource ${resourceId} does not have a \`listOperation\` field, cannot render detail view. Please make sure your resources.ts file is correct`;
    }

    if (listItemSchema) {
      this.schema = get(getConfigManager().getResolvedSpec(spec), listItemSchema.split("/"));
    } else {
      const responseSchema = (this.operation.operation.responses["200"] as Response).schema as Schema;
      this.schema = responseSchema.items as Schema;
    }
    
    if (!this.schema) {
      return `GET operation for resource ${resourceId} does not have a schema`;
    }

    return null;
  }

  /**
   * Handle param form changes
   */
  private onParamFormChange = (args: IOperationArguments) => {
    this.args = args;
  }

  /**
   * Handle click on settings icon
   */
  private onClickSettings = (e: any) => {
    this.toggleShowSettings();
  }

  /**
   * Toggle settings visibility
   */
  private toggleShowSettings() {
    this.setState({
      showSettings: !this.state.showSettings
    });
  }

  /**
   * Toggle column visibility
   */
  private toggleColumnVisibility(column: string) {
    const { visibleColumns } = this.state;
    visibleColumns[column] = !visibleColumns[column];
    this.setState({ visibleColumns });
  }

  /**
   * Open a detail window when a row item is clicked
   */
  private onClickName = (id: string) => {
    const { resourceId, breadcrumbs } = this.props;
    const resource = getConfigManager().getResource(resourceId);
    if (!resource) { return; }
    getWindowManager().addWindow(
      `detail:${id}`,
      WindowType.Detail,
      { breadcrumbs, resourceId, id },
      [ "breadcrumbs", "resourceId", "id" ]
    );
    getWindowManager().saveWindows();
  };

  /**
   * When a customer clicks "Create", open a create resource window
   */
  private onClickCreate = () => {
    const { breadcrumbs, resourceId } = this.props;

    getWindowManager().addWindow(`create:${resourceId}`, WindowType.Create, { breadcrumbs, resourceId }, [ "breadcrumbs", "resourceId" ]);
    getWindowManager().saveWindows();
  }

  // tslint:disable:no-console
  private load = async (): Promise<void> => {
    if (!this.resource) { return Promise.resolve(); }
    const { listOperation, spec } = this.resource;
    this.setState({ axiosResponse: null });
    const axiosResponse = await operate(getConfigManager().getResolvedSpec(spec), listOperation, this.args);
    this.setState({ axiosResponse });
  }

  private nextPage = async () => {
    if (!this.resource) {
      return;
    }
    const { listOperation, spec } = this.resource;
    const { axiosResponse } = this.state;
    if (!axiosResponse) { return; }
    this.setState({ axiosResponse: null });
    const nextPage = getConfigManager().getConfig().nextPage;
    if (!nextPage) { return; }
    const args = nextPage(0, 0, axiosResponse, this.args);
    const response = await operate(getConfigManager().getResolvedSpec(spec), listOperation, args);
    this.setState({ axiosResponse: response });
  }
}
