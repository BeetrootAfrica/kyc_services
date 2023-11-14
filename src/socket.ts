import { Server } from "socket.io";
let connection: any = null;

export class Socket {
    socket: any;

    constructor() {
        this.socket = null;
    }
    connect(server: any) {
        const io = new Server(server, {
            // options
        });
        io.on("connection", (socket: any) => {
            this.socket = socket;
            console.log('Server running!')
            socket.on('get-user', (message: any) => {
                console.log(`Message from NestJS: ${message}`);
                // return {};
                this.socket.emit('recieve-user',message )
            });
            socket.on('getUserFromNodeApp', (userId) => {
                console.log(` userId: ${userId}`);

                // Simulate processing and fetching user data
                const user = { id: userId, name: 'John Doe' };
                console.log(`userFromNodeApp: ${user}`);
                // Emit the user data back to the NestJS app
                socket.emit('userFromNodeApp', user);
              });
                        socket.on('disconnect', () => {
                console.log(`Client disconnected: ${socket.id}`);
            });
        });
    }
    emit(event: any, data: any) {
        this.socket.emit(event, data);
    }
    static init(server: any) {
        if (!connection) {
            connection = new Socket();
            connection.connect(server);
        }
    }
    static getConnection() {
        if (connection) {
            return connection;
        }
    }
}
export default {
    connect: Socket.init,
    connection: Socket.getConnection
}