import * as axios from "axios";
import * as H from "history";
import * as React from "react";
import { Link } from "react-router-dom";
import { Home } from "src/Home";

interface IProps {
  history: H.History;
}

interface IState {
  email: string;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  password: string;
  response: axios.AxiosResponse | null;
  submitted: boolean;
  disabled: boolean;
}

export class LogIn extends React.Component<IProps, IState> {
  private validateTimeout: number;

  constructor(props: IProps) {
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
      <Home>
        <h2 className="mb-4">Log In 🧙‍♂️</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              disabled={disabled}
              className={`form-control ${submitted && (isEmailValid ? "is-valid" : "is-invalid")}`}
              placeholder="Enter email address"
              type="text"
              name="email"
              value={this.state.email}
              onChange={(e) => {
                this.setState({ email: e.target.value }, this.validate);
              }}
            />
            {submitted && !isEmailValid && <small>Please enter a valid email address</small>}
          </div>
          <div className="form-group mb-4">
            <label htmlFor="email">Password</label>
            <input
              disabled={disabled}
              className={`form-control ${submitted && (isPasswordValid ? "is-valid" : "is-invalid")}`}
              placeholder="Enter password"
              type="password"
              name="password"
              value={this.state.password}
              onChange={(e) => {
                this.setState({ password: e.target.value }, this.validate);
              }}
            />
            {submitted && !isPasswordValid && <small>Password must be at least 8 characters</small>}
          </div>

          {error}

          <p className="text-center">
            <button type="submit" disabled={(submitted && (!isEmailValid || !isPasswordValid)) || disabled} className="btn btn-lg btn-primary w-100">Log In</button>
          </p>
        </form>
        <p className="text-center">
            Don't have an account? <Link to="/">Sign Up</Link>
        </p>
      </Home>
    );
  }

  private validate = () => {
    window.clearTimeout(this.validateTimeout);
    this.validateTimeout = window.setTimeout(() => {
      const { email, password } = this.state;
      this.setState({
        isEmailValid: !!(email && email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)),
        isPasswordValid: !!(password && password.length >= 8)
      });
    }, 200);
  }

  private onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      response = await axios.default.post("http://localhost:8080/api/v1/login", {
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
    if (response.data && response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      this.props.history.push("/projects");
    }
  }
}
