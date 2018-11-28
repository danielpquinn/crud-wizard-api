import * as React from 'react';
import './Home.css';

class Home extends React.Component {
  public render() {
    return (
      <div className="container container-home flex-column">
        <div className="row row-home">

          <div className="col-8 home-col-left">
            <img src="home-background.svg" className="home-background"/>
            <div className="row">
              <div className="col-8">
                <img src="home-logo.png" alt="crud wizard" className="home-logo"/>
                <h2>Generate a user interface for your API in minutes.</h2>
                <h5 className="message-secondary">Provide crud wizard with an OpenAPI specification for your API and it will generate a flexible, polished and robust user interface for managing your resources.</h5>
                <a href="#" className="btn btn-primary">documentation</a>
                <a href="#" className="btn btn-primary">demo</a>
              </div>
              <div className="col-4"/>
            </div>
          </div>

          <div className="col-4 home-col-right">
            <p className="message-primary">Test</p>
            <p className="message-secondary">Test</p>
            <div className="text-center">
              <a href="#" className="btn btn-lg btn-primary">Create Account</a>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default Home;
