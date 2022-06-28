import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, InputGroup, FormControl, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const ChatBox = ({ activeTopic }) => {
  const { messages } = useSelector((store) => store?.messages)
  const { subscriptions } = useSelector((store) => store?.socket)
  const [topicMessages, setTopicMessages] = useState([])
  const [subscription, setSubscription] = useState({})

  useEffect(() => {
    setTopicMessages(messages[activeTopic])
    setSubscription(subscriptions[activeTopic])
  }, [activeTopic, messages, setTopicMessages, setSubscription, subscriptions])

  const sendMessage = (message) => {
    console.log(subscription)
    subscription.emit('message', { message, user: 'Justin' })
    /*
    if (currentQuestion) {
      //we answer if there is a current question...
      console.log({ currentQuestion })
      
      setCurrentQuestion(false)
      setCurrentMessage('')
    } else {
      subscription.emit('message', { message, user })
      setCurrentMessage('')
    }*/
  }
  /*
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && currentMessage) {
      sendMessage(currentMessage)
    }
  }*/

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <Card>
            <Card.Header>Topic: {activeTopic}</Card.Header>
            <Card.Body style={{ height: '400px' }} className="d-flex align-items-end">
              {topicMessages.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </Card.Body>
            <Card.Footer>
              <InputGroup className="mb-3">
                <FormControl placeholder="Message" aria-label="message" />
                <Button variant="success" onClick={sendMessage}>
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
