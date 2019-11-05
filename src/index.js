import React from "react";
import ReactDOM from "react-dom";

import "index.scss";

import Application from "components/Application";

// thiss renders the entire react page. Application gets appended to the root node of the DOM tree
ReactDOM.render(<Application />, document.getElementById("root"));
