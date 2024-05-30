import {React, useEffect, useState} from 'react';
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
import { Link} from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';

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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function StudentManagement() {
  const [users,setUsers]= useState([])

  useEffect(()=>{
    userData();
  },[])

  const userData = async()=>{
    let result = await fetch ('https://lms-smoky-one.vercel.app/users',{
      method: 'GET',
    })
    result= await result.json()
    setUsers(result.users)
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
      <Table sx={{ minWidth: 700, my: '120px',width: '900px',alignItems: 'center', mx:'150px' }} aria-label="customized table">
        <TableHead>
          <TableRow>
          <StyledTableCell>Username</StyledTableCell>
            <StyledTableCell align="right">Email</StyledTableCell>
            <StyledTableCell align="right">Borrowed Books</StyledTableCell>
            <StyledTableCell align="right">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {users.map((user) => (
            <StyledTableRow key={user.username} >
              <StyledTableCell component="th" scope="row">
                {user.username}
              </StyledTableCell>
              <StyledTableCell align="right">{user.email}</StyledTableCell>
              <StyledTableCell align="right">{user.borrowedBooks.map((book)=>(
                <div key={book._id}>{book.name}</div>
              ))}</StyledTableCell>
              <StyledTableCell align="right">
              <Link to={"/viewdetails/"+user._id} aria-label='view'>
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