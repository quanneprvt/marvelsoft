import { IMessageEvent, w3cwebsocket } from "websocket";

type MessageHandler = (message: IMessageEvent) => void;

class WebSocketClient {
  client: w3cwebsocket;
  onMessageHander: { [key: string]: MessageHandler };
  constructor() {
    this.client = {} as w3cwebsocket;
    this.onMessageHander = {};
  }

  connect(port: number) {
    this.client = new w3cwebsocket(`ws://localhost:${port}/`);

    this.client.onmessage = (message) => {
      console.log(message);
      Object.values(this.onMessageHander).forEach((func) => func(message));
    };

    this.client.onopen = () => {
      console.log("websocket connected");
      this.client.send(JSON.stringify({ closed: false }));
    };
  }

  addOnMessageHandler(keyName: string, func: MessageHandler) {
    this.onMessageHander[keyName] = func;
  }

  sendData(message: string) {
    this.client.send(message);
  }

  close() {
    this.client.send(JSON.stringify({ closed: true }));
    this.client.close();
  }
}

export default new WebSocketClient();
