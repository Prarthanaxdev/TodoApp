import { auth, generateUserDocument } from "./config/firebase";
import React, { useState, useEffect } from "react";
export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /* Acts an observer for changes to the user's sign-in state */
    auth.onAuthStateChanged(async userAuth => {  
      if (window.location.pathname === '/signUp') {
        setCurrentUser(null);
        setIsLoading(false)
      }

      else {
        const user = await generateUserDocument(userAuth);
        if (user) {
          if (userAuth.emailVerified == true) {
            setCurrentUser(userAuth);
            setIsLoading(false)
          } else {
            setCurrentUser(user);
            setIsLoading(false)
          }
        } else {
          setCurrentUser(null);
          setIsLoading(false)
        }
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
