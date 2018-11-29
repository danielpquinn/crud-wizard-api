// tslint:disable:jsx-no-lambda

import * as axios from "axios";
import * as React from "react";
import "./Home.css";

interface IState {
  email: string;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  password: string;
  response: axios.AxiosResponse | null;
  submitted: boolean;
  disabled: boolean;
}

class Home extends React.Component<{}, IState> {
  private validateTimeout: number;

  constructor(props: {}) {
    super(props);

    this.state = {
      disabled: false,
      email: "",
      isEmailValid: false,
      isPasswordValid: false,
      password: "",
      response: null,
      submitted: false
    };
  }

  public render() {
    const {
      disabled,
      isEmailValid,
      isPasswordValid,
      response,
      submitted
    } = this.state;

    let error: React.ReactNode = null;

    if (response && response.status >= 400) {
      const message = response.data && response.data.message;
      error = (
        <div className="alert alert-warning">
          {message || "Something went wrong"}
        </div>
      );
    }

    return (
      <div className="container container-home flex-column ml-0 h-100">
        <div className="row row-home h-100">

          <div className="col-7 home-col-left h-100 p-5">
            <img src="home-background.svg" className="home-background"/>
            <div className="row">
              <div className="col-10">
                <img src="home-logo.png" alt="crud wizard" className="home-logo mb-5"/>
                <h2 className="mb-4">Generate a user interface for your API in minutes.</h2>
                <h5 className="mb-4">Provide crud wizard with an OpenAPI specification for your API and it will generate a flexible, polished and robust user interface for managing your resources.</h5>
                <a href="#" className="btn btn-light mr-3">documentation</a>
                <a href="#" className="btn btn-light">demo</a>
              </div>
              <div className="col-3"/>
            </div>
          </div>

          <div className="col-5 home-col-right p-5">
            <h2 className="mb-4">Free for 30 days 🧙‍♂️</h2>
            <h5 className="mb-4">No credit card required to sign up, cancel any time.</h5>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                disabled={disabled}
                className={`form-control ${submitted && (!isEmailValid ? "is-invalid" : "is-valid")}`}
                placeholder="Enter email address"
                type="text"
                name="email"
                value={this.state.email}
                onChange={(e) => {
                  this.setState({ email: e.target.value }, this.validate);
                }}
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="email">Password</label>
              <input
                disabled={disabled}
                className={`form-control ${submitted && (!isPasswordValid ? "is-invalid" : "is-valid")}`}
                placeholder="Enter password"
                type="password"
                name="password"
                value={this.state.password}
                onChange={(e) => {
                  this.setState({ password: e.target.value }, this.validate);
                }}
              />
            </div>

            {error}

            <p className="text-center">
              <a href="javascript:void(0);" onClick={this.onSubmit} className="btn btn-lg btn-primary w-100">Create Account</a>
            </p>
            <p className="text-center">
                Already have an account? <a href="javascript:void(0);">Log in</a>
            </p>
          </div>

        </div>
      </div>
    );
  }

  private validate = () => {
    window.clearTimeout(this.validateTimeout);
    this.validateTimeout = window.setTimeout(() => {
      const { email, password } = this.state;
      this.setState({
        isEmailValid: !!(email && email.length >= 8),
        isPasswordValid: !!(password && password.length >= 8)
      });
    }, 200);
  }

  private onSubmit = async () => {
    const {
      disabled,
      isEmailValid,
      isPasswordValid,
      submitted
    } = this.state;

    if (disabled) { return; }

    if (!submitted) {
      this.setState({ submitted: true });
    }

    if (!isEmailValid || !isPasswordValid) { return; }

    let response: axios.AxiosResponse;
    this.setState({ disabled: true });

    try {
      response = await axios.default.post("http://localhost:8080/v1/users", {
        email: this.state.email,
        password: this.state.password
      });
    } catch (e) {
      response = e.response;
    }
    this.setState({
      disabled: false,
      response
    });
  }
}

export default Home;
