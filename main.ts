import { Mediator } from "./src/mediator";

const gameServerURL = process.env.GAME_SERVER_URL || "http://localhost:3001";
const wsPort = Number(process.env.PORT || 8080);
console.log("CONNECTION DETAILS: ", gameServerURL, wsPort)
const mediator = new Mediator(`${gameServerURL}/config`, wsPort);
