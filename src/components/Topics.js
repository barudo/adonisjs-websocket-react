import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addSubscription, setActiveTopic } from '../redux/reducers/socketSlice'
import {
  appendMessage,
  setCurrentQuestion,
  emptyTopicMessages,
} from '../redux/reducers/messageSlice'

import { setError } from '../redux/reducers/errorSlice'
import { isArray, trimEnd } from 'lodash'
import { Container, Col, Row, Form, Button } from 'react-bootstrap'

const Topics = () => {
  const { socket, topics } = useSelector((store) => store?.socket)
  const { user } = useSelector((store) => store?.user)
  const [upcomingTopic, setUpcomingTopic] = useState('')
  const dispatch = useDispatch()

  const handleAddTopic = () => {
    if (!upcomingTopic) {
      dispatch(setError('Topic must NOT be empty.'))
      return
    }
    dispatch(setError(''))
    dispatch(
      addSubscription({
        topic: upcomingTopic,
        subscription: socket.subscribe(upcomingTopic, handleMessage, handleQuestion),
      })
    )
    dispatch(emptyTopicMessages({ topic: upcomingTopic }))
    dispatch(setActiveTopic(upcomingTopic))
    setUpcomingTopic('')
  }

  const handleQuestion = (question) => {
    console.log({ question })
    let choices
    if (isArray(question)) {
      question.forEach((q) => {
        dispatch(appendMessage({ topic: upcomingTopic, message: `bot: ${q.question}` }))
        if (question.type === 'not-a-question' || question.type === 'final') {
          dispatch(setCurrentQuestion(false))
        } else {
          dispatch(setCurrentQuestion(q))
        }
        if (q.choices && q.choices.length > 0) {
          choices = q.choices.reduce((choices, current) => {
            choices += `${current.choice},`
            return choices
          }, '')
          choices = trimEnd(choices, ',')
          dispatch(appendMessage({ topic: upcomingTopic, message: `choices: ${choices}` }))
        }
      })
    } else {
      dispatch(appendMessage({ topic: upcomingTopic, message: `bot: ${question.question}` }))
      if (question.type === 'not-a-question' || question.type === 'final') {
        dispatch(setCurrentQuestion(false))
      } else {
        dispatch(setCurrentQuestion(question))
      }
      if (question.choices && question.choices.length > 0) {
        choices = question.choices.reduce((choices, current) => {
          choices += `${current.choice},`
          return choices
        }, '')
        choices = trimEnd(choices, ',')
        dispatch(dispatch(appendMessage(`choices: ${choices}`)))
      }
    }
  }

  const handleMessage = (message) => {
    if (user === message.user) {
      dispatch(appendMessage(`me: ${message.message}`))
    } else {
      dispatch(appendMessage(`${message.user}: ${message.message}`))
    }
  }

  return (
    <Container className="mt-3">
      <Row>
        <Col md={12}>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group>
              <Form.Label>Topic (ie chat:abscbd)</Form.Label>
              <Form.Control
                type="text"
                value={upcomingTopic}
                onChange={(e) => setUpcomingTopic(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" className="mt-3" onClick={() => handleAddTopic()}>
              Add Topic
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={12}>
          {topics.length > 0
            ? topics.map((topic) => {
                return (
                  <Button
                    key={topic}
                    onClick={() => dispatch(setActiveTopic(topic))}
                    variant="warning"
                    size="sm"
                    className="me-2"
                  >
                    {topic}
                  </Button>
                )
              })
            : 'Add Topic to start chat.'}
        </Col>
      </Row>
    </Container>
  )
}

export default Topics
