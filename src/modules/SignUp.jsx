import React, { useState } from "react";
import { Link } from "@reach/router";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { auth, generateUserDocument } from "../config/firebase";
import "../css/App.css";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    const onChangeHandler = (event) => {
        const { name, value } = event.currentTarget;
        if (name === 'userEmail') {
            setEmail(value);
        }
        else if (name === 'userPassword') {
            setPassword(value);
        }
        else if (name === 'displayName') {
            setDisplayName(value);
        }
    };

    /* SignUp of the user */
    const createUser = async (event, email, password) => {
        try {
            const  {user} = await auth.createUserWithEmailAndPassword(email, password);
            generateUserDocument(user, { displayName });
            auth.signOut()
            window.alert("Signed Up Successfully");
            setEmail("");
            setPassword("");
            setDisplayName("");
        }
        catch (error) {
            setError('Error Signing up with email and password');
        }
    };

    return (
        <div className="main">
            <p className="sign" >Sign Up</p>
            <Grid container spacing={3} className="signInContainer" >
                <Grid item xs={12}>
                    <TextField id="standard-basic"
                        label="Display Name" value={displayName}
                        name='displayName'
                        className='bigTextField'
                        onChange={(event) => onChangeHandler(event)} />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField id="standard-basic"
                        label="Email" value={email}
                        name='userEmail'
                        className='bigTextField'
                        onChange={(event) => onChangeHandler(event)} />
                </Grid>

                <Grid item xs={12}>
                    <TextField id="standard-password-input"
                        label="Password"
                        type="password"
                        name='userPassword'
                        className='bigTextField'
                        autoComplete="current-password"
                        value={password} onChange={(event) => onChangeHandler(event)} />
                </Grid>

                <Grid item xs={12}>
                    <Button className="submit" className="signInSubmit" onClick={(event) => {createUser(event, email, password)}}>Sign up</Button>
                </Grid>

                <Grid item xs={8}>
                    {error !== null && (
                        <div className='signInError'>
                            {error}
                        </div>
                    )}
                </Grid>

                <Grid item xs={8}>
                    <p className='noAccount'>Already have an account?{" "}
                        <Link to="/" className="text-blue-500 hover:text-blue-600">
                            Sign in here
                        </Link>{" "}
                        <br />{" "}
                    </p>
                </Grid>
            </Grid>
        </div>
    );
};

export default SignIn;