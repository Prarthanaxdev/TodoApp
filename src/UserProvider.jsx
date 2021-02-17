import { auth, generateUserDocument } from "./firebase";
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";

export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(async userAuth => {

      if(window.location.pathname==='/signUp'){
        setCurrentUser(null);
        setIsLoading(false)

      }else{
        const user = await generateUserDocument(userAuth);

        if(user){
          if(userAuth.emailVerified == true){
            setCurrentUser(userAuth);
            setIsLoading(false)
          }else{
            setCurrentUser(user);
            setIsLoading(false)
          }
        }else{
          setCurrentUser(null);
          setIsLoading(false)
        }
      }
    });

    // const unsubscribe = onAuthStateChange(setCurrentUser);
    // return () => {
    //   unsubscribe();
    // };

  }, []);

  return (
    <UserContext.Provider
      value={{ user, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
