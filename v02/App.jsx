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
                child1-1
                <br/>
                <span className="child1-1-1">
                    child1-1-1 <br/>
                    <span className="child1-1-1-1">child1-1-1-1</span><br/>
                    <span className="child1-1-1-2">child1-1-1-2</span>
                </span>
            </p>
            <p>child1-2</p>
            <p>child1-3</p>
            <p>child1-4</p>
        </div>
        <div className="child2">
            child2
            <span>child2-1</span><br/>
            <span>child2-2</span><br/>
        </div>
    </div>
)

export default App