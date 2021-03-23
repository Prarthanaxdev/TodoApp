import React, { useState,useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp.jsx";
import ProfilePage from "./ProfilePage.jsx";
import { UserContext } from "../UserProvider";

function Application() {
    const  {user,isLoading}  = useContext(UserContext);
    
    if(isLoading) return <div>Loading...</div>

    return (
        user  ?
            <ProfilePage path="profilePage" />
            :
            <Router>
                <SignIn path="/" />
                <SignUp path="signUp" />
            </Router> 
    )
}
export default Application;