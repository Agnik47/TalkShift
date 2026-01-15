const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const socketIo = require("./socket");
const UserRouter = require("./routes/userRoutes");
const GroupRouter = require("./routes/GroupRoutes");
const ChatRouter = require("./routes/messageRoute");
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:5173"],
    method: ["GET", "POST"],
    credentials: true,
  },
});

//middlewares
app.use(cors());
app.use(express.json());
//connect to database
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 20000 })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

//initialize socket.io
socketIo(io);

//routes
app.use("/api/users", UserRouter);
app.use("/api/groups", GroupRouter);
app.use("/api/messages", ChatRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
