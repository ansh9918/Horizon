import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../index';
import { useEffect, useState } from 'react';
import { HiMenu } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import { logout } from '../../redux/AuthSlice';
import service from '../../appwrite/service';
import { Link } from 'react-router';
import { IoClose } from 'react-icons/io5';

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
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/');
      setShowOptions(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderNavItems = () => (
    <ul className="text-md hidden transition-all duration-500 md:gap-5 lg:flex lg:gap-10">
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
  );

  const searchDiv = () => (
    <div className="flex w-full md:w-auto">
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
          'rounded-lg bg-white/20 p-1 text-xs font-medium text-black placeholder-gray-500 placeholder:text-xs md:rounded-r-none md:px-3 md:placeholder:text-sm'
        }
      />
      <Button
        onClick={handleSearch}
        className={
          'hidden rounded-l-none rounded-r-md bg-black p-1 px-2 md:block'
        }
      >
        <img
          src="/assets/search.png"
          alt="Search"
          className={'h-3 w-3 md:h-5 md:w-5'}
        />
      </Button>
    </div>
  );

  const infoDiv = () => (
    <div className="text-md relative flex items-center gap-2">
      <img
        src={fileUrl || '/assets/avatar.png'}
        alt="Profile"
        className="hidden h-10 w-10 rounded-full object-contain md:block"
      />
      <h1 className="hidden lg:block">{`Hey! ${userData?.name || 'Guest'}`}</h1>
    </div>
  );

  return (
    <header className="z-20 w-full rounded-lg border border-gray-700 bg-white px-4 py-4 text-black shadow-xl backdrop-blur-lg">
      <nav className="flex items-center justify-around gap-3 md:gap-5">
        <Link to={'/'}>
          <h1 className="cursor-pointer text-lg font-semibold md:text-xl lg:text-2xl">
            Horizon
          </h1>
        </Link>

        {renderNavItems()}

        {searchDiv()}

        {authStatus ? (
          <div className="relative flex items-center gap-3 md:gap-6 lg:gap-8">
            <div className="flex items-center gap-5 lg:gap-10">
              {infoDiv()}
              <HiMenu
                className="h-6 w-6 cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              />
              {showOptions ? (
                <div className="absolute -right-6 -top-6 z-50 flex h-screen w-[60vw] animate-slideright flex-col gap-5 rounded-l-lg bg-white p-5 shadow-lg backdrop-blur-xl transition-all duration-200 md:-right-14 md:w-[50vw] lg:right-10 lg:top-10 lg:h-auto lg:w-36 lg:rounded-lg lg:p-2">
                  {/* User Info Section */}
                  <div className="relative flex flex-col gap-5">
                    <div className="flex items-center gap-3 border-b border-gray-700 pb-3 lg:hidden">
                      <img
                        src={fileUrl || '/assets/avatar.png'}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <h1 className="text-lg font-semibold text-black">
                        {userData?.name || 'Guest'}
                      </h1>
                      <IoClose
                        className="absolute right-0 top-0 rounded-full bg-slate-700 p-1 text-2xl text-white"
                        onClick={() => {
                          setShowOptions(false);
                        }}
                      />
                    </div>

                    {/* Navigation Items */}
                    <ul className="mt-5 flex flex-col gap-4 text-black lg:hidden">
                      {navItems.map(
                        (item) =>
                          item.active && (
                            <li
                              key={item.slug}
                              className="cursor-pointer rounded-md px-3 py-2 transition-all duration-200 hover:underline"
                              onClick={() => {
                                navigate(item.slug);
                                setShowOptions(false);
                              }}
                            >
                              {item.name}
                            </li>
                          ),
                      )}
                    </ul>

                    {/* Additional Links */}
                    <ul className="flex flex-col gap-4 text-black">
                      <li
                        className="cursor-pointer rounded-md px-3 py-2 transition-all duration-200 hover:underline"
                        onClick={() => {
                          navigate('/library');
                          setShowOptions(false);
                        }}
                      >
                        Library
                      </li>
                      <li
                        className="cursor-pointer rounded-md px-3 py-2 transition-all duration-200 hover:bg-gray-800 hover:underline"
                        onClick={() => {
                          navigate('/add-blog');
                          setShowOptions(false);
                        }}
                      >
                        Add Blog
                      </li>
                    </ul>

                    {/* Logout Button */}
                    <Button
                      className="mt-10 w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white lg:hidden"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
            <Button
              className={
                'my-auto hidden bg-black px-2 py-1 text-sm text-white md:block md:text-lg'
              }
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-10">
              <HiMenu
                className="h-6 w-6 cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              />
              {showOptions ? (
                <div className="absolute -right-2 -top-2 z-50 flex h-screen w-[60vw] animate-slideright flex-col gap-5 rounded-l-lg bg-white p-5 shadow-lg backdrop-blur-xl transition-all duration-200 md:-top-2 md:w-[50vw] lg:right-10 lg:top-10 lg:h-auto lg:w-36 lg:rounded-lg lg:p-2">
                  {/* User Info Section */}
                  <div className="relative flex flex-col gap-5">
                    <div className="flex items-center gap-3 border-b border-gray-700 pb-3 lg:hidden">
                      <img
                        src={fileUrl || '/assets/avatar.png'}
                        alt="Profile"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <h1 className="text-lg font-semibold text-black">
                        {userData?.name || 'Guest'}
                      </h1>
                      <IoClose
                        className="absolute right-0 top-0 rounded-full bg-slate-700 p-1 text-2xl text-white"
                        onClick={() => {
                          setShowOptions(false);
                        }}
                      />
                    </div>

                    {/* Navigation Items */}
                    <ul className="mt-5 flex flex-col gap-4 text-black lg:hidden">
                      {navItems.map(
                        (item) =>
                          item.active && (
                            <li
                              key={item.slug}
                              className="cursor-pointer rounded-md px-3 py-2 transition-all duration-200 hover:underline"
                              onClick={() => {
                                navigate(item.slug);
                                setShowOptions(false);
                              }}
                            >
                              {item.name}
                            </li>
                          ),
                      )}
                    </ul>
                    <Button
                      className={'text-md block bg-transparent md:hidden'}
                      onClick={() => navigate('/login')}
                    >
                      Log In
                    </Button>
                    <Button
                      className={'text-md block bg-black text-white md:hidden'}
                      onClick={() => navigate('/sign-up')}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              ) : null}
              <Button
                className={'text-md hidden bg-transparent md:block'}
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button
                className={'text-md hidden bg-black text-white md:block'}
                onClick={() => navigate('/sign-up')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
