import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['polling', 'websocket'],
  upgrade: false
});

export default socket; 