
import './App.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-dark-5/dist/css/bootstrap-dark.min.css';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from './screens/Login';
import Signup from './screens/Signup';
import Codification from './components/Codification';
import Admin from './screens/Admin';


function App() {
  return (
    <Router>
      <div >
        <Routes>
          <Route exact path = "/" element={<Home/>}/>
          <Route exact path = "/login" element={<Login/>}/>
          <Route exact path = "/createuser" element={<Signup/>}/>
          <Route exact path="/genearte-code" element={<Codification/>}/>
          <Route exact path="/add-product" element={<Admin/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
