import React, { useContext, useState } from 'react';
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from '../context/AuthContext';

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  //handleSearch Function
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"), 
      where("displayName", "==", username)
    );

    try{
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUser(userData);
        //  console.log("User Data:", userData);
        });
      } else {
        console.log("No documents found for the given query.");
      }
    } catch(err){
      setErr(true);
      console.error("Error fetching data:", err);
      setUser(null);
      setUsername("");
    }

  };

  //handleKey function
      const handleKey = (e) =>{
        e.code === "Enter" && handleSearch();
      };

  //handleSelect function
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exits, if not, create.
    const combiedId = 
        currentUser.uid > user.uid 
        ? currentUser.uid + user.uid 
        : user.uid + currentUser.uid;
        try{
          const res= await getDoc(doc(db, "chats", combiedId));
          
          if(!res.exists()){
            //create a chat in chats collection
            await setDoc(doc(db, "chats", combiedId),{messages: [] });
            console.log(setDoc+"created");
            //create user chats
            await updateDoc(doc(db,"userChats",currentUser.uid),{
              [combiedId+".userInfo"]:{
                uid:user.uid,
                displayName:user.displayName,
                photoURL: user.photoURL
              },
              [combiedId+".date"]:serverTimestamp()              
            });

            await updateDoc(doc(db,"userChats",user.uid),{
              [combiedId+".userInfo"]:{
                uid:currentUser.uid,
                displayName:currentUser.displayName,
                photoURL: currentUser.photoURL
              },
              [combiedId+".date"]:serverTimestamp()              
            });

          }
        }catch(err){
          setErr(true);
        }
     
  }

  return (
    <div className='search'>
      <div className='searchForm'>
        <input type="text" placeholder='Find a user' 
        onKeyDown={handleKey} 
        onChange={(e)=>setUsername(e.target.value)}
        value={username}/>
      </div>
      {err && <span>User not found!</span>}
      {user && (
      <div className='userChat' onClick={handleSelect}>
        <img src={user.photoURL} alt=""/>
        <div className='userChatInfo'>
          <span>{user.displayName}</span>
      </div>
      </div>
      )}
    </div>
  );
};

export default Search;