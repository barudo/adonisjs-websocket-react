import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setServer } from '../redux/reducers/serverSlice'
import { Form } from 'react-bootstrap'

const Server = () => {
  const dispatch = useDispatch()
  const [selectedServer, setSelectedServer] = useState('http://localhost:3000')

  useEffect(() => {
    dispatch(setServer(selectedServer))
  }, [setSelectedServer, selectedServer, dispatch])

  return (
    <>
      <Form.Control
        type="text"
        value={selectedServer}
        onChange={(e) => setSelectedServer(e.target.value)}
      />
    </>
  )
}

export default Server
