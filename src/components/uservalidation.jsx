import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./login";
import { Signup } from "./signup"

export function Uservalidation()
{
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/Login" element={<Login/>}/>
                    <Route path="/SignUp" element={<Signup/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}