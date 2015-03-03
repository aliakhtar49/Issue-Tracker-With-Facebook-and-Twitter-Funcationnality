var io = require('socket.io');
exports.initialize = function (server) {
    console.log("g");
    io = io.listen(server);
    var self = this;

    this.chatInfra1 = io.of("/chat_infra1");
    this.chatInfra1.on("connection", function (socket) {
        socket.on("set_name", function (data) {
            socket.set('nickname', data.name, function () {
                socket.emit('name_set', data);
                socket.send(JSON.stringify({type:'serverMessage',
                    message:'Welcome to the most interesting ' +
                        'chat room on earth!'}));

            });
        });
        socket.on("join_room", function (room) {
            socket.get('nickname', function (err, nickname) {
                socket.join(room.name);
                var comSocket = self.chatCom1.sockets[socket.id];
                // console.log("socket"+socket.id);
                comSocket.join( room.name);
                comSocket.room = room.name;
                socket.in(room.name).broadcast.emit('user_entered', {'name':nickname});
            });
        });
        socket.on("get_rooms", function(){
            var rooms = {};
            for(var room in io.sockets.manager.rooms){
                console.log(room);
                if(room.indexOf("/chat_infra1/") == 0){
                    var roomName = room.replace("/chat_infra1/", "");
                    rooms[roomName] = io.sockets.manager.rooms[room].length;
                }
            }
            socket.emit("rooms_list", rooms);
        });
        });
    this.chatCom1 = io.of("/chat_com1");
    this.chatCom1.on("connection", function (socket) {
        socket.on('message', function (message) {
            message = JSON.parse(message);
            if (message.type == "userMessage") {
                socket.get('nickname', function (err, nickname) {
                    console.log("Message in " + socket.room);
                    message.username = nickname;
                    socket.in(socket.room).broadcast.send(JSON.stringify(message));
                    message.type = "myMessage";
                    socket.in(socket.room).send(JSON.stringify(message));
                    });
                }
            });
        });







    /*var chatInfra = io.of("/chat_infra")
        .on("connection", function(socket){*/
    this.chatInfra = io.of("/chat_infra");
    this.chatInfra.on("connection", function (socket) {
            console.log("in asocket");
            socket.on("set_name", function (data) {
                socket.set('nickname', data.name, function () {
                    socket.emit('name_set', data);
                    socket.send(JSON.stringify({type:'serverMessage',
                        message:'Welcome to the most interesting ' +
                            'chat room on earth!'}));
                    socket.broadcast.emit('user_entered', data);
                });
            });
        });
   /* var chatCom = io.of("/chat_com")
        .on("connection", function (socket) {*/
    this.chatCom = io.of("/chat_com");
    this.chatCom.on("connection", function (socket) {
            socket.on('message', function (message) {
                message = JSON.parse(message);
                if (message.type == "userMessage") {
                    socket.get('nickname', function (err, nickname) {
                        message.username = nickname;
                        socket.broadcast.send(JSON.stringify(message));
                        message.type = "myMessage";
                        socket.send(JSON.stringify(message));
                    });
                }
            });
        });
}