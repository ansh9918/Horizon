import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Search from './pages/Search.jsx';
import AllBlogs from './pages/AllBlogs.jsx';
import About from './pages/About.jsx';
import AddBlog from './pages/AddBlog.jsx';
import Library from './pages/Library.jsx';
import store from './redux/store.js';
import { Provider } from 'react-redux';
import Blog from './pages/Blog.jsx';
import EditBlogs from './pages/EditBlogs.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/all-blogs',
        element: <AllBlogs />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/sign-up',
        element: <SignUp />,
      },
      {
        path: '/search',
        element: <Search />,
      },
      {
        path: '/about-us',
        element: <About />,
      },
      {
        path: '/library',
        element: <Library />,
      },
      {
        path: '/add-blog',
        element: <AddBlog />,
      },
      {
        path: '/edit-post/:slug',
        element: <EditBlogs />,
      },
      {
        path: '/post/:slug',
        element: <Blog />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
