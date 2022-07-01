import { useDispatch } from 'react-redux'
import { useState } from 'react'
import socket from '../utils/socket'
import { setToken, setUser } from '../redux/reducers/userSlice'
import { setError } from '../redux/reducers/errorSlice'
import { Form, Container, Col, Row, Button } from 'react-bootstrap'

const Login = () => {
  const [jwtToken, setJwtToken] = useState('')
  const dispatch = useDispatch()
  const handleConnect = async (e) => {
    e.preventDefault()
    if (!jwtToken) {
      dispatch(setError('Empty JWT Token...'))
    } else {
      let me = await fetch('http://localhost:3000/api/v1/me', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + jwtToken,
        },
      })
      me = await me.json()
      dispatch(setUser(me.data))
      dispatch(setError(''))
      socket.connect(jwtToken)
      dispatch(setToken(jwtToken))
    }
  }
  return (
    <Container>
      <Row>
        <Col>
          <Form>
            <Form.Group>
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
