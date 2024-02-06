import React, { useState } from 'react';
import Add from "../img/add-user1.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDocs } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where } from "firebase/firestore";


const Register = () => {
  const[error,setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) =>{
    setLoading(true);
    e.preventDefault()
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try{
      // Check if email already exists
    const emailQuery = query(collection(db, "users"), where("email", "==", email));
    const emailSnapshot = await getDocs(emailQuery);

    if (!emailSnapshot.empty) {
      setError("Email already exists.");
      setLoading(false);
      return;
    }

    // Check if displayName already exists
    const displayNameQuery = query(collection(db, "users"), where("displayName", "==", displayName));
    const displayNameSnapshot = await getDocs(displayNameQuery);

    if (!displayNameSnapshot.empty) {
      setError("Username already exists.");
      setLoading(false);
      return;
    }

    // If email and username are unique, proceed with user creation

      const res = await createUserWithEmailAndPassword(auth,email,password);
      
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);
      
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (error) {
            console.log("Error creating user:", error);
            setError("Something went wrong.");
            setLoading(false);
          }
        });
      });
    } catch(error){
      console.error("Firebase authentication error:", error);
      setError("Something went wrong.");
      setLoading(false);

    }
  };

  return (
      <div className='formContainer'>
        <div className='formWrapper'>
          <span className='logo'>CHARCHA</span>
          <span className='title'>Register</span>

          <form onSubmit={handleSubmit}>
            <input required type='text' placeholder='enter your name'/>
            <input required type='email' placeholder='email' />
            <input required type='password' placeholder='password'/>
            <input  style={{ display:"none" }} type='file' id='file'/>
            <label htmlFor='file'>
              <img src={Add} alt="" />
              <span>Add an avatar</span>
            </label>
            <button disabled={loading}>Sign up</button>
            {loading && "Uploading and compressing the image please wait..."}
            {error && <span>{error}</span>}
          </form>
          {/* <Link to=""></Link> */}
          <p>Do you already have an account? <Link to="/login">Login</Link> </p>
        </div>
      </div>
    );
};

export default Register;