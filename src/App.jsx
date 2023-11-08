import { useState, useEffect } from 'react'
import * as THREE from "three"
import { Routes, Route, HashRouter } from "react-router-dom"
import Example1 from "./views/example1"
import Example2 from "./views/example2"
import Example3 from "./views/example3"
import Example4 from "./views/example4"
import Example5 from "./views/example5"
import Example6 from "./views/example6"
import Example7 from "./views/skeleton"
import Models from "./views/models"
function App() {
    const RouteConfig = {
        "/example1": <Example1/>,
        "/example2": <Example2/>,
        "/example3": <Example3/>,
        "/example4": <Example4/>,
        "/example5": <Example5/>,
        "/example6": <Example6/>,
        "/example7": <Example7/>,
        "models": <Models />
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
                <Route path="/" element={<Example1/>} />
            </Routes>
            
        </div>
    )
}

export default App
