import { useSelector } from 'react-redux'
import Login from './Login'
import Topics from './Topics'
import ErrorMessage from './ErrorMessage'
import ChatBox from './ChatBox'

const Main = () => {
  const { jwtToken } = useSelector((store) => store?.user)
  const { error } = useSelector((store) => store?.error)
  const { activeTopic } = useSelector((store) => store.socket)

  return (
    <>
      {error && <ErrorMessage error={error} />}
      {!jwtToken ? (
        <Login />
      ) : (
        <>
          <Topics />
        </>
      )}
      {activeTopic && <ChatBox activeTopic={activeTopic} />}
    </>
  )
}

export default Main
