import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import InventoryIcon from '@mui/icons-material/Inventory';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect,useState } from 'react';

const drawerWidth = 240;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});


export default function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userCount, setUserCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [borrowedCount, setBorrowedCount]= useState(0);

  useEffect(()=>{
    userData();
  },[])

  useEffect(()=>{
    bookData();
  },[])

  useEffect(()=>{
    borrowedBook();
  },[])

  const borrowedBook= async()=>{
    let result = await fetch ('https://lms-smoky-one.vercel.app/users/borrowedbooks',{
      method: 'GET',
    })
    result= await result.json()
    setBorrowedCount(result.borrowed.length)
  }
  const bookData = async()=>{
    let result = await fetch ('https://lms-smoky-one.vercel.app/books',{
      method: 'GET',
    })
    result= await result.json()
    setBookCount(result.books.length)
  }

  const userData = async()=>{
    let result = await fetch ('https://lms-smoky-one.vercel.app/users',{
      method: 'GET',
    })
    result= await result.json()
    setUserCount(result.users.length)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawer = (
    <div>
      <Toolbar />
      <List>
      <h2>  <AdminPanelSettingsIcon /> Dashboard </h2>
          <ListItem key="StudentManagement" disablePadding>
            <ListItemButton component= {Link} to='/student' >
              <ListItemIcon>
              <GroupAddIcon/>
              </ListItemIcon>
              <ListItemText primary="Student Management" />
            </ListItemButton>
          </ListItem>
          <ListItem key="BookManagement" disablePadding>
            <ListItemButton  component= {Link} to='/book'>
              <ListItemIcon>
              <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Book Management"/>
            </ListItemButton>
          </ListItem>
      </List>
    </div>
  )
  const container = window !== undefined ? () => window().document.body : undefined;

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
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
          </IconButton>
          <Typography variant="h6" noWrap component="div"> 
            Library Management System
          </Typography>
        </Toolbar>
      </AppBar>
      <Card sx={{ minWidth: 275, mx: '250px', my: '160px', backgroundColor: 'rgb(239, 253, 95)',justifyContent: 'center' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Total Books:
          <div>
            {bookCount}
          </div>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={{color: 'rgb(25, 25, 112)'}}>Learn More</Button>
      </CardActions>
    </Card>
    <Card sx={{ minWidth: 275, mx: '-180px', my: '160px', backgroundColor: 'rgb(0, 128, 128)',justifyContent: 'center' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Total Students:
          <div>
          {userCount}
          </div>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={{color: 'rgb(25, 25, 112)'}}>Learn More</Button>
      </CardActions>
    </Card>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
         <Card sx={{ minWidth: 275, mx: '230px', my: '160px', backgroundColor: 'rgb(196, 180, 84)',justifyContent: 'center' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Borrowed Books:
          <div>
            {borrowedCount}
          </div>
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={{color: 'rgb(25, 25, 112)'}}>Learn More</Button>
      </CardActions>
    </Card>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      ></Box>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <ThemeProvider theme={darkTheme}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
        </ThemeProvider>
      </Box>
    </Box>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
