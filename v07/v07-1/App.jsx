import React from "./lib/React/index.js";


const Foo = () => {
    React.useEffect(() => {
        console.log("foo effect init and update")
        return () => {
            console.log("foo effect init and update clean")
        }
    })
    React.useEffect(() => {
        console.log("foo effect init")
        return () => {
            console.log("foo effect init clean")
        }
    }, [])
    return (
        <div className="foo">
            Foo
        </div>
    )
}

const App = () => {
    console.log("APP render")
    const [count, setCount] = React.useState(10)
    const [open, setOpen] = React.useState(false)
    const handleCountIncrement = () => {
        setCount(c => c + 1)
        setOpen(open => !open)
    }
    React.useEffect(() => {
        console.log("app effect init")
        return () => {
            console.log("app effect init clean")
        }
    }, [])
    React.useEffect(() => {
        console.log("app effect update", count)
        return () => {
            console.log("app effect update clean")
        }
    }, [count])
    return (
        <div className="app-container">
            <div>
                count is {count}，
                open is {open ? 'open' : 'close'}
                <br/>
                <button onClick={handleCountIncrement}>增加count</button>
                <Foo />
            </div>
        </div>
    )
}

export default App