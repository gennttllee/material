import { MESSAGING_REST, MESSAGING_SOCKETS } from 'apis/postForm';
import { io } from 'socket.io-client';

// let socket = io(MESSAGING_SOCKETS, {
//     reconnectionAttempts: 500,
//     reconnectionDelay: 3000,
//     reconnection: true,
//     retries: 100
//   });
const useSockets = () => {};

export { useSockets };
