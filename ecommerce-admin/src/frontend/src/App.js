import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import MyNavbar from './components/navbar';

function App() {
  return (
    <div className="App">
      <MyNavbar />
      <BrowserRouter>
        <div>Admin page</div>
      </BrowserRouter>
    </div>
  );
}

export default App;
