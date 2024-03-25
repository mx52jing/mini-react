import React from "./lib/React/index.js";

const App = React.createElement(
    "div",
    { id: "user" },
    "hi-",
    "mini-",
    "react",
    React.createElement("span", { class: "desc" }, "，Nice to see you")
)


export default App