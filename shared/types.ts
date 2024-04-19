export interface WSMessage {
  messageType: "scoreUpdate";
  data: WSMessageData; // TODO: should make a different WSMessageData for each messageType.
}

export interface WSMessageData {
  score: number;
}

export interface GameConfiguration {
  pollingFrequency: number;
  scoreRange: { min: number; max: number };
  allowedClients: string[];
}

export const DEFAULT_GAME_CONFIG: GameConfiguration = {
  pollingFrequency: 1000,
  scoreRange: { min: 0, max: 100 },
  allowedClients: ["client1", "client2"],
};
