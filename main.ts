import { Mediator } from "./src/mediator";

const GAME_SERVER_URL = process.env.GAME_SERVER_URL || "http://localhost:3001";
const WSPort = Number(process.env.PORT || 8080);

const mediator = new Mediator(`${GAME_SERVER_URL}/config`, WSPort);
