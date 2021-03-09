Description of the application:- User can signup and login to access the todos. User can also use his/her google account to login into the application used firebase authentication in this. Once the account will be created user can login into the application. User can create todos and todos can have multiple sub-todos in it. Todos can be updated and deleted. Backend is created in Node.js which is using Redis cache to cache the data. When the user signs out the data from cache will be pushed to firestore


Technologies Used :- ReactJS, Material-UI, Context API, Firebase


Setup :- To get the frontend running locally follow the following steps:
            1. Clone this repo
            2. npm install to install all requried dependencies
            3. npm start to start the local server (this project uses create-react-app -> 
                npx create-react-app my-app)