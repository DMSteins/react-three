import { useState, useEffect } from 'react'
import * as THREE from "three"
import { Routes, Route, HashRouter } from "react-router-dom"
import ExampleOne from "./views/exampleOne"
import ExampleTwo from "./views/exampleTwo"
import Example3 from "./views/example3"
import Example4 from "./views/example4"
function App() {
    const RouteConfig = {
        "/one": <ExampleOne/>,
        "/two": <ExampleTwo/>,
        "/example3": <Example3/>,
        "/example4": <Example4/>,
    }
    useEffect(() => {
        
    }, []);
    
    return (
        <div className="App">
            <Routes>
                {
                    Object.keys(RouteConfig).map(path=>{
                        return <Route key={path} path={path} element={RouteConfig[path]} />
                    })
                }
                <Route path="/" element={<ExampleOne/>} />
            </Routes>
            
        </div>
    )
}

export default App
