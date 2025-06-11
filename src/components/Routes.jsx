import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../Routes/home';
import About from '../Routes/about';
import Contact from '../Routes/contact';
import Login from '../Routes/login';
import Register from '../Routes/register';
import HomePage from '../Routes/homepage';
import Card from '../Routes/card';
import MemberCard from '../Routes/member';
import GoogleAuthSuccess from '../Routes/google-auth-success';
import ProtectedRoute from '../components/ProtectedRoute'; // <-- import this

function PageRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={
          <ProtectedRoute>
            <HomePage/>
          </ProtectedRoute>
        }/>
        <Route path="/card" element={
          <ProtectedRoute>
            <Card/>
          </ProtectedRoute>
        }/>
        <Route path="/member" element={
          <ProtectedRoute>
            <MemberCard/>
          </ProtectedRoute>
        }/>
        <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
        </Routes>
    </BrowserRouter>
  );
}

export default PageRoute;
