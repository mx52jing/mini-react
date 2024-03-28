import React from "./lib/React/index.js";


let count = 0
let props = { id: 'count' }
const Counter = ({ num }) => {
    const handleCounter1Click = () => {
        count++
        props = props?.id ? {} : { id: `${count}`}
        React.update()
    }
    return (
        <div className="counter" {...props}>
            I am Counter， my number is {num}
            <div style={{ color: '#ec4035', backgroundColor: '#3c5cd9' }}>
                <button onClick={handleCounter1Click}>点击改变count</button>
                <span>当前count的值为{count}</span>
            </div>
        </div>
    )
}

const Bar = <div className='bar'>bar</div>
const Foo = (
    <div className='foo'>
        foo
        <p>foo-child1</p>
        <p>foo-child2</p>
    </div>
)

const User = () => {
    return (
        <div className="user">
            user
        </div>
    )
}

let show = false
const App = () => {
    const handleToggleShow = () => {
        show = !show
        React.update()
    }
    return (
        <div id="app-container">
            hello-mini-react
            <Counter
                num={22}
                className='counter1'
            />
            <button onClick={handleToggleShow}>点击切换show状态</button>
            {show ? <User /> : Bar}
        </div>
    )
}

export default App