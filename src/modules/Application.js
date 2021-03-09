import React, { useState,useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ProfilePage from "./ProfilePage";
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