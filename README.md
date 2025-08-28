# **Blink Chat**

## **Project Overview**

Blink Chat is a real-time chat web application that allows users to communicate instantly in private or group conversations. It is built using the MERN stack with WebSocket integration for seamless communication. The application supports authentication, message persistence, and a responsive design for smooth usage across devices.

## **Features**

- **Real-Time Messaging**: Send and receive messages instantly using WebSockets.  
- **User Authentication**: Secure login and signup with **JWT** and **Bcrypt** password hashing.  
- **Persistent Chats**: Stores all messages in **MongoDB** for later access.  
- **Group Chats**: Create or join group conversations.  
- **Responsive UI**: Built with React for both desktop and mobile users.  
- **REST API + WebSocket**: Combination of REST for user management and WebSocket for real-time messages.  

## **Technologies Used**

- **Frontend**: React.js, Bootstrap, Axios, Socket.IO Client  
- **Backend**: Node.js, Express.js, Socket.IO  
- **Authentication**: JWT, Bcrypt  
- **Database**: MongoDB  
- **Tools**: Postman, Vercel, Render  

## **How to Use**

1. **Backend Setup**:
   - Install dependencies:
     ```bash
     npm install
     ```
   - Set up environment variables in `.env`:
     ```
     MONGO_URI=your_mongodb_url
     JWT_SECRET=your_secret_key
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

2. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     npm install
     npm start
     ```

3. **Access the Application**:
   - Open in browser: `http://localhost:3000`  
   - Register, log in, and start chatting in real-time.

## **Installation**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rakeshmuntha/Chat-App
   ```

2. **Run Backend and Frontend as described above.**

3. **Live Demo**:  
   🔗 [Live Link](https://chat-app-frontend-psi-beige.vercel.app/)
