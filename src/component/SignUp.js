import React, { useState } from "react";
import { Link } from "@reach/router";
import "../App.css";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { auth, generateUserDocument } from "../firebase";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const signInWithEmailAndPasswordHandler =
        (event, email, password) => {
            event.preventDefault();
        };

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

    const createUser = async (event, email, password) => {
        event.preventDefault();
        try {
            const { user } = await auth.createUserWithEmailAndPassword(email, password);
            generateUserDocument(user, { displayName });
        }
        catch (error) {
            setError('Error Signing up with email and password');
        }

        setEmail("");
        setPassword("");
        setDisplayName("");
    };

    
    return (
        <div class="main">
            <p class="sign" >Sign Up</p>
            <Grid container spacing={3} style={{ 'marginLeft': '16px' }} >
                <Grid item xs={12}>
                    <TextField id="standard-basic"
                        label="Display Name" value={displayName}
                        name='displayName'
                        onChange={(event) => onChangeHandler(event)} />

                </Grid>
                <Grid item xs={12}>
                    <TextField id="standard-basic"
                        label="Email" value={email}
                        name='userEmail'
                        onChange={(event) => onChangeHandler(event)} />
                </Grid>
                <Grid item xs={12}>
                    <TextField id="standard-password-input"
                        label="Password"
                        type="password"
                        name='userPassword'
                        autoComplete="current-password"
                        value={password} onChange={(event) => onChangeHandler(event)} />
                </Grid>
                <Grid item xs={2}>
                    <Button className="submit" onClick={(event) => { createUser(event, email, password) }}>Sign up</Button>
                    
                </Grid>
                <Grid item xs={8}>
                    {error !== null && (
                        <div style={{'fontSize': '14px','color': 'red'}}>
                            {error}
                        </div>
                    )}
                </Grid>
                <Grid item xs={8}>
                    <p style={{ 'fontSize': '13px' }}>Already have an account?{" "}
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