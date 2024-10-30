import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';
import { NotificationsDto } from './dto/notifications.dto';
import { events } from '../utils/helper';
import { NotificationType } from '../entities/notifications.entity';
import { Followers } from '../entities/followers.entity';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', '*'],
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() server!: Server;

  constructor(
    private readonly notificationsService: NotificationsService
  ) {}

  afterInit() {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Handling user joining their own room
  @SubscribeMessage(events.JOIN)
  async joinUserRoom(client: Socket, userId: string) {
    console.log(`${client.id} has joined the room ${userId}`);
    client.join(userId); // Join userId room
  }

  async handleFollow(recipientId: string, actorId: string, message: string) {
    const notification = await this.notificationsService.createNotification({ recipientId, actorId, type: NotificationType.FOLLOW })
    console.log("followed emit -> ", notification);
    this.server.to(recipientId).emit(events.FOLLOW, {notification, message});
  }

  async handleSentRequest(recipientId: string, actorId: string, message: string) {
    console.log("request sent emit");
    const notification = await this.notificationsService.createNotification({ recipientId, actorId, type: NotificationType.REQUEST });
    this.server.to(recipientId).emit(events.REQUEST, {notification, message});
  }

  async handleAcceptRequest(recipientId: string, actorId: string, message: string) {
    console.log("request accepted emit");
    const notification = await this.notificationsService.createNotification({ recipientId, actorId, type: NotificationType.ACCEPT });
    this.server.to(recipientId).emit(events.ACCEPT, {notification, message});
  }

  // Method to handle post creation and notify followers
  async handleNewPost(followers: Followers[], data: NotificationsDto, message: string ) {
    // Send notification to all followers
    for(const follower of followers) {
      const notification = await this.notificationsService.createNotification({ ...data , recipientId: follower.id});
      console.log("new post emit to ", follower.id);
      this.server.to(follower.id).emit(events.POST_ADDED, {notification, message});
    };
  }

  async handleLike(recipientId: string, data: NotificationsDto, message: string) {
    // Send notification to post creator
    const notification = await this.notificationsService.createNotification({ ...data , recipientId});
    console.log("like event emit to ", recipientId);
    this.server.to(recipientId).emit(events.LIKE, {notification, message});
  }

  async handleUnlike(recepientId: string, data: NotificationsDto) {
    await this.notificationsService.deleteNotifications(data);
    this.server.to(recepientId).emit(events.UNLIKE, data)
  }

  async handleComment(recipientId: string, data: NotificationsDto, message: string) {
    // Send notification to post creator
    const notification = await this.notificationsService.createNotification({ ...data , recipientId});
    console.log("comment event emit to ", recipientId);
    this.server.to(recipientId).emit(events.COMMENT, {notification, message});
  }

  async handleReply(recipientId: string, data: NotificationsDto, message: string) {
    // Send notification to post commenter
    const notification = await this.notificationsService.createNotification({ ...data , recipientId });
    console.log("reply event emit to ", recipientId);
    this.server.to(recipientId).emit(events.REPLY, {notification, message});
  }

  async handleShare(recipientId: string, data: NotificationsDto, message: string) {
    // Send notification to post creator
    const notification = await this.notificationsService.createNotification({ ...data , recipientId });
    console.log("share event emit to ", recipientId);
    this.server.to(recipientId).emit(events.SHARE, {notification, message});
  }

}
