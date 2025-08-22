import React from 'react';
import { io } from 'socket.io-client'
export const CountContext = React.createContext();

export const API_URL ="http://45.198.13.152:7002/"

export  const socket = io("http://13.235.177.197:5001")


export const Catogery_img = "https://picsum.photos/200/300"