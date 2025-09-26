import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { AuthProvider } from "./context/AuthContext.jsx"; // import AuthProvider
import { UserProvider } from "./context/UserContext.jsx"; // if you still need this

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProvider>
  </BrowserRouter>
);
