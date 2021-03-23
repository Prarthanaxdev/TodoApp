import React from "react";
import Application from "./modules/Application.jsx";
import UserProvider from "./UserProvider";
import {Provider} from 'react-redux';
import store from "./store";

function App() {
  return(<UserProvider>
     <Provider store={store}>
        <Application />
      </Provider>
    </UserProvider>
  );
}

export default App;