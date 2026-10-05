import React from 'react'
import "../auth.form.scss"
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
// import Loading from './Loading'

const Login = () => {

  const navigate = useNavigate()

  const { loading , handleLogin } = useAuth()

  const [email, setemail] = useState("")

  const [password, setpassword] = useState("")
  const [error, setError] = useState("")
  
    const handleSubmit =async (e) =>{
      e.preventDefault()
      setError("")
      try {
        const user = await handleLogin({email, password})

        if (user) {
          navigate('/')
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to log in. Please try again.")
      }
    }

    if(loading){
      return <main>
        <h1>loading.....</h1>
      </main>
    }
  return (
      <main>
        <div className='form-container'>
              <h1>Login</h1>

              <form onSubmit={handleSubmit}>

                {error && <p role="alert">{error}</p>}

                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    onChange={(e) =>{setemail(e.target.value)}}
                    type="email" id='email' name='email' placeholder='Enter email address' required />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                    onChange={(e) =>{setpassword(e.target.value)}}
                    type="password" id='password' name='password' placeholder='Enter password' required />
                </div>

                <button className='button primary-button'>Login</button>
                
              </form>

              <p>Create an account <Link to={"/register"}> Register </Link></p>

        </div>
      </main>
  )
}

export default Login
