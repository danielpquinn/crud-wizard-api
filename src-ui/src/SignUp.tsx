import * as axios from "axios";
import * as H from "history";
import { Form, Text } from "informed";
import * as React from "react";
import { Link } from "react-router-dom";
import { Home } from "src/Home";

interface IProps {
  history: H.History;
}

interface IState {
  response: axios.AxiosResponse | null;
  disabled: boolean;
}

interface IFormValues {
  email: string;
  password: string;
}

export class SignUp extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      disabled: false,
      response: null
    };
  }

  public render() {
    const {
      disabled,
      response
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
      <Home>
        <h2 className="mb-4">Free for 30 days 🧙‍♂️</h2>
        <h5 className="mb-4">No credit card required to sign up, cancel any time.</h5>
        <Form<IFormValues> onSubmit={this.onSubmit}>
          {({ formApi, formState }) => (
            <>
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Text
                    disabled={disabled}
                    placeholder="Enter email address"
                    className={`form-control ${formState.submits && (formApi.getError("email") ? "is-invalid" : "is-valid")}`}
                    field="email"
                    validate={this.validateEmail}
                  />
                  <small>{formApi.getError("email")}</small>
                </div>
              </div>
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Text
                    disabled={disabled}
                    placeholder="Enter password"
                    type="password"
                    className={`form-control ${formState.submits && (formApi.getError("password") ? "is-invalid" : "is-valid")}`}
                    field="password"
                    validate={this.validatePassword}
                  />
                  <small>{formApi.getError("password")}</small>
                </div>
              </div>

              {error}

              <p className="text-center">
                <button type="submit" disabled={!!(formState.submits && disabled)} className="btn btn-lg btn-primary w-100">Create Account</button>
              </p>
            </>
          )}
        </Form>
        <p className="text-center">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </Home>
    );
  }

  private validateEmail = (value: string) => {
    // const valid = !!(value && value.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/));
    // if (!valid) { return "Invalid email address"; }
    return undefined;
  }

  private validatePassword = (value: string) => {
    const valid = !!(value && value.length >= 8);
    if (!valid) { return "Password must be at least 8 characters long"; }
    return undefined;
  }

  private onSubmit = async (values: IFormValues) => {
    const { disabled } = this.state;

    if (disabled) { return; }

    let response: axios.AxiosResponse;
    this.setState({ disabled: true });

    try {
      response = await axios.default.post("http://localhost:8080/api/v1/users", {
        email: values.email,
        password: values.password
      });
    } catch (e) {
      response = e.response;
    }
    this.setState({
      disabled: false,
      response
    });

    if (response.data && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      this.props.history.push("/projects");
    }
  }
}
