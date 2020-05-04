const tmi = MODULES.tmi;

class ChannelListener {
  constructor(channelName, onMessage) {
    this._onMessage = onMessage;
    this.setChannel(channelName);
  }

  setChannel(channelName) {
    this._client && this._client.disconnect();

    this._client = new tmi.Client({
      connection: {
        secure: true,
        reconnect: true,
      },
      channels: [channelName],
    });

    this._client.connect();

    this._client.on("message", (channel, tags, message, self) => {
      this._onMessage(message);
    });
  }
}
