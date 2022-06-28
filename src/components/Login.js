import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { setSocket } from '../redux/reducers/socketSlice'
import SocketConnection from '../utils/socket'
import { setToken } from '../redux/reducers/userSlice'
import { setError } from '../redux/reducers/errorSlice'
import { Form, Container, Col, Row, Button } from 'react-bootstrap'

const Login = () => {
  const [jwtToken, setJwtToken] = useState('')
  const dispatch = useDispatch()
  const handleConnect = (e) => {
    e.preventDefault()
    if (!jwtToken) {
      dispatch(setError('Empty JWT Token...'))
    } else {
      dispatch(setError(''))
      dispatch(setSocket(SocketConnection.connect(jwtToken)))
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
