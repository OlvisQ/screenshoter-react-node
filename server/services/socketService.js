let socketIO;
const socketService = (io) => {
  socketIO = io;
  io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
}

export const sendDataToClient = (data) => {
  if (socketIO) {
    socketIO.sockets.emit("broadcast", data);
  }
}

export default socketService
