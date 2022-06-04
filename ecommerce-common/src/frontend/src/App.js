import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './components/home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
