import React, { useState,useContext } from "react";
import { Link } from "@reach/router";
import "../css/App.css";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { UserContext } from "../UserProvider";
import { auth, signInWithGoogle } from "../config/firebase";

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const user = useContext(UserContext);

    /* SignIn using email id and password */
    const signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
          setError("Error signing in with password and email!");
          console.error("Error signing in with password and email", error);
        });
    };

    const onChangeHandler = (event) => {
        const { name, value } = event.currentTarget;

        if (name === 'userEmail') {
            setEmail(value);
        }
        else if (name === 'userPassword') {
            setPassword(value);
        }
    };

    return (
        <div className="main">
            <p className="sign" >Sign in</p>
            <Grid container spacing={3} className="signInContainer">
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
                        className='bigTextField'
                        autoComplete="current-password"
                        name='userPassword'
                        value={password} onChange={(event) => onChangeHandler(event)} />
                </Grid>
                <Grid item xs={12}>
                    <Button className="signInSubmit" onClick={(event) => { signInWithEmailAndPasswordHandler(event, email, password,"clicked") }}>Sign in</Button>
                </Grid>

                <Grid item xs={2}></Grid>
                <Grid item xs={2}></Grid>

                <Grid item xs={1}>
                    <div >OR</div>
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" className="signInSubmit" onClick={signInWithGoogle}>Sign in with Google</Button>
                </Grid>

                <Grid item xs={8}>
                    {error !== null && (
                        <div className='signInError'>
                            {error}
                        </div>
                    )}
                </Grid>

                <Grid item xs={8}>
                    <p className='noAccount'>Don't have an account?{" "}
                        <Link to="signUp" className="text-blue-500 hover:text-blue-600">
                            Sign up here
                        </Link>{" "}
                        <br />{" "}
                    </p>
                </Grid>
            </Grid>
        </div>
    );
};


export default SignIn;