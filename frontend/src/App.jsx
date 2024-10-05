import { BrowserRouter } from 'react-router-dom';
import './styles/global.scss';
import { AuthProvider } from './contexts/auth';
import { Routes } from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css'
import 'react-calendar/dist/Calendar.css';
import './styles/calendar.scss';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <ToastContainer autoClose={5000} position="top-right" />
    </BrowserRouter>
  );
}