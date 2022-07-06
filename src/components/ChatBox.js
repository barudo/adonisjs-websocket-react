import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, InputGroup, FormControl, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentQuestion } from '../redux/reducers/messageSlice'
import socket from '../utils/socket'

const ChatBox = ({ activeTopic }) => {
  const { messages, currentQuestion } = useSelector((store) => store?.messages)
  const { user } = useSelector((store) => store?.user)
  const [topicMessages, setTopicMessages] = useState([])
  const [topicQuestion, setTopicQuestion] = useState(null)
  const [currentMessage, setCurrentMessage] = useState('')
  const dispatch = useDispatch()
  const [topicCanCreateTask, setTopicCanCreateTask] = useState(false)

  useEffect(() => {
    setTopicMessages(messages[activeTopic])
    setTopicQuestion(currentQuestion[activeTopic])
    setTopicCanCreateTask(activeTopic.match(/^estate:[0-9]+$/))
  }, [activeTopic, messages, setTopicMessages, currentQuestion, setTopicQuestion])

  const sendMessage = () => {
    const subscription = socket.ws.getSubscription(activeTopic)
    if (topicQuestion) {
      //we answer if there is a current question...
      subscription.emit('answer', {
        message: currentMessage,
        question: topicQuestion,
      })
      dispatch(setCurrentQuestion({ topic: activeTopic, question: null }))
      setCurrentMessage('')
    } else {
      console.log({ currentMessage })
      subscription.emit('message', { message: currentMessage })
      setCurrentMessage('')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && currentMessage) {
      sendMessage(currentMessage)
    }
  }
  //not used...
  const createTaskHandler = () => {
    socket.ws.getSubscription(activeTopic).emit('createTask')
  }

  //simulates scrolls... hook getPreviousMessages
  const handleScroll = (event) => {
    if (event.currentTarget.scrollTop === 0) {
      socket.ws
        .getSubscription(activeTopic)
        .emit('getPreviousMessages', { lastId: topicMessages[0].id })
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <Card>
            <Card.Header>Topic: {activeTopic}</Card.Header>
            <Card.Body
              style={{ height: '400px', width: '100%', overflow: 'scroll' }}
              onScroll={handleScroll}
              className=""
            >
              {topicMessages.map((message, index) => (
                <p key={index}>
                  {user.id === message.sender.id
                    ? `me: `
                    : `${message.sender.firstname} ${message.sender.secondname}: `}
                  {message.message}
                </p>
              ))}
            </Card.Body>
            <Card.Footer>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Message"
                  aria-label="message"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {topicCanCreateTask && (
                  <Button variant="warning" onClick={() => createTaskHandler()}>
                    Create Task
                  </Button>
                )}
                <Button variant="success" onClick={() => sendMessage()}>
                  Send
                </Button>
              </InputGroup>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ChatBox
