import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom"
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

export default function BookUpdated() {
    const navigate = useNavigate();
    const {id} = useParams()
    const [name,setName]= useState('');
    const [isbn,setIsbn]= useState('');
    const [category,setCategory]= useState('');
    const [price,setPrice]= useState('');
    const [quantity,setQuantity]= useState('');
   
    

     useEffect(()=>{
        bookDetails()
    },
    // eslint-disable-next-line
    []);

    const bookDetails= async()=>{
        try {
        let result= await fetch(`http://localhost:5000/books/${id}`,{
          method: 'GET',
        })
        result= await result.json();
         console.log(result)
         if (result.book) {
        setName(result.book.name)
        setIsbn(result.book.isbn)
        setPrice(result.book.price)
        setCategory(result.book.category)
        setQuantity(result.book.quantity)
         } else {
            console.error('Book not found in result:', result);
          }
        }catch (error) {
          console.error('Error fetching book details:', error);
        }
      }

    const handleSave= async(e)=>{
            let result = await fetch(`http://localhost:5000/books/${id}`,{
                method: 'PUT',
                body: JSON.stringify({name,isbn,price,category}),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            result = await result.json();
            console.log(result)
            navigate('/book')
            e.preventDefault()
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
                    <InputLabel  sx={{my: '6px'}}>Category</InputLabel>
                    <Select 
                        name="category"  
                        required 
                        value= {category || '' }
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