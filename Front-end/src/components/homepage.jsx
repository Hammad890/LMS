import {React,useState,useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import {deepPurple}  from '@mui/material/colors';
import {Paper, TableContainer} from '@mui/material'
import { useUser } from '../context';
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const drawerWidth = 1;
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));


export default function Homepage() {
  const [books,setBooks]= useState([]);
  const {user,token,logOut,Admin,setUser}= useUser();
  // eslint-disable-next-line
  const [userType,
    setUserType]= useState("");
  const navigate= useNavigate();
  
  useEffect(()=>{
    bookData();
  },[])

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const result = await fetch('https://lms-smoky-one.vercel.app/users/borrowed',{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` 
        },
          credentials: 'include',
        })
        if (result.status === 200) {
          const { books } = await result.json();
          setUser(prevUser => ({
            ...prevUser,
            borrowedBooks: books || [] 
          }));
        } else {
          console.error('Error fetching borrowed book data:', result.statusText);
        }
      } catch (error) {
        console.error('Error fetching borrowed book data:', error);
      }
    };

    if (user && token) {
      fetchBorrowedBooks();
    }
  }, [user, token, setUser]);

  const bookData = async()=>{
    let result = await fetch ('https://lms-smoky-one.vercel.app/books',{
      method: 'GET',
    })
    result= await result.json()
    setBooks(result.books)
  }

  
    
  const handleLoginClick = async () => {
    const { value } = await Swal.fire({
      title: 'Login As',
      input: 'radio',
      inputOptions: {
        'User': 'User',
        'Admin': 'Admin',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'You need to choose something!';
        }
      },
    });

    if (value) {
      setUserType(value);
      navigate('/signin', { state: { userType: value } });
    }
 };
  

    const handelLogout = ()=>{
       logOut()
    }


    const handelView = async(id)=>{
      if (user){
        navigate(`/bookview/${id}`)
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'Login Required',
          text: 'You need to log in to view book details.',
        });
      }
    }

  return (
    <>
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
        <Toolbar sx={{  display: 'flex', justifyContent: 'space-between' }} >
          <Typography variant="h6" noWrap component="div" > 
            Library Management System 
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
            <Avatar sx={{ bgcolor: deepPurple[500], marginRight: '5px' }}>{user.username ?user.username.charAt(0).toUpperCase() : ''}</Avatar>
            <Button variant="contained" onClick={handelLogout} > LOGOUT </Button>
            </>
          ):(
          <Button variant="contained" onClick={handleLoginClick}> LOGIN </Button>
          )}
          </div>
        </Toolbar>
      </AppBar>
      </Box>
      <div className='container' style={{marginTop: '80px'}}>
      <h1 style={{float: 'left', fontWeight: 'bold'}}>Book List</h1>
      </div>
      <Table sx={{ minWidth: 700, my: '120px',width: '900px',alignItems: 'center', mx:'150px' }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">ISBN</StyledTableCell>
            <StyledTableCell align="right">Category</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell align="right">Quantity</StyledTableCell>
            <StyledTableCell align="right">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <StyledTableRow key={book._id} >
              <StyledTableCell component="th" scope="row">
                {book.name}
              </StyledTableCell>
              <StyledTableCell align="right">{book.isbn}</StyledTableCell>
              <StyledTableCell align="right">{book.category}</StyledTableCell>
              <StyledTableCell align="right">${book.price}</StyledTableCell>
              <StyledTableCell align="right">{book.quantity}</StyledTableCell>
              <StyledTableCell align="right">
              <IconButton aria-label='view' onClick={()=>handelView(book._id)}>
                      <RemoveRedEyeTwoToneIcon/>
                    </IconButton>
                    </StyledTableCell>
            </StyledTableRow>
          ))}
          
        </TableBody>
      </Table>
    </div>
  {
    user && !Admin && (
        <>
            <div>
                <Typography variant="h5">Borrowed Books</Typography>
            </div>
            {user && user.borrowedBooks && user.borrowedBooks.length > 0 ? (
                <>
                    <div>
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">ISBN</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {user.borrowedBooks.map((book) => (
                                        <TableRow key={book._id}>
                                            <TableCell component="th" scope="row">
                                                {book.name}
                                            </TableCell>
                                            <TableCell align="right">{book.isbn}</TableCell>
                                            <TableCell>{book.category}</TableCell>
                                            <TableCell align="right">{`$${book.price}`}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </>
            ) : (
                <Typography variant="h5">No books issued!</Typography>
            )}
        </>
    )
}
</>
)
}
