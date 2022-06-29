import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Account from './components/account';
import React from 'react';

function App() {

  return (
    <div className="App">
        <HashRouter>
          <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/login/:out' element={<Login />}></Route>
            <Route path='/account/*' element={<Account />}></Route>
            <Route path='*' element={<h2 className='text-center text-danger'>Page not found</h2>}></Route>
          </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
