import { io } from "socket.io-client";

const socket = io("https://codecamp-iffd.onrender.com");

export default socket;