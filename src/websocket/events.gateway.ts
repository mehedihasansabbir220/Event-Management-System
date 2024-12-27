// websocket/events.gateway.ts
import { 
  WebSocketGateway, 
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('EventsGateway');
  private connectedClients = new Map<string, Socket>();

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);
    
    // Send current connected clients count
    this.broadcastConnectedClients();
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
    
    // Update connected clients count
    this.broadcastConnectedClients();
  }

  private broadcastConnectedClients() {
    this.server.emit('connectedClients', {
      count: this.connectedClients.size
    });
  }

  notifyEventCreated(event: any) {
    this.logger.debug(`Broadcasting new event: ${event.id}`);
    this.server.emit('eventCreated', event);
  }

  notifySpotsFilling(eventId: string, remainingSpots: number) {
    this.logger.debug(`Broadcasting spots filling for event: ${eventId}`);
    this.server.emit('spotsFilling', { 
      eventId, 
      remainingSpots,
      timestamp: new Date().toISOString()
    });
  }

  notifyEventCancelled(eventId: string) {
    this.logger.debug(`Broadcasting event cancellation: ${eventId}`);
    this.server.emit('eventCancelled', { 
      eventId,
      timestamp: new Date().toISOString()
    });
  }
}