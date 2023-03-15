import React from "react"
import { Outlet , Navigate } from "react-router-dom"
import Cookies from 'js-cookie'


export default function ProtectedRoute(){
    const isAuth = Cookies.get('jwtAdminToken')
    return isAuth ? <Outlet/> : <Navigate to="/login"/>;
}

