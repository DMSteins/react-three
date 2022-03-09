import { useState, useEffect } from 'react'
import * as THREE from "three"
import { Routes, Route, HashRouter } from "react-router-dom"
import Example1 from "./views/example1"
import Example2 from "./views/example2"
import Example3 from "./views/example3"
import Example4 from "./views/example4"
function App() {
    const RouteConfig = {
        "/example1": <Example1/>,
        "/example2": <Example2/>,
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
                <Route path="/" element={<Example1/>} />
            </Routes>
            
        </div>
    )
}

export default App
