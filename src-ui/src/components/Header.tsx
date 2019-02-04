import * as React from "react";
import { getNavigationManager } from "src/lib/NavigationManager";
import { getProjectManager } from "src/lib/ProjectManager";

interface IState {
  accountOpen: boolean;
}

/**
 * @class Header
 * @description Header with resouces and signout dropdown 
 */

export class Header extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      accountOpen: false
    };
  }

  public render() {
    const { accountOpen } = this.state;
    const project = getProjectManager().getProject();
    const signOut = project.signOut;

    // tslint:disable:jsx-no-lambda
    return (
      <header className="header d-flex align-items-start">
        <div className="mr-auto">
          <a
            className="btn btn-link"
            href="javascript:void(0);"
            onClick={this.toggleMenuOpen}
          >
            <i className="zmdi zmdi-menu"/>
          </a>
        </div>
        {signOut && (
          <div className="text-right">
            <ul className="navbar-nav">
              <li className={`nav-item dropdown ${accountOpen ? "show" : ""}`}>
                <a
                  href="javascript:void(0);"
                  className="nav-link dropdown-toggle"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded={accountOpen}
                  onClick={this.toggleAccountOpen}
                >
                  <i className="zmdi zmdi-account-o"/>
                </a>
                <div className={`dropdown-menu dropdown-menu-right ${accountOpen ? "show" : ""}`}>
                  <a className="dropdown-item" href="javascript:void(0);" onClick={signOut}>Sign out</a>
                </div>
              </li>
            </ul>
          </div>
        )}
      </header>
    );
  }

  /**
   * Toggle menu visibility
   */
  private toggleMenuOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();

    getNavigationManager().toggle();

    if (getNavigationManager().getMenuOpen()) {
      window.addEventListener("click", this.onWindowClick);
    }
  }

  /**
   * Toggle account menu visibility
   */
  private toggleAccountOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();

    this.setState({
      accountOpen: !this.state.accountOpen
    }, () => {
      if (this.state.accountOpen) {
        window.addEventListener("click", this.onWindowClick);
      }
    });
  }

  private onWindowClick = (e: MouseEvent) => {
    this.closeAccountMenu();
    if (getNavigationManager().getMenuOpen()) {
      getNavigationManager().toggle();
    }
    window.removeEventListener("click", this.onWindowClick);
  }

  private closeAccountMenu() {
    this.setState({
      accountOpen: false
    });
  }
}
