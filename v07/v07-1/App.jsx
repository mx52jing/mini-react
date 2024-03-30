import React from "./lib/React/index.js";


const App = () => {
    console.log("render")
    const [count, setCount] = React.useState(10)
    const [open, setOpen] = React.useState(false)
    const handleCountIncrement = () => {
        setCount(s => s + 1)
        setOpen(open => !open)
    }
    return (
        <div className="app-container">
            <div>
                count is {count}，
                open is {open ? 'open' : 'close'}
                <br/>
                <button onClick={handleCountIncrement}>增加count</button>
            </div>
        </div>
    )
}

export default App