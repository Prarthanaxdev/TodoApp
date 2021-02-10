import React, { useState,useContext } from "react";
import { Link } from "@reach/router";
import "../App.css";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { UserContext } from "../UserProvider";
import {signInWithGoogle} from '../firebase'

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const user = useContext(UserContext);

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
    };

    return (
        <div class="main">
            <p class="sign" >Sign in</p>
            <Grid container spacing={3} style={{ 'marginLeft': '16px' }} >
                <Grid item xs={12}>
                    <TextField id="standard-basic"
                        label="Email" value={email}
                        name='userEmail'
                        className='inputBox'
                        onChange={(event) => onChangeHandler(event)} />
                </Grid>
                <Grid item xs={12}>
                    <TextField id="standard-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        name='userPassword'
                        value={password} onChange={(event) => onChangeHandler(event)} />
                </Grid>
                <Grid item xs={2}>
                    <Button className="submit" onClick={(event) => { signInWithEmailAndPasswordHandler(event, email, password) }}>Sign in</Button>
                </Grid>
                <Grid item xs={1}>
                    <div style={{ "marginTop": '10px', 'fontSize': '14px' }}>OR</div>
                </Grid>

                <Grid item xs={5}>
                    <Button variant="contained" color="primary" className="submit" onClick={signInWithGoogle}>Sign in with Google</Button>
                </Grid>

                <Grid item xs={8}>
                    <p style={{'fontSize':'13px'}}>Don't have an account?{" "}
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