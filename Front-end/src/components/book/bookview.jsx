import {React,useState, useEffect} from 'react'
import {
    Button,
    CardContent,
    CardActions,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Card,
    Typography,
    Tab
} from "@mui/material"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useParams } from 'react-router-dom';
import { useUser } from '../../context';
import {Link, useNavigate} from "react-router-dom"

const drawerWidth = 1;

export default function Bookview() {

  const {id} = useParams()
    
    const [book,setBook]= useState([])
    const {user,loading} = useUser();
    const navigate = useNavigate()
    
    useEffect(()=>{
       userData();  
      },
      // eslint-disable-next-line
      [])
      
      useEffect(() => {
     bookData();
  },
  // eslint-disable-next-line
  []);

    const bookData = async()=>{
      try{
        let result = await fetch (`https://lms-smoky-one.vercel.app/books/${id}`,{
          method: 'GET',
        })
        if (result.status === 200){
        result= await result.json()
        console.log(result)
        setBook(result.book)
      }else{
        console.error('Error fetching book:', result.statusText);
      }
      }catch (error) {
        console.error('Network Error:', error);
    }
};

    const userData = async () => {
    try {
      const result = await fetch('https://lms-smoky-one.vercel.app/users/user', {
        method: 'GET',
        credentials: 'include',
      });

      if (result.status === 200) {
        const { user} = await result.json();
        return user;
      } else {
        const errorData = await result.json();
        console.error('Error fetching user data:', errorData);
        return null;
      }
    } catch (error) {
      console.error('Network Error:', error);
      return null
    }
  };
  
   const handleBorrowBook = async()=>{
    try{
      const result = await fetch ('https://lms-smoky-one.vercel.app/users/borrow',{
        method: 'POST',
        body: JSON.stringify({isbn: book.isbn, userId: user._id}),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (result.status === 200){
      const updatedBooks = await result.json();
      setBook(updatedBooks.book)  
      }else{
        console.error('Error borrowing book',result.statusText);
      }
    }catch(error) {
      console.error('Network Error:', error);
    } 
  }
   

   const handleReturnBook = async ()=>{
    try{
      const result = await fetch ('https://lms-smoky-one.vercel.app/users/return',{
        method : 'POST',
        body: JSON.stringify({isbn: book.isbn, userId: user._id}),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (result.status === 200){
        const updatedBooks = await result.json();
       setBook(updatedBooks.book)
      }else{
        console.error('Error borrowing book',result.statusText);
      }
    }catch(error) {
      console.error('Network Error:', error);
    }
   };
   
  if (loading) {
    return <div>Loading...</div>;
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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '120px' }}>
        {book ?(
        <Card sx={{width: '450px'}}>
         <Tab label="Book Details" tabIndex={0} />
                        <CardContent >
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell variant="head" component="th" width="200">
                                            Name
                                        </TableCell>
                                        <TableCell>{book.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            ISBN
                                        </TableCell>
                                        <TableCell>{book.isbn}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Category
                                        </TableCell>
                                        <TableCell>{book.category}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Quantity
                                        </TableCell>
                                        <TableCell>{book.quantity}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Available
                                        </TableCell>
                                        <TableCell>{book.availableQuantity}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell variant="head" component="th">
                                            Price
                                        </TableCell>
                                        <TableCell>${book.price}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <CardActions> 
                            <div>
                              {user.role === 'Admin' ?(
                                <Button
                                variant="contained"
                                color="secondary"
                                component={Link} 
                                to={"/bookupdate/"+book._id}
                            >
                                Edit Book
                            </Button>
                              ):(
                                <> 
                        <Button variant="contained"onClick={handleBorrowBook} disabled={book && user && book.borrowedBy &&
                           Array.isArray(book.borrowedBy) && book.borrowedBy.includes(user._id)}>Borrow</Button>
                        <Button variant="contained" onClick={handleReturnBook} disabled={book && user && book.borrowedBy &&
                              Array.isArray(book.borrowedBy) && !book.borrowedBy.includes(user._id)} >Return</Button>
                              </>
                              )}
                              <Button type="submit" variant="contained" color="primary" style={{marginLeft:"48px"}} onClick={() => navigate('/',{ state: { updateBorrowedBooks: true } })}>
                                Go Back
                            </Button>
                              </div>
                    </CardActions>
                        </CardContent>
                        </Card>
        ):( <Typography variant="h6">Book not found</Typography>
        )}
                        </div>
    </div>
  )
}
