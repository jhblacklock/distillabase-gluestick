import PropTypes from "prop-types";
import React from "react";
import { Icon } from "semantic-ui-react";
import "./CustomMessage.less";

const CustomMessage = ({ children }) => (
  <div className="message-container">
    <Icon name="question" />
    <div className="text-message">{children}</div>
  </div>
);

CustomMessage.propTypes = {
  children: PropTypes.node,
};

export default CustomMessage;
