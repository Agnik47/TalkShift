const { connect } = require("mongoose");

const socketIo = (io) => {
  // Store connected users with room info
  // key   → socket.id
  // value → { user, room }
  const connectedUsers = new Map();

  // When a user connects
  io.on("connection", (socket) => {
    // Get user from authentication (sent from frontend)
    const user = socket.handshake.auth.user;

    if (!user) {
      console.log("Unauthenticated socket blocked ❌");
      socket.disconnect();
      return;
    }

    console.log("User Connected Successfully ✅", user.username);

    //! START: JOIN ROOM HANDLER
    socket.on("join room", (groupId) => {
      // Add socket to the specific room
      socket.join(groupId);

      // Store user and room info in connectedUsers map
      connectedUsers.set(socket.id, { user, room: groupId });

      // Get all users currently in this room
      const usersInRoom = Array.from(connectedUsers.values())
        .filter((u) => u.room === groupId)
        .map((u) => u.user);

      // Emit updated user list to all clients in the room
      io.in(groupId).emit("usersInRoom", usersInRoom);

      // Broadcast join notification to other users in the room
      socket.to(groupId).emit("notification", {
        type: "USER_JOINED",
        message: `${user.username} has joined the group`,
        user: user,
      });
    });
    //! END: JOIN ROOM HANDLER

    //! START: LEAVE ROOM HANDLER
    socket.on("leave room", (groupId) => {
      socket.leave(groupId);
      console.log(user?.username, "left the group", groupId);

      if (connectedUsers.has(socket.id)) {
        connectedUsers.delete(socket.id);
      }

      // Get remaining users in room
      const usersInRoom = Array.from(connectedUsers.values())
        .filter((u) => u.room === groupId)
        .map((u) => u.user);

      // Emit updated user list
      io.in(groupId).emit("usersInRoom", usersInRoom);

      // Notify others
      socket.to(groupId).emit("notification", {
        type: "USER_LEFT",
        message: `${user.username} left the group`,
        user: user,
      });
    });
    //! END: LEAVE ROOM HANDLER

    //! START: NEW MESSAGE HANDLER
    socket.on("message recived", ({ groupId, message }) => {
      //Broadcast message to all users in the group except sender
      socket.to(groupId).emit("message recived", message);
    });
    //! END: NEW MESSAGE HANDLER

    //! START: TYPING INDICATOR
    socket.on("typing", (groupId, username) => {
      socket.to(groupId).emit("user typing", {
        username,
      });
    });

    socket.on("stopTyping", (groupId) => {
      socket.to(groupId).emit("user stop typing", {
        username: user?.username,
      });
    });
    //! END: TYPING INDICATOR

    //! DISCONNECT HANDLER
    socket.on("disconnect", () => {
      const userData = connectedUsers.get(socket.id);

      if (!userData) {
        console.log("Socket disconnected without joining a room");
        return;
      }

      socket.to(userData.room).emit("user left", userData.user?._id);

      connectedUsers.delete(socket.id);

      console.log("User Disconnected ❌", userData.user?.username);
    });
  });
};

module.exports = socketIo;
