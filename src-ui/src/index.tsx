import * as axios from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { CreateProject } from "src/components/projects/CreateProject";
import { Project } from "src/components/projects/Project";
import { Projects } from "src/components/projects/Projects";
import { Toaster } from "src/components/Toaster";
import "src/index.css";
import { LogIn } from "src/LogIn";
import registerServiceWorker from "src/registerServiceWorker";
import { SignUp } from "src/SignUp";

axios.default.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = token;
  }
  return config;
});

// tslint:disable:jsx-no-lambda
ReactDOM.render(
  <Router>
    <div className="router">
      <Route path="/" exact={true} component={SignUp} />
      <Route path="/login" component={LogIn} />
      <Route path="/projects" component={Projects} />
      <Route path="/create-project" component={CreateProject} />
      <Route path="/projects/:id" component={Project} />
      <Toaster />
    </div>
  </Router>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
