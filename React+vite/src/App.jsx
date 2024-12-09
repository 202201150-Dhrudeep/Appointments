import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoginPage } from './components/Loginpage/LoginPage';
import { MainToAll } from './components/MainPage/mainToAll';
import DashBoard from './components/Loginpage/Dashboard';
import { AdminEdit } from './components/admin/adminEdit';

export const App = () => {
  return (
    <Router basename="/barber"> {/* Optional: Use basename for sub-directory hosting */}
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<MainToAll />} />
        <Route path='/login/bhaikaamkarnedashboard' element={<DashBoard />} />
        <Route path='/admin/edit/here' element={<AdminEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
