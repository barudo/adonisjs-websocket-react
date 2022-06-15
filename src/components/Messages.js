import React from 'react'

const Messages = ({messages}) => {
  return (
    <>
    {messages.map((message, index) => <p key={index}>{message}</p>)}
    </>
  )
}

export default Messages