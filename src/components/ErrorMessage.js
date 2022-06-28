import { Container, Row, Col, Alert } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { setError } from '../redux/reducers/errorSlice'

const ErrorMessage = ({ error }) => {
  const dispatch = useDispatch()
  return (
    <Container className="mt-3">
      <Row>
        <Col md={12}>
          <Alert
            variant="danger"
            dismissible
            onClose={() => {
              dispatch(setError(''))
            }}
          >
            {error}
          </Alert>
        </Col>
      </Row>
    </Container>
  )
}

export default ErrorMessage
