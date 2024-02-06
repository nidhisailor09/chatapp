import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


const Login = () => {

  const[error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const email = e.target[0].value;
    const password = e.target[1].value;

    try{
      await signInWithEmailAndPassword(auth, email, password);      
        navigate("/")
    } catch(error){
        setError(true);

    }
  };



  return (
      <div className='formContainer'>
        <div className='formWrapper'>
          <span className='logo'>CHARCHA</span>
          <span className='title'>Login</span>

          <form onSubmit={handleSubmit}>
            <input type='email' placeholder='email' />
            <input type='password' placeholder='password'/>
            <input style={{display:"none"}} type='file' id='file'/>
            
            <button>Sign in</button>
            {error && <span>Email or Password incorrect.</span>}
          </form>
          <p>Don't have an account? <Link to="/register">Register</Link> </p>
        </div>
      </div>
    );
}

export default Login;