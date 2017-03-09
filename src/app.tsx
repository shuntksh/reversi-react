import * as React from "react";
import * as ReactDom from "react-dom";

import { Square } from "./components/Board";

ReactDom.render(
    <Square />,
    document.getElementById("main"),
);
