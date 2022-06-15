import {useEffect, useState} from 'react'
import Messages from './Messages';
import socket from '../utils/socket';
import {isArray} from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { appendMessage } from '../redux/reducers/messageSlice'

let subscription

const ChatBox = () => {
  const {messages} = useSelector((store) => store?.messages || [])
  const [currentMessage, setCurrentMessage] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleQuestion = (question) => {
      let choices
      if(isArray(question)) {
        question.forEach(q => {
          dispatch(appendMessage(`bot: ${q.question}`))
          setCurrentQuestion(q)
          if(q.choices && q.choices.length > 0) {
            choices = q.choices.reduce((choices, current) => {
              choices = choices + "," + current.choice
              return choices
            }, '')
            dispatch(appendMessage(`choices: ${choices}`))
          }
        })
      } else {
        dispatch(appendMessage(`bot: ${question.question}`))
        setCurrentQuestion(question)
        if(question.choices && question.choices.length > 0) {
          choices = question.choices.reduce((choices, current) => {
            choices = choices + "," + current.choice
            return choices
          }, '')
          dispatch(appendMessage(`choices: ${choices}`))
        }
        setCurrentQuestion(question)
      }
    }
    const handleMessage = (message) => {
      if(currentQuestion) { 
        
      }
    }
    socket.connect()
    subscription = socket.subscribe('chat:abscbd', handleMessage, handleQuestion);
    return (() => {
      subscription.close();
    })
  }, [currentQuestion, dispatch])


  const createTaskClick = () => {
    subscription.emit('createTask')
  }

  const sendMessage = (message) => {
    if(currentQuestion) {
      console.log('sending answer', currentQuestion)
      subscription.emit('answer', {question_id: currentQuestion.id, answer: message})
      dispatch(appendMessage(`user: ${message}`))
      setCurrentQuestion(null)
      setCurrentMessage('')
    } else {
      subscription.emit('message', message)
      message = `user: ${message}`
      dispatch(appendMessage(message))
    }
  }

  return (
    <>
      <Messages messages={messages}/>
      <button onClick={() => createTaskClick()}>Create Task</button><br />
      <input type="text" value={currentMessage} onChange={(event) => setCurrentMessage(event.target.value)}/>  <br />
      <button onClick={() => sendMessage(currentMessage)}>Send Message</button>
    </>
  )
}

export default ChatBox