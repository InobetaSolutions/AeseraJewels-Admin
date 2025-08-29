import React from 'react';
import { io } from 'socket.io-client'
export const CountContext = React.createContext();

export const API_URL ="http://13.204.96.244:3000/api/";

export const IMAGE_URL ="http://13.204.96.244:3000/api/uploads/"

// export  const socket = io("http://13.235.177.197:5001")


// export const Catogery_img = "https://picsum.photos/200/300"