import React, { Component } from 'react';
import { Container } from 'reactstrap';
import NavMenu  from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavMenu />
            {/*<Container>*/}
            <div className="center-container-holder">
               {this.props.children}
            </div>
        {/*</Container>*/}
      </div>
    );
  }
}
