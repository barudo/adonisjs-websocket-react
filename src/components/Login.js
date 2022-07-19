import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import socket from '../utils/socket'
import { setToken, setUser } from '../redux/reducers/userSlice'
import { setError } from '../redux/reducers/errorSlice'
import { Form, Container, Col, Row, Button } from 'react-bootstrap'
import Server from './Server'

const Login = () => {
  const [jwtToken, setJwtToken] = useState('')
  const { server } = useSelector((store) => store?.server)
  const dispatch = useDispatch()

  const handleConnect = async (e) => {
    e.preventDefault()
    if (!jwtToken) {
      dispatch(setError('Empty JWT Token...'))
    } else {
      try {
        let me = await fetch(`${server}/api/v1/me`, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + jwtToken,
          },
        })
        me = await me.json()
        dispatch(setUser(me.data))
        dispatch(setError(''))
        socket.connect(jwtToken, server)
        dispatch(setToken(jwtToken))
      } catch (err) {
        dispatch(setError(`error found ${err}`))
      }
    }
  }
  return (
    <Container style={{ marginTop: '30px' }}>
      <Row>
        <Col>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Server</Form.Label>
              <Server />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>JWT Token</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setJwtToken(e.target.value)}
                value={jwtToken}
                placeholder="jwt token"
              />
            </Form.Group>
            <Button className="mt-3" variant="success" onClick={(e) => handleConnect(e)}>
              Connect
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
