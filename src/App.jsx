import { useState, useEffect } from 'react'
import * as THREE from "three"
import { Routes, Route, HashRouter } from "react-router-dom"
import ExampleOne from "./views/exampleOne"
import ExampleTwo from "./views/exampleTwo"
function App() {
    const RouteConfig = {
        "/one": <ExampleOne/>,
        "/two": <ExampleTwo/>
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
