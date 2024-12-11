// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Tasks from "./components/Tasks/Tasks";
import Trached from "./components/Trached/Trached";
import CategoriesList from "./components/Categories/Categories";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Tasks />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/trashed" element={<Trached />} />
        </Route>
        
      </Routes>
    </Router>
  );
};

export default App;
