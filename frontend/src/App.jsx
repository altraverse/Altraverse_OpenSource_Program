import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './component/pages/Home.jsx';
import AnnouncementsPage from './components/AnnouncementsPage';
import Project from './components/pages/Project.jsx';
import ProjectDetails from './components/pages/ProjectDetails';
import Login from "./components/pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Community from "./components/pages/Community";
import Resources from './components/pages/Resources.jsx';
import AboutPage from './components/AboutPage';
import BecomeMentor from './components/pages/BecomeMentor.jsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/announcement' element={<AnnouncementsPage />} />

      <Route path='/about' element={<AboutPage />} />

      <Route path='/projects' element={<Project />} />
      <Route path='/projects/:id' element={<ProjectDetails />} />
      <Route path='/resources' element={<Resources />} />
      <Route path='/become-mentor' element={<BecomeMentor />} />

      <Route path="/login" element={<Login />} />
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
  );
}

export default App;
