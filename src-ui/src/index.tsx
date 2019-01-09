import * as axios from "axios";
import "codemirror/lib/codemirror.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, RouteComponentProps, withRouter } from "react-router-dom";
import { Desktop } from "src/components/Desktop";
import { CreateProject } from "src/components/projects/CreateProject";
import { Project } from "src/components/projects/Project";
import { Projects } from "src/components/projects/Projects";
import { Toaster } from "src/components/Toaster";
import "src/index.css";
import { LogIn } from "src/LogIn";
import registerServiceWorker from "src/registerServiceWorker";
import { SignUp } from "src/SignUp";

const authTokenKey = "authToken";

class App extends React.Component<RouteComponentProps, {}> {
  
  constructor(props: RouteComponentProps) {
    super(props);

    axios.default.interceptors.request.use((config) => {
      const token = localStorage.getItem(authTokenKey);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = token;
      }
      return config;
    });
    
    // Redirect to login on 401
    axios.default.interceptors.response.use(
      response => response,
      (error) => {
        console.error(error);
        if (error && error.response && error.response.status === 401) {
          localStorage.removeItem(authTokenKey);
          this.props.history.push("/login");
        }
      }
    );
  }

  public render() {
    return (
      <div className="router">
        <Route path="/" exact={true} component={SignUp} />
        <Route path="/login" component={LogIn} />
        <Route path="/projects" exact={true} component={Projects} />
        <Route path="/create-project" component={CreateProject} />
        <Route path="/projects/:id" component={Project} />
        <Route path="/desktop/:id" component={Desktop} />
        <Toaster />
      </div>
    );
  }
}

const AppWithRouter = withRouter(App);

// tslint:disable:jsx-no-lambda
ReactDOM.render(
  <Router>
    <AppWithRouter />
  </Router>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
