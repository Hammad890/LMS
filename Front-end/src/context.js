import React,{useContext, useEffect, createContext, useState} from "react";
import { useNavigate } from "react-router-dom";

const userContext = createContext({
    user: null,
    loginUser: ()=>{},
})

const useUser = () => useContext(userContext);

const UserProvider= ({children})=>{
    const [user, setUser]= useState(null);
    const [Admin, setAdmin]= useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(()=>{
        setAdmin (user && user.role === 'Admin');
    },[user]);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const result = await fetch('https://lms-smoky-one.vercel.app/users/user', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`  
          },
            credentials: 'include',
          });
          if (result.status === 200) {
            const { user } = await result.json();
            setUser(user);
            console.log('User state set:', user);
          } else {
            console.error('Error fetching user data:', result.statusText);
          }
        } catch (error) {
          console.error('Network Error:', error);
        }finally {
          setLoading(false); 
        }
      };
    
      if (token) {
        fetchUser();
    } else {
        setLoading(false);
    }
    }, [token]);
    

    const navigate = useNavigate();
 
  const loginUser = async(loginData)=>{
    try{
      console.log('Login Request:', loginData);
        const response = await fetch ('https://lms-smoky-one.vercel.app//users',{
            method : 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(loginData),
            credentials: 'include',
        });
        console.log('Login Response:', response);

        if (response.status === 200) {
          const { user, token } = await response.json();
          setUser(user);
          setToken(token);
          return { user, error: null };
        } else {
          const { error } = await response.json();
          return { user: null, error };
        }
      } catch (error) {
        console.error('Login Error:', error.message || 'Unknown error');
        return { user: null, error: 'Network Error' };
      }
    };

  const logOut = async()=>{
    try {
        const response = await fetch ('https://lms-smoky-one.vercel.app/users/logout',{
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}` 
          },

            credentials: 'include'
        });
         if (response.status === 200) {
          setUser(null)
          setToken(null);
          navigate('/')
      return { success: true, error: null };
    } else {
      const { error } = await response.json();
      return { success: false, error };
    }
    }catch(error){
        console.error(error);
        return { success: false, error: 'Network error' };
    }
  };
  
   if (loading) {
    return <div>Loading...</div>;
  }
 
  return(
    <userContext.Provider value= {{user, loginUser,logOut,Admin,setUser}}>
        {children}
    </userContext.Provider>
  );

  };

  export { useUser, UserProvider};