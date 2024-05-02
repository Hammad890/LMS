import React,{useState,useEffect} from 'react';
import Button from '@mui/material/Button';
import {TextField,Dialog,DialogActions,DialogContent,DialogTitle} from "@mui/material";
import Swal from 'sweetalert2';
import { useUser } from '../context';
import { useNavigate ,useLocation} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const drawerWidth = 1;

export default function Signin(){
  console.log("Signin component rendered");
  const location = useLocation();
const [userType, setUserType] = useState("");
const [secretKey,setSecretKey]= useState("");
const [openLoginDialog, setOpenLoginDialog] = useState(false);
const [openSignupDialog,setOpenSignupDialog]= useState(false);
const [username, setUsername]= useState('');
const [email, setEmail]= useState('');
const [number, setNumber]= useState('');
const [password, setPassword]= useState('');
const [confirmPassword, setConfirmPassword]= useState('');
const {loginUser,Admin}= useUser();
const navigate= useNavigate();


useEffect(() => {
  setOpenLoginDialog(true);
  const {userType}= location.state || {};
  setUserType(userType || "");
}, [location.state]);

  const handleLoginDialogClose = () => {
    setOpenLoginDialog(false);
  };
  const handleSignupClick= ()=>{
    setOpenLoginDialog(false);
    setOpenSignupDialog(true);
  }
  const handleSignupDialogClose= ()=>{
    setOpenSignupDialog(false);
  }
  const handleLogin= ()=>{
    setOpenLoginDialog(true);
    setOpenSignupDialog(false);
  }

  const handleSave= async(e)=>{
    e.preventDefault();
    const newUser = {username, email, password, number, role: userType,}
    try{
      let result = await fetch ('http://localhost:5000/users/register',{
        method: 'POST',
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type' : 'application/json',
        },
      })
      await result.json()
      if (password !== confirmPassword){
        alert("Passwords do not match");
        return
      }
      navigate('/');
      setOpenSignupDialog(false);
    }catch(error){
      console.error("Network error:", error);
    }
  }

  const handelLoginSubmit= async (e)=> {
      e.preventDefault();
      const loginData= {
      username: username,
      password: password,
     };
      try {
        const { user } = await loginUser(loginData);

        setOpenLoginDialog(false);
        if (user) {
          navigate('/');

        }if(user === null){
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'User does not exist',
          });
          if(Admin && secretKey !== "web2.0"){
            alert("Invalid Admin");
          }
        }else if (user.role === 'Admin'){
                navigate ('/adminpanel')
    } else{
        navigate ('/')
        }
  }catch(error) {
  console.error('Error in login:', error);
};
}


return (
    <div>
       <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              
              <Typography variant="h6" noWrap component="div"> 
                Library Management System
              </Typography>
            </Toolbar>
          </AppBar>
          </Box>
          <Dialog
            open= {openLoginDialog}
            keepMounted
            onClose={handleLoginDialogClose}

        >
            <DialogTitle sx={{textAlign:'center', color: 'rgb(0, 71, 171)'}}>Login</DialogTitle>
            <DialogContent>
        {userType === "Admin" && ( 
          <TextField
                  autoFocus
                    margin="dense"
                    id="secretkey"
                    label="Secret Key"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                />
          )}
                <TextField
                    margin="dense"
                    id="username"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                   
                />
                <TextField
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                   
                />
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={handleLoginDialogClose}>
                    Cancel
                </Button>
                <Button variant="contained" type="submit" onClick={handelLoginSubmit}>
                    Submit
                </Button>
                <div onClick= {handleSignupClick} style={{ cursor: 'pointer' ,color: 'rgb(0, 71, 171)'}}>don't have account?</div>
            </DialogActions>
        </Dialog>

        <Dialog
            open = {openSignupDialog}
            keepMounted
            onClose={handleSignupDialogClose}
        >
          <DialogTitle sx={{textAlign:'center', color: 'rgb(0, 71, 171)'}}>Sign Up</DialogTitle>

        <DialogContent>
        {userType === "Admin" && ( 
          <TextField
                  autoFocus
                    margin="dense"
                    id="secretkey"
                    label="Secret Key"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                />
          )}
              
                <TextField
                  autoFocus
                    margin="dense"
                    id="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                   
                />
                  <TextField
                    margin="dense"
                    id="usernameInput"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)}
                   
                />
                <TextField
                    margin="dense"
                    id="passwordInput"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                   
                />
                <TextField
                    margin="dense"
                    id="passwordIn"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                   
                />
                  <TextField
                    margin="dense"
                    id="number"
                    label="Contact Number"
                    type="phone number"
                    fullWidth
                    variant="standard"
                    value={number}
                    onChange={(e)=> setNumber(e.target.value)}
                />
                   <TextField
                    margin="dense"
                    id="address"
                    label="Address"
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={handleSignupDialogClose}>
                    Cancel
                </Button>
                <Button variant="contained" type="submit" onClick={handleSave} >
                    Submit
                </Button>
                <div  onClick={handleLogin} style={{ cursor: 'pointer', color: 'rgb(0, 71, 171)' }}>Already have account?</div>
            </DialogActions>
        </Dialog>
        </div>
        );
        }