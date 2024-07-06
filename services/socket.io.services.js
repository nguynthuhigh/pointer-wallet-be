// socket-io-handler.js
const socketIo = require('socket.io');


module.exports = function(socketServer,db) {

    db.once('open', () => {
        console.log('Connected to MongoDB');

        const changeStream = db.collection('temp_transactions').watch();

        changeStream.on('change', (change) => {
            console.log('A change occurred:', change);

            io.emit('transactionChange', change);
        });
    });

    const io = socketIo(socketServer);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};
