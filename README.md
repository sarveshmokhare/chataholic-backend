# chataholic

This chat app is hosted at: https://chataholic.onrender.com

Tech stack:
* Frontend: React and Material UI
* Backend: Node and Express
* Database: MongoDB
* Real-time message sending functionality: Socket.IO

What this app can do?
1. User authorization and authentication is completely handled with JWT
2. Passwords of the users are salted and hashed
3. The users can send real-time messages
4. Real-time message sending functionality is implemented using Socket.IO
5. Once the user signs up and logs in, she can create as many chat rooms as she want
6. The user can also join any existing chat room with the that room's unique 4-digit code
7. All the members of a particular chat room can be viewed
8. The user can leave any chat room 
9. A chat room can have any number of members

For development:
1. Clone the repository
2. In /frontend/src/helpers/routes/routes.js , change the backendUrl to any the localhost where backend server is running (e.g. http://localhost:8000 )
3. Add environment variables for backend server in an .env file
4. Install dependencies with "npm i"
5. Spin up the backend server on root route with "node server.js" or "nodemon server.js"
6. Install dependencies in /frontend with "npm i" and start development server with "npm start"
