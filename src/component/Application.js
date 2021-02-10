import React, { useState,useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ProfilePage from "./ProfilePage";
import { UserContext } from "../UserProvider";

function Application() {
    const user = useContext(UserContext);

    return (
        user ?
            <ProfilePage path="profilePage" />
            :
            <Router>
                <SignIn path="/" />
                <SignUp path="signUp" />
            </Router>
    )

}
export default Application;