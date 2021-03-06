import { useState } from 'react'
import Messages from './Messages'
import SocketConnection from '../utils/socket'
import { isArray, trimEnd } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { appendMessage } from '../redux/reducers/messageSlice'
import { setSocket, setSubscription } from '../redux/reducers/socketSlice'

const ChatBoxes = () => {
  const { messages } = useSelector((store) => store?.messages || [])
  const { user } = useSelector((store) => store?.user)
  const [currentMessage, setCurrentMessage] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const dispatch = useDispatch()
  const { socket, subscription } = useSelector((store) => store?.socket)

  //receive question from server...
  const handleQuestion = (question) => {
    console.log({ question })
    let choices
    if (isArray(question)) {
      question.forEach((q) => {
        dispatch(appendMessage(`bot: ${q.question}`))
        if (question.type === 'not-a-question' || question.type === 'final') {
          setCurrentQuestion(false)
        } else {
          setCurrentQuestion(q)
        }
        if (q.choices && q.choices.length > 0) {
          choices = q.choices.reduce((choices, current) => {
            choices += `${current.choice},`
            return choices
          }, '')
          choices = trimEnd(choices, ',')
          dispatch(appendMessage(`choices: ${choices}`))
        }
      })
    } else {
      dispatch(appendMessage(`bot: ${question.question}`))
      if (question.type === 'not-a-question' || question.type === 'final') {
        setCurrentQuestion(false)
      } else {
        setCurrentQuestion(question)
      }
      if (question.choices && question.choices.length > 0) {
        choices = question.choices.reduce((choices, current) => {
          choices += `${current.choice},`
          return choices
        }, '')
        choices = trimEnd(choices, ',')
        dispatch(appendMessage(`choices: ${choices}`))
      }
    }
  }
  // receive message from server
  const handleMessage = (message) => {
    if (user === message.user) {
      dispatch(appendMessage(`me: ${message.message}`))
    } else {
      dispatch(appendMessage(`${message.user}: ${message.message}`))
    }
  }
  // send to server
  const createTaskClick = () => {
    subscription.emit('createTask')
  }
  //send to server
  const sendMessage = (message) => {
    if (currentQuestion) {
      //we answer if there is a current question...
      console.log({ currentQuestion })
      subscription.emit('answer', { question_id: currentQuestion.id, answer: message, user })
      setCurrentQuestion(false)
      setCurrentMessage('')
    } else {
      subscription.emit('message', { message, user })
      setCurrentMessage('')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && currentMessage) {
      sendMessage(currentMessage)
    }
  }
  const [jwtToken, setJwtToken] = useState('')

  const handleConnect = () => {
    dispatch(setSocket(SocketConnection.connect(jwtToken)))
  }

  const handleSubscription = () => {
    dispatch(setSubscription(socket.subscribe(topic, handleMessage, handleQuestion)))
  }

  const [topic, setTopic] = useState('chat:abscbd')

  return (
    <>
      <div>
        <input
          type="text"
          onChange={(e) => setTopic(e.target.value)}
          value={topic}
          placeholder="chat:xx-abcd"
        />
        <button onClick={() => handleSubscription()}>Connect to Topic</button>
      </div>
      <Messages messages={messages} />
      <button onClick={() => createTaskClick()}>Create Task</button>
      <br />
      <input
        type="text"
        value={currentMessage}
        onChange={(event) => setCurrentMessage(event.target.value)}
        onKeyDown={handleKeyDown}
      />{' '}
      <br />
      <button onClick={() => sendMessage(currentMessage)}>Send Message</button>
    </>
  )
}

export default ChatBoxes
