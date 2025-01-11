import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../index';
import { useEffect, useState } from 'react';
import { HiMenu } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import { logout } from '../../redux/AuthSlice';
import service from '../../appwrite/service';

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [search, setSearch] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true,
    },
    {
      name: 'About Us',
      slug: '/about-us',
      active: true,
    },
    {
      name: 'All Blogs',
      slug: '/all-blogs',
      active: true,
    },
  ];
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const fetchFilePreview = async () => {
      try {
        // Get the file preview URL
        const url = await service.getfilePreview(userData.profilePhoto); // Returns a Promise
        setFileUrl(url);
      } catch (error) {
        console.error('Error fetching file preview:', error);
      }
    };

    fetchFilePreview();
  });

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = async () => {
    await authService.logout().then(() => {
      dispatch(logout());
      navigate('/');
    });
  };

  return (
    <header className="w-full rounded-lg border border-gray-700 bg-white px-4 py-4 text-black shadow-xl backdrop-blur-lg">
      <nav className="flex items-center justify-around">
        <h1 className="cursor-pointer text-2xl font-semibold">Horizon</h1>

        <ul className="text-md flex gap-10 transition-all duration-500">
          {navItems.map((item) =>
            item.active ? (
              <li
                key={item.slug}
                className="cursor-pointer p-1 transition-all duration-200 hover:underline hover:underline-offset-4"
                onClick={() => navigate(item.slug)}
              >
                {item.name}
              </li>
            ) : null,
          )}
        </ul>
        <div className="flex">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            placeholder={'Search Blog..'}
            className={
              'rounded-r-none bg-white/20 p-1 px-3 text-black placeholder-gray-500 placeholder:text-sm'
            }
          />
          <Button
            onClick={handleSearch}
            className={'rounded-l-none rounded-r-md bg-black p-1 px-2'}
          >
            <img src="/src/assets/search.png" alt="" className={'h-5 w-5'} />
          </Button>
        </div>

        {authStatus ? (
          <div className="flex items-center gap-8">
            <div className="text-md relative flex items-center gap-2">
              <img
                src={fileUrl || '/src/assets/avatar.png'}
                alt=""
                className="h-10 w-10 rounded-full object-contain"
              />
              <h1>{`Hey! ${userData?.name || 'Guest'}`}</h1>
            </div>
            <div className="relative">
              <HiMenu
                className="h-6 w-6 cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              />
              {showOptions && (
                <div className="absolute right-0 top-8 flex w-32 flex-col gap-2 rounded-lg border border-gray-300 bg-gray-50 px-5 py-2 text-gray-900 shadow-sm">
                  <p
                    className="hover:cursor-pointer"
                    onClick={() => {
                      navigate('/library');
                      setShowOptions(false);
                    }}
                  >
                    Library
                  </p>
                  <p
                    className="hover:cursor-pointer"
                    onClick={() => {
                      navigate('/add-blog');
                      setShowOptions(false);
                    }}
                  >
                    Add Blog
                  </p>
                </div>
              )}
            </div>

            <Button
              className={'text-md my-auto bg-black text-white'}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-10">
            <Button
              className={'text-md bg-transparent'}
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button
              className={'text-md bg-black text-white'}
              onClick={() => navigate('/sign-up')}
            >
              Sign Up
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
