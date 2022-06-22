import {useEffect, useState} from 'react'
import Messages from './Messages';
//import socket from '../utils/socket';
import {isArray, trimEnd} from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { appendMessage } from '../redux/reducers/messageSlice'
import { setSubscription } from '../redux/reducers/socketSlice';

const ChatBox = () => {
  const {messages} = useSelector((store) => store?.messages || [])
  const {user} = useSelector((store) => store?.user)
  const [currentMessage, setCurrentMessage] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const dispatch = useDispatch()
  const {socket, subscription} = useSelector((store) => store?.socket)
  
  const handleQuestion = (question) => {
    console.log({question})
    let choices
    if(isArray(question)) {
      question.forEach(q => {
        dispatch(appendMessage(`bot: ${q.question}`))
        if(question.type === 'not-a-question' || question.type === 'final') {
          setCurrentQuestion(false)
        } else {
          setCurrentQuestion(q)
        }
        if(q.choices && q.choices.length > 0) {
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
      if(question.type === 'not-a-question' || question.type === 'final') {
        setCurrentQuestion(false)  
      } else {
        setCurrentQuestion(question)
      }
      if(question.choices && question.choices.length > 0) {
        choices = question.choices.reduce((choices, current) => {
          choices += `${current.choice},`
          return choices
        }, '')
        choices = trimEnd(choices, ',')
        dispatch(appendMessage(`choices: ${choices}`))
      }
    }
  }
  
  const handleMessage = (message) => {
    if(user === message.user) {
      dispatch(appendMessage(`me: ${message.message}`))
    } else {
      dispatch(appendMessage(`${message.user}: ${message.message}`))
    }
  }
  /*
  useEffect(() => {
    
    console.log({subscription})
    if(!subscription) {
      
    }
    return (() => {
      setSubscription(null)
    })
  }, [socket, subscription, currentQuestion, dispatch, user])
  */

  const createTaskClick = () => {
    console.log({subscription})
    subscription.emit('createTask')
  }

  const sendMessage = (message) => {
    if(currentQuestion) {
      //we answer if there is a current question...
      console.log({currentQuestion})
      subscription.emit('answer', {question_id: currentQuestion.id, answer: message, user})
      setCurrentQuestion(false)
      setCurrentMessage('')
    } else {
      subscription.emit('message', {message, user})
      setCurrentMessage('')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && currentMessage) {
      sendMessage(currentMessage)
    }
  }
  const [jwtToken, setJwtToken] = useState('')
  const handleSubscription = () => {
    dispatch(setSubscription(socket.subscribe('chat:abscbd', handleMessage, handleQuestion)))
  }

  return (
    <>
      <div style={{marginBot: '30px'}}>
        <input type="text" onChange={(e) => setJwtToken(e.target.value)} value={jwtToken} placeholder="jwt token"/>
      </div>
      <div>
        <button onClick={() => handleSubscription()} >Subscribe</button>
      </div>
      <Messages messages={messages}/>
      <button onClick={() => createTaskClick()}>Create Task</button><br />
      <input type="text" value={currentMessage} onChange={(event) => setCurrentMessage(event.target.value)} onKeyDown={handleKeyDown}/>  <br />
      <button onClick={() => sendMessage(currentMessage)}>Send Message</button>
    </>
  )
}

export default ChatBox