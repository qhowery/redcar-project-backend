import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // You can set this to a specific origin if needed (e.g., 'http://192.168.1.97:3000')
  },
})
export class AppGateway implements OnGatewayInit {
  @WebSocketServer() server!: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  @SubscribeMessage('clientMessage')
  handleClientMessage(client: any, payload: any): string {
    console.log('Received message from client:', payload);
    return 'Message received';
  }

  sendMessage(message: string) {
    console.log('Emitting message:', message);
    this.server.emit('serverMessage', message);
  }
}
