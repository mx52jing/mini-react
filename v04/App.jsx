import React from "./lib/React/index.js";


let count = 0
const Counter = ({ num }) => {
    const handleCounter1Click = () => {
        count++
        console.log(count, "count")
        React.update()
    }
    return (
        <div className="counter">
            I am Counter， my number is {num}
            <div>
                <button onClick={handleCounter1Click}>点击改变count</button>
                <span>当前count的值为{count}</span>
            </div>
        </div>
    )
}

const App = () => {
    return (
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
        <Counter
            num={22}
            className='counter1'
        />
        <div className="child2">
            child2
            <br/>
            <span>child2-1</span><br/>
            <span>child2-2</span><br/>
            {/*<Counter num={66}/>*/}
        </div>
    </div>
)
}

export default App