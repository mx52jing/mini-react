import React from "./lib/React/index.js";

// const App = React.createElement(
//     "div",
//     { id: "user" },
//     "hi-",
//     "mini-",
//     "react",
//     React.createElement("span", { class: "desc" }, "，Nice to see you")
// )

const App = (
    <div id="user">
        hello-mini-react
        <div className="child1">
            child1
            <p className="child1-1">
                child1-1<br/>
                <span className="child1-1-1">
                    child1-1-1
                </span>
            </p>
        </div>
    </div>
)

export default App