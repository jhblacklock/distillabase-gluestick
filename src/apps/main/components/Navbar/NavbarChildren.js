import PropTypes from "prop-types";
import React from "react";
import { Container } from "semantic-ui-react";
import "./NavbarChildren.less";

const NavbarChildren = ({ children }) => (
  <Container className="main-container">{children}</Container>
);

NavbarChildren.propTypes = {
  children: PropTypes.node,
};

export default NavbarChildren;
