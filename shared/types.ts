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
