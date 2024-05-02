import ResponsiveDrawer from './components/admin.jsx';
import StudentManagement from './components/student/student.jsx';
import BookManagement from './components/book.jsx';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import Bookform from './components/book/bookform.jsx';
import Bookview from './components/book/bookview.jsx';
import Homepage from './components/homepage.jsx';
import BookUpdated from './components/book/updatebook.jsx';
import Viewdetails from './components/student/viewdetails.jsx';
import { UserProvider } from './context.js';
import Signin from './components/signin.jsx';

function App() {
  const drawerPath= "adminpanel";
  const studentPath= "student";
  const bookPath= "book";
  const bookformPath= "bookform"
  const bookviewPath= "bookview/:id"
  const homepagePath= "/"
  const bookupdatedPath = "bookupdate/:id"
  const viewdetailsPath = "viewdetails/:id"
  const signPath ="signin"
  return (
    <div className="App">
      <header className="App-header">
      <Router>
        <UserProvider>
          <Routes>
        <Route path={homepagePath} element={<Homepage/>}/>
        <Route path= {drawerPath} element= {<ResponsiveDrawer/>}/>
        <Route path= {studentPath} element= {<StudentManagement/>}/>
        <Route path={bookPath} element= {<BookManagement/>}/>
        <Route path= {bookformPath} element= {<Bookform/>}/>
        <Route path= {bookviewPath} element= {<Bookview/>}/>
        <Route path={bookupdatedPath} element= {<BookUpdated/>}/>
        <Route path={viewdetailsPath} element = {<Viewdetails/>}/>
        <Route path={signPath} element ={<Signin/>}/>
        </Routes>
        </UserProvider>
      </Router>
      </header>
    </div>
  );
}

export default App;

  

 