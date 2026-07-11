import './App.css';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './component/pages/Home.jsx';
import AnnouncementsPage from './components/AnnouncementsPage';
import Project from './components/pages/Project.jsx';
import ProjectDetails from './components/pages/ProjectDetails';
import RoleDetails from './components/pages/RoleDetails';
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import VerifyOTP from "./components/pages/VerifyOTP";
import RolesPage from "./components/pages/RolesPage";
import AdminDashboard from "./components/pages/AdminDashboard";
import ProfilePage from "./components/pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Community from "./components/pages/Community";
import Resources from './components/pages/Resources.jsx';
import AboutPage from './components/AboutPage';
import BecomeMentor from './components/pages/BecomeMentor.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/announcement' element={<AnnouncementsPage />} />

      <Route path='/about' element={<AboutPage />} />

      <Route path='/projects' element={<Project />} />
      <Route path='/projects/:id' element={<ProjectDetails />} />
      <Route path='/roles/:roleId' element={<RoleDetails />} />
      <Route path='/resources' element={<Resources />} />
      <Route path='/become-mentor' element={<BecomeMentor />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route
        path="/roles"
        element={
          <ProtectedRoute>
            <RolesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        }
      />
      {/* <Route path='/resources' element={<ResourcePage />} />*/}
      {    /* <Route path='/about' element={<About />} />  */}
      {/* <Route path='/project' element={<Project />} />   */}

    </Routes>
    </>
  );
}

export default App;
