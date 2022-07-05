import Ws from '@adonisjs/websocket-client'
export class SocketConnection {
  connect(token) {
    this.token = token
    this.ws = Ws('ws://localhost:3000/').withJwtToken(token).connect()

    this.ws.on('open', () => {
      console.log('Connection initialized')
    })

    this.ws.on('close', () => {
      console.log('Connection closed')
    })
    return this
  }
  //this should be an object...
  subscribe(
    channel,
    messageHandler,
    questionHandler,
    errorCallback,
    taskCreatedHandler = () => {}
  ) {
    if (!this.ws) {
      console.log('You need to connect first before you subscribe.')
    } else {
      const result = this.ws.withJwtToken(this.token).subscribe(channel)

      result.on('message', (message) => {
        messageHandler(message)
      })

      result.on('question', (question) => {
        questionHandler(question)
      })

      result.on('error', (error) => {
        errorCallback(error)
      })

      result.on('taskCreated', (message) => {
        taskCreatedHandler(message)
      })

      return result
    }
  }
}

export default new SocketConnection()
