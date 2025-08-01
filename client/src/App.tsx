
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
// import DemoToggle from './components/DemoToggle';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        {/*<DemoToggle />*/}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;