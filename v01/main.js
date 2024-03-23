import React from "./lib/React";
import ReactDom from "./lib/ReactDom/index.js";

const user = React.createElement(
    "div",
    { id: "user" },
    "hi-",
    "mini-",
    "react",
    React.createElement("span", { class: "desc" }, "，Nice to see you")
)

console.log(user)

ReactDom.createRoot(document.getElementById("app")).render(user)