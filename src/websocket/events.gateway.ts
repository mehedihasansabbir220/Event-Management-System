import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  notifyEventCreated(event: any) {
    this.server.emit('eventCreated', event);
  }

  notifySpotsFilling(eventId: string, remainingSpots: number) {
    this.server.emit('spotsFilling', { eventId, remainingSpots });
  }
}