import {React, useState, useEffect} from 'react';
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
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import IconButton from '@mui/material/IconButton';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Modal} from '@mui/material'
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';
import { Link} from 'react-router-dom';
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
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function BookManagement() {
  const [books,setBooks]= useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(()=>{
    bookData();
  },[])

  const bookData = async()=>{
    let result = await fetch ('https://lms-smoky-one.vercel.app/books',{
      method: 'GET',
    })
    result= await result.json()
    setBooks(result.books)
  }

  const deleteModal= ()=>{
    setShowDeleteModal(true)
  }

  const handleDelete = async(id)=>{
    try {
    let res =await fetch (`https://lms-smoky-one.vercel.app/books/${id}`,{
      method: 'Delete'
    });
    const data = await res.json();
    if (res.ok){
      bookData();
      setShowDeleteModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Book deleted successfully!',
        showConfirmButton: false,
        timer: 1500
      });
        }else {
      console.error('Failed to delete book:',data.error || res.statusText);
  }
} catch (error) {
  console.error('Error deleting book:', error);
}
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
      <div className='container' style={{marginTop: '80px'}}>
      <h1 style={{float: 'left', fontWeight: 'bold'}}>Book List</h1><Button variant="contained" sx={{float: 'right'}} component = {Link} to = '/bookform'>Add Book</Button>
      </div>
      <Table sx={{ minWidth: 700, my: '120px',width: '900px',alignItems: 'center', mx:'150px' }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="center">ISBN</StyledTableCell>
            <StyledTableCell align="center">Category</StyledTableCell>
            <StyledTableCell align="center">Price</StyledTableCell>
            <StyledTableCell align="center">Quantity</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <StyledTableRow key={book._id} >
              <StyledTableCell component="th" scope="row">
                {book.name}
              </StyledTableCell>
              <StyledTableCell align="center">{book.isbn}</StyledTableCell>
              <StyledTableCell align="center">{book.category}</StyledTableCell>
              <StyledTableCell align="center">${book.price}</StyledTableCell>
              <StyledTableCell align="center">{book.quantity}</StyledTableCell>
              <StyledTableCell align="center">
                    <IconButton aria-label="delete" onClick={()=>deleteModal()} >
                      <DeleteTwoToneIcon />
                    </IconButton>
                    <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <h2 id="modal-modal-title">Confirm Delete</h2>
          <p id="modal-modal-description">Are you sure you want to delete this book?</p>
          <Button onClick={()=> handleDelete(book._id)} color="error" variant="contained" >
            Delete
          </Button>
                    <Button onClick={() => setShowDeleteModal(false)} variant="contained" style={{marginLeft: '24px'}}>
            Cancel
          </Button>
        </Box>
      </Modal>
                    <IconButton aria-label="edit" component={Link} to={"/bookupdate/"+book._id} >
                    <EditTwoToneIcon/>
                    </IconButton>
                    <Link to={"/bookview/"+book._id} aria-label='view'>
                    <IconButton aria-label='view'>
                      <RemoveRedEyeTwoToneIcon/>
                    </IconButton>
                    </Link>
                    </StyledTableCell>
                    </StyledTableRow>
          ))}
          
        </TableBody>
      </Table>
    </div>
  );
}