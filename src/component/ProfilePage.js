import React, { useContext } from "react";
import { UserContext } from "../UserProvider";
import {auth} from "../firebase";
import Grid from '@material-ui/core/Grid';
import "../App.css";

const ProfilePage = () => {
  const user = useContext(UserContext);
  const {photoURL, displayName, email} = user;

  return( <div>
    <div
    style={{
      background: `url(${photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'})  no-repeat center center`,
      backgroundSize: "cover",
      height: "200px",
      width: "200px"
    }}
    
  ></div>
  <div>
    <h2>{displayName}</h2>
    <h3>{email}</h3>
  </div>
<button onClick = {() => {auth.signOut()}}>Sign out</button>

</div>)

  // return (
  //   {/*<div className="container">
  //     {/*<Grid container xs={12} spacing={2} >
  //       <Grid container xs={2} spacing={2} className="profileLeft">
  //         {/*<div
  //           style={{
  //             background: `url(${photoURL || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png'})  no-repeat center center`,
  //             backgroundSize: "cover",
  //             height: "200px",
  //             width: "200px"
  //           }}></div>*/
  //           /*<h2>{displayName}</h2>
  //           <h3>{email}</h3>
  //           <button onClick = {() => {auth.signOut()}}>Sign out</button>

  //       </Grid>

  //       <Grid container xs={8} spacing={2} >
  //         <div>HELLO</div>
  //       </Grid>


  //         </Grid>*/
       
       
  // ) 
};

export default ProfilePage;