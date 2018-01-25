/* @flow */
import React, { Component } from "react";
import Helmet from "react-helmet";
import config from "config/application";

type Props = {
  children: any,
};

export default class MasterLayout extends Component {
  props: Props;
  render() {
    return (
      <div>
        <Helmet {...config.head} />
        {this.props.children}
      </div>
    );
  }
}
