// socket.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
    private socket: Socket | null = null;

    // Initialize and connect to the socket server
    initializeSocket(url: string, options = {}): void {
        if (!this.socket) {
            this.socket = io(url, options);
            // Handle connection errors
            this.socket.on('connect_error', (error) => {
                console.error('Connection Error:', error);
            });

            this.socket.on('disconnect', (reason) => {
                console.warn('Disconnected:', reason);
            });

            this.socket.on('connect', () => {
                console.log('Connected to the socket server', this.socket);
            });
        }
    }

    isSocketInitialized(): boolean {
        return !!this.socket;
    }

    // Emit event to the socket server
    emitEvent(event: string, data: any): void {
        if (this.socket) {
            this.socket.emit(event, data, (response: any) => {
                console.log(`Response from ${event} event:`, response);
            });
        } else {
            console.error('Socket is not initialized.');
        }
    }

    // Listen for events from the socket server
    listenEvent(event: string, callback: (data: any) => void): void {
        if (this.socket) {
            this.socket.on(event, callback);
        } else {
            console.error('Socket is not initialized.');
        }
    }

    getSocket(): Socket {
      if (!this.socket) {
        throw new Error('Socket not initialized');
      }
      return this.socket;
    }

    // Disconnect from the socket
    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log('Disconnected from the socket server.');
        }
    }
}

export const socketService = new SocketService();
