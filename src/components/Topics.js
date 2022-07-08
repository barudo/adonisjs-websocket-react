import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  appendMessage,
  emptyCurrentQuestion,
  emptyTopicMessages,
  prependMessage,
  removeMessage,
  setCurrentQuestion,
  updateMessage,
} from '../redux/reducers/messageSlice'
import { addTopic, removeTopic, setActiveTopic } from '../redux/reducers/socketSlice'

import { isArray, trimEnd } from 'lodash'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { setError } from '../redux/reducers/errorSlice'
import socket from '../utils/socket'

const Topics = () => {
  const { topics, activeTopic } = useSelector((store) => store?.socket)
  //const { user } = useSelector((store) => store?.user)
  const [upcomingTopic, setUpcomingTopic] = useState('')
  const dispatch = useDispatch()
  const [taskTopic, setTaskTopic] = useState(null)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && upcomingTopic) {
      handleAddTopic()
    }
  }

  const handleMessageEdited = ({ id, message, attachments }) => {
    console.log({ id, message, attachments })
    dispatch(updateMessage({ topic: upcomingTopic, message, attachments, id }))
  }

  const handleMessageRemoved = ({ id }) => {
    dispatch(removeMessage({ topic: upcomingTopic, id }))
  }

  const handleAddTopic = () => {
    if (!upcomingTopic) {
      dispatch(setError('Topic must NOT be empty.'))
      return
    }
    dispatch(setError(''))
    //the socket.subscribe here is just for illustration purpose, ie on how to subscribe to topic.
    //this should be done after knowing which "topics" the app should connect to.
    if (upcomingTopic.match(/^estate:[0-9]+$/)) {
      socket.subscribe(upcomingTopic, {
        handleMessage,
        handleQuestion,
        handleError: (error) => {
          dispatch(setError(error))
        },
        handleTaskCreated,
        handleMessageEdited,
        handleMessageRemoved,
      })
    } else {
      //this is a task
      socket.subscribe(upcomingTopic, {
        handleMessage,
        handleQuestion,
        handleError: (error) => {
          if (
            error.message.match(/^110[0-9]+:/) ||
            error.message === 'Topic cannot be handled by any channel'
          ) {
            dispatch(removeTopic(error.topic))
            dispatch(setActiveTopic(null))
          }
          dispatch(setError(error.message))
        },
        handlePreviousMessages,
        handleMessageEdited,
        handleMessageRemoved,
      })
      //getPreviousMessages should be done after subscribing. So we'll have the messages
      //saved at the redux store
      socket.ws.getSubscription(upcomingTopic).emit('getPreviousMessages')
    }
    dispatch(addTopic(upcomingTopic))
    dispatch(emptyTopicMessages({ topic: upcomingTopic }))
    dispatch(emptyCurrentQuestion({ topic: upcomingTopic }))
    //markLastRead should only be called when OPENING and CLOSING the chatbox for this topic
    //we're opening the chatbox with setActiveTopic.. so hence the call
    socket.ws.getSubscription(upcomingTopic).emit('markLastRead')
    dispatch(setActiveTopic(upcomingTopic))
    setUpcomingTopic('')
  }

  const handlePreviousMessages = ({ messages, topic }) => {
    messages.map((message, index) => {
      return dispatch(
        prependMessage({
          topic,
          message,
        })
      )
    })
  }

  const handleQuestion = (question) => {
    const { message, sender } = question
    let choices
    if (isArray(message)) {
      message.forEach((q) => {
        console.log({ q, sender })
        dispatch(
          appendMessage({
            topic: upcomingTopic,
            message: `${sender.firstname} ${sender.secondname}: ${q.question}`,
          })
        )
        if (q.type === 'not-a-question' || q.type === 'final') {
          dispatch(setCurrentQuestion({ topic_id: upcomingTopic, question: null }))
        } else {
          dispatch(setCurrentQuestion({ topic_id: upcomingTopic, question: q }))
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
        dispatch(setCurrentQuestion({ topic_id: upcomingTopic, question: null }))
      } else {
        dispatch(setCurrentQuestion({ topic_id: upcomingTopic, question: question }))
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

  const handleMessage = ({ message }) => {
    dispatch(appendMessage({ topic: upcomingTopic, message }))
  }

  const handleTaskCreated = ({ message, sender }) => {
    const { task_id } = message
    const matches = upcomingTopic.match(/^estate:([0-9]+)$/)
    const estate_id = matches[1]
    setTaskTopic(`task:${estate_id}brz${task_id}`)
    socket.subscribe(
      `task:${estate_id}brz${task_id}`,
      handleMessage,
      handleTaskQuestion,
      (error) => {
        dispatch(setError(error))
      }
    )
    dispatch(addTopic(`task:${estate_id}brz${task_id}`))
    dispatch(emptyTopicMessages({ topic: `task:${estate_id}brz${task_id}` }))
    dispatch(emptyCurrentQuestion({ topic: `task:${estate_id}brz${task_id}` }))
    dispatch(setActiveTopic(`task:${estate_id}brz${task_id}`))
    const subscription = socket.ws.getSubscription(`task:${estate_id}brz${task_id}`)
    subscription.emit('taskInit')
  }

  const handleTaskQuestion = (question) => {
    const { message, sender } = question
    let choices
    if (isArray(message)) {
      message.forEach((q) => {
        console.log({ q, sender })
        dispatch(
          appendMessage({
            topic: taskTopic,
            message: `${sender.firstname} ${sender.secondname}: ${q.question}`,
          })
        )
        if (q.type === 'not-a-question' || q.type === 'final') {
          dispatch(setCurrentQuestion({ topic_id: taskTopic, question: null }))
        } else {
          dispatch(setCurrentQuestion({ topic_id: taskTopic, question: q }))
        }
        if (q.choices && q.choices.length > 0) {
          choices = q.choices.reduce((choices, current) => {
            choices += `${current.choice},`
            return choices
          }, '')
          choices = trimEnd(choices, ',')
          dispatch(appendMessage({ topic: taskTopic, message: `choices: ${choices}` }))
        }
      })
    } else {
      dispatch(appendMessage({ topic: taskTopic, message: `bot: ${question.question}` }))
      if (question.type === 'not-a-question' || question.type === 'final') {
        dispatch(setCurrentQuestion({ topic_id: taskTopic, question: null }))
      } else {
        dispatch(setCurrentQuestion({ topic_id: taskTopic, question: question }))
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
  const topicClickHandler = (topic) => {
    //we mark the last item that reached the chatbox as the last read
    socket.ws.getSubscription(activeTopic).emit('markLastRead')
    dispatch(setActiveTopic(topic))
  }
  return (
    <Container className="mt-3">
      <Row>
        <Col md={12}>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group>
              <Form.Label>Topic (ie task:123brz321)</Form.Label>
              <Form.Control
                type="text"
                value={upcomingTopic}
                onChange={(e) => setUpcomingTopic(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
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
                    onClick={() => topicClickHandler(topic)}
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
