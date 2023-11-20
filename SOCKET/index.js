const { Server } = require('socket.io')
const io = new Server(9000, {
    cors: {
        origin: "*"
    }
})
let users = [] // array
const addUser = (userData, socketId) => {
    const existingUserIndex = users.findIndex(user => user.email === userData.email);
    if (existingUserIndex !== -1) {
      users[existingUserIndex].online = true; // Update online status
      users[existingUserIndex].socketId = socketId; // Update socket ID
    } else {
      users.push({ ...userData, socketId, online: true }); // Add new user
    }
  };
io.on('connection', (socket) => {
    socket.on('addUser', userData => {
        addUser(userData, socket.id)
        io.emit('getUser',users)
    })
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    })
    socket.on('join chat', (room) => {
        socket.join(room)
    })
    socket.on('newMsg', (msg) => {
        var chat = msg.chat
        if (!chat.user) return console.log("no user")
        chat.user.forEach(user => {
            if (user._id === msg.sender._id) return
            socket.in(user._id,).emit("message received", msg)
        });
    })
    socket.on('remove', () => {
        users = users.map(user => {
          if (user.socketId === socket.id) {
            return { ...user, online: false };
          }
          return user;
        });
        io.emit('getUser', users);
      });
})
