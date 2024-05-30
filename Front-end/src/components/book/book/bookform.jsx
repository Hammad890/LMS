import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import {
    Paper,
    Container,
    Button,
    TextField,
    FormGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

const drawerWidth = 1;

export default function Bookform() {
    const navigate = useNavigate();
    const [name,setName]= useState('');
    const [isbn,setIsbn]= useState('');
    const [category,setCategory]= useState('');
    const [price,setPrice]= useState('');
    const [quantity,setQuantity]= useState('');

    const handleSave= async(e)=>{
        const newBook = {name: name, isbn: isbn, category: category, price: price, quantity: quantity}
        try{
            let result = await fetch('https://lms-smoky-one.vercel.app/books',{
                method: 'POST',
                body: JSON.stringify(newBook),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            result = await result.json();
            navigate('/book')
            e.preventDefault()
        }catch(error){
            console.error("Network error:", error);
        }
    }
    
  return (
    <>
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
    <Container component={Paper} sx={{my:'120px', width: '500px', height:'450px'}}>
        <Typography  variant="h5">
        </Typography>
        <form noValidate autoComplete="off" >
            <FormGroup>
                <FormControl >
                    <TextField
                        sx={{my: '6px'}}
                        label="Name"
                        name="name"
                        required
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                    />
                </FormControl>
                <FormControl >
                    <TextField
                    sx={{my: '6px'}}
                        label="ISBN"
                        name="isbn"
                        required
                        value={isbn}
                        onChange={(e)=> setIsbn(e.target.value)}
                    />
                </FormControl>
                <FormControl >
                    <InputLabel sx={{my: '6px'}}>Category</InputLabel>
                    <Select 
                        name="category"  
                        required 
                        value= {category}
                        onChange={(e)=> setCategory(e.target.value)}
                        >
                        <MenuItem value="Sci-Fi">Sci-Fi</MenuItem>
                        <MenuItem value="Action">Action</MenuItem>
                        <MenuItem value="Adventure">Adventure</MenuItem>
                        <MenuItem value="Horror">Horror</MenuItem>
                        <MenuItem value="Romance">Romance</MenuItem>
                        <MenuItem value="Mystery">Mystery</MenuItem>
                        <MenuItem value="Thriller">Thriller</MenuItem>
                        <MenuItem value="Drama">Drama</MenuItem>
                        <MenuItem value="Fantasy">Fantasy</MenuItem>
                        <MenuItem value="Comedy">Comedy</MenuItem>
                        <MenuItem value="Biography">Biography</MenuItem>
                        <MenuItem value="History">History</MenuItem>
                        <MenuItem value="Western">Western</MenuItem>
                        <MenuItem value="Literature">Literature</MenuItem>
                        <MenuItem value="Poetry">Poetry</MenuItem>
                        <MenuItem value="Philosophy">Philosophy</MenuItem>
                    </Select>
                </FormControl>
                <FormControl >
                    <TextField
                    sx={{my: '6px'}}
                        label="Price"
                        name="price"
                        required
                        value={price}
                        onChange={(e)=> setPrice(e.target.value)}
                    />
                </FormControl>
                <FormControl >
                    <TextField
                    sx={{my: '4px'}}
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e)=> setQuantity(e.target.value)}
                    />
                </FormControl>
            </FormGroup>
            <div>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        navigate(-1)
                    }}
                >
                    Cancel
                </Button>
                <Button type="button" variant="contained" color="primary" sx={{mx: '6px', my: '6px'}} onClick={handleSave} >
                    Save
                </Button>
            </div>
        </form>
    </Container>
</>
  )
}
