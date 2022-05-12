import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Account from './components/account';
import React, { useState } from 'react';
import { AuthContext } from './components/context';

function App() {

  const [auth, setAuth] = useState({})
  const clearAuth = () => setAuth({})

  return (
    <div className="App">
      <AuthContext.Provider value={{auth, setAuth, clearAuth}}>
          <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='/account' element={<Account />}></Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
