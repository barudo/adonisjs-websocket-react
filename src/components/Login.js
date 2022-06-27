import React from 'react'

const Login = () => {
  return (
    <div style={{marginBot: '30px'}}>
        <input type="text" onChange={(e) => setJwtToken(e.target.value)} value={jwtToken} placeholder="jwt token"/>
        <button onClick={() => handleConnect()}>Connect</button>
      </div>
  )
}

export default Login