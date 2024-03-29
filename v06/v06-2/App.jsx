import React from "./lib/React/index.js";


let count = 0
let props = { id: 'count' }
const Counter = ({ num }) => {
    const update = React.update()
    const handleCounter1Click = () => {
        count++
        props = props?.id ? {} : { id: `${count}`}
        update()
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

let homeCount = 0
const Home = () => {
    console.log("Home render")
    const update = React.update()
    const handleIncrementCount = () => {
        homeCount++
        update()
    }
    return (
        <div className="home">
            <button onClick={handleIncrementCount}>点击增加home的count</button>
            <div>homeCount is {homeCount}</div>
        </div>
    )
}


let userCount = 0
const User = () => {
    console.log("User render")
    const update = React.update()
    const handleIncrementCount = () => {
        userCount++
        update()
    }
    return (
        <div className="user">
            <button onClick={handleIncrementCount}>点击增加user的count</button>
            <div>userCount is {userCount}</div>
        </div>
    )
}

let show = false
const App = () => {
    console.log("App render")
    const update = React.update()
    const handleToggleShow = () => {
        show = !show
        update()
    }
    return (
        <div className="app-container">
            <button onClick={handleToggleShow}>点击切换show状态</button>
            <User />
            <Home />
        </div>
    )
}

export default App