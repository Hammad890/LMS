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
    Tab,
    Modal
} from "@mui/material"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useParams } from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2';

const drawerWidth = 1;
    export default function Viewdetails(){
      const [user,setUser]= useState([])
      const [book,setBook]= useState([])
        const {id} = useParams()
    const navigate = useNavigate()
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    useEffect(()=>{
      const userData = async () => {
        try {
          const result = await fetch(`http://localhost:5000/users/${id}`, {
            method: 'GET',
            credentials: 'include',
          });
    
          if (result.ok) {
            const responseData = await result.json();
            setUser(responseData.user);
            const bookData= await Promise.all (
              responseData.user.borrowedBooks.map(async(bookId)=>{
                const bookResult= await fetch (`http://localhost:5000/books/${bookId}`, {
                method: 'GET',
              });
              if (bookResult.ok){
                return await bookResult.json();
              }else{
                console.error("Error fetching book:",bookResult.statusText)
                return null;
              }
              })
            );
            setBook(bookData.filter((book)=>book !== null));
          }else{
            const errorData= await result.json()
            console.error("Error fetching user data:",errorData);
          }
          } catch (error) {
        console.error('Network Error:', error);
      }
      };
    userData();
    },[id]);

      const deleteModal= ()=>{
        setShowDeleteModal(true)
      }

      const handleDelete = async(id)=>{
        try {
        let res =await fetch (`http://localhost:5000/users/${id}`,{
          method: 'Delete'
        });
        const data = await res.json();
        if (res.ok){
            setUser([]);
            setBook([]);
            setShowDeleteModal(false);
            console.log('User deleted successfully!');
            Swal.fire({
              icon: 'success',
              title: 'User deleted successfully!',
              showConfirmButton: false,
              timer: 1500
            });
        }else {
            console.error('Failed to delete user:',data.error || res.statusText);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }

      console.log (book);
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
            <Card sx={{width: '450px'}}>
             <Tab label="User Details" tabIndex={0} />
                            <CardContent >
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell variant="head" component="th" width="200">
                                                Username
                                            </TableCell>
                                            <TableCell>{user.username}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head" component="th">
                                                Email
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head" component="th">
                                                Borrowed Books
                                            </TableCell>
                                            <TableCell>{book.map((item,index) => (
    <div key={index}>{item.book.name}</div>
  ))}
            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <CardActions>
                                <div> 
                                <Button variant="contained" color="error" onClick={()=>deleteModal()}> Delete </Button>
                <Modal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
         <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <h2 id="modal-modal-title">Confirm Delete</h2>
          <p id="modal-modal-description">Are you sure you want to delete this user?</p>
          <Button onClick={()=> handleDelete(user._id)} color="error" variant="contained" >
            Delete
          </Button>
                    <Button onClick={() => setShowDeleteModal(false)} variant="contained" style={{marginLeft: '24px'}}>
            Cancel
          </Button>
        </Box>
        </Modal>
        <Button type="submit" variant="contained" color="primary" style={{marginLeft:"48px"}} onClick={() => navigate(-1)}>
                                Go Back
                            </Button>
        </div>
        </CardActions>
        </CardContent>
        </Card>
        </div>
        </div>
      )
}