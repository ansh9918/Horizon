import { Outlet } from 'react-router';
import { Header, Footer, Notification } from './components/index';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import authService from './appwrite/auth';
import { login, logout } from './redux/AuthSlice';
import Loader from './components/Loader';
import service from './appwrite/service';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Step 2: Fetch the authenticated user's account
        const user = await authService.getCurrentUser();

        if (user) {
          const userData = await service.getUser(user.$id);
          dispatch(
            login({
              userData: userData,
            }),
          );
        }
        if (!user) {
          dispatch(logout());
        }
      } catch (error) {
        if (error.code === 401) {
          console.warn('No active session found. Logging out...');
          dispatch(logout());
        } else {
          console.error('Error while checking user session:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="relative flex flex-col gap-2 overflow-hidden p-2 font-volte">
        <Header />
        <Outlet />
        <Footer />
        <Notification />
      </div>
    </>
  );
}

export default App;
