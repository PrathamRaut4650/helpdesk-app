import {Routes, Route} from 'react-router-dom'
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import MyTasks from "./pages/MyTasks"
import PrivateRoute from './components/PrivateRoute'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      
      <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
      <Route path="/my-tasks" element={<PrivateRoute><MyTasks/></PrivateRoute>}/>
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}/>
    </Routes>
  );
}

export default App;