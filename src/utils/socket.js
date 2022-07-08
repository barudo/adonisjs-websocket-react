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

  subscribe(channel, callbacks) {
    if (!this.ws) {
      console.log('You need to connect first before you subscribe.')
    } else {
      const result = this.ws.withJwtToken(this.token).subscribe(channel)
      //not used for now...
      result.on('question', (question) => {
        if (callbacks.handleQuestion) {
          callbacks.handleQuestion(question)
        }
      })
      //not used for now...
      result.on('taskCreated', (message) => {
        if (callbacks.handleTaskCreated) {
          callbacks.handleTaskCreated(message)
        }
      })

      result.on('message', (message) => {
        if (callbacks.handleMessage) {
          callbacks.handleMessage(message)
        }
      })

      result.on('error', (error) => {
        if (callbacks.handleError) {
          callbacks.handleError(error)
        } else {
          console.log(error)
        }
      })

      result.on('previousMessages', (message) => {
        if (callbacks.handlePreviousMessages) {
          callbacks.handlePreviousMessages(message)
        }
      })

      result.on('messageEdited', ({ id, message, attachments }) => {
        if (callbacks.handleMessageEdited) {
          callbacks.handleMessageEdited({ id, message, attachments })
        }
      })

      result.on('messageRemoved', (message) => {
        if (callbacks.handleMessageRemoved) {
          callbacks.handleMessageRemoved(message)
        }
      })
      return result
    }
  }
}

export default new SocketConnection()
