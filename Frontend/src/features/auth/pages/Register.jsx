import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
// import Loading from './Loading'

const Register = () => {

const navigate = useNavigate()

const [username, setusername] = useState('')
const [email, setemail] = useState('')
const [password, setpassword] = useState('')
const [error, setError] = useState('')
  const { loading , handleRegister } = useAuth()

  const handleSubmit =async (e) =>{
    e.preventDefault()
    setError('')

    try {
      const user = await handleRegister({username, email, password})

      if (user) {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create your account. Please try again.')
    }
  }
   if(loading){
      return <main>
        <h1>loading....</h1>
      </main>
    }
  return (
          <main>
        <div className='form-container'>
              <h1>Registration</h1>

              <form onSubmit={handleSubmit}>

                {error && <p role="alert">{error}</p>}

                 <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <input
                  onChange={(e) =>{setusername(e.target.value)}}
                  type="text" id='username' name='username' placeholder='Enter your username' required />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                  onChange={(e)=> {setemail(e.target.value)}}
                  type="email" id='email' name='email' placeholder='Enter email address' required />
                </div>
               
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                  onChange={(e) =>{setpassword(e.target.value)}}
                  type="password" id='password' name='password' placeholder='Enter password' required />
                </div>

                <button className='button primary-button'>Register</button>
                
              </form>

              <p>Already have an account? <Link to={"/login"}> Login </Link></p>
        </div>
      </main>
  )
}

export default Register
