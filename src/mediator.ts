import WebSocket from "ws";
import { DEFAULT_GAME_CONFIG, GameConfiguration, WSMessage } from "../shared/types";
import url from "url";
export class Mediator {
  private port: number;

  private wsServer: WebSocket.Server;
  private connectedClients: Map<string, WebSocket>;

  private configUrl: string;
  private config: GameConfiguration;

  private pollingIntervalId: NodeJS.Timeout | null;

  constructor(configUrl: string, port: number) {
    this.port = port;

    this.wsServer = new WebSocket.Server({ port }, () => {
      console.log(`WebSocket server is running on port: ${port}"`);
    });

    this.connectedClients = new Map<string, WebSocket>();

    this.configUrl = configUrl;
    this.config = DEFAULT_GAME_CONFIG;

    this.pollingIntervalId = null;

    // fetch config and only then start polling.
    this.loadConfig()
      .catch((err) => {})
      .then(() => this.enableWebSocketConnections)
      .then(() => this.startPolling);
  }

  async loadConfig() {
    try {
      const response = await fetch(this.configUrl);
      const config = await response.json();
      this.config = config;
    } catch (err) {
      throw(err);
    }
  }

  enableWebSocketConnections() {
    // set a listener for new client connections to the server.
    this.wsServer.on("connection", (ws, req) => {
      // get the clientId from the request.
      const query = url.parse(req.url as string, true).query;
      const clientId = query["clientId"] as string;

      console.log(`Client Connected (${clientId}).`);

      // Close the connection with status code 1008 (policy violation) if client is not on the list.
      if (!this.config.allowedClients.includes(clientId.toLowerCase())) {
        ws.close(403, "Error - Client is not registered.");
        return;
      }

      // add client to connected clients.
      this.connectedClients.set(clientId, ws);

      // set a listener for this new client disconnect.
      ws.on("close", (code, reason) => {
        console.log(`Client Disconnected (${clientId}).`, code, reason);
        // remove client from connected clients.
        this.connectedClients.delete(clientId);
      });
    });
  }

  startPolling() {
    // set an interval for polling the score.
    this.pollingIntervalId = setInterval(() => {
      try {
        // fake polling - generate a random score based on the configuration file.
        const wsMessage: WSMessage = {
          messageType: "scoreUpdate",
          data: {
            score: Math.floor(Math.random() * (this.config.scoreRange.max - this.config.scoreRange.min + 1) + this.config.scoreRange.min),
          },
        };

        // broadcast the score to all clients.
        this.broadcast(wsMessage);
      } catch (err) {
        throw(err)
      }
    }, this.config.pollingFrequency);
  }

  stopPolling() {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
    }
  }

  broadcast(message: WSMessage) {
    this.connectedClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}
