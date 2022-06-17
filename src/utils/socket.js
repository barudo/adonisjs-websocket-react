import Ws from '@adonisjs/websocket-client';
export class SocketConnection {
  connect () {
    this.ws = Ws('ws://localhost:3000/')
      .connect();

    this.ws.on('open', () => {
      console.log('Connection initialized')
    });

    this.ws.on('close', () => {
      console.log('Connection closed')
    });
    return this
  }

  subscribe (channel, messageHandler, questionHandler) {
    if (!this.ws) {
      setTimeout(() => this.subscribe(channel), 1000)
    } else {
      const result = this.ws.subscribe(channel);

      console.log(this.ws)

      result.on('message', message => {
        console.log('Incoming', message);
        messageHandler(message)
      });

      result.on('question', question => {
        questionHandler(question)
      })

      result.on('error', (error) => {
        console.error(error)
      });

      return result
    }
  }
}

export default new SocketConnection()