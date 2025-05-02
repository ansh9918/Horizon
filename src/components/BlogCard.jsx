import { FiHeart } from 'react-icons/fi';
import { format } from 'date-fns';
import { Link } from 'react-router';
import service from '../appwrite/service';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from './Button';
import HTMLReactParser from 'html-react-parser/lib/index';

const BlogCard = ({ blog, showEditButton }) => {
  const userData = useSelector((state) => state.auth.userData);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (userData?.$id && blog?.$id) {
      const checkFavorite = async () => {
        try {
          const favorites = await service.getFavouriteBlogs(userData.$id);
          const isFav = favorites.some((fav) => fav.$id === blog.$id);
          setIsFavorite(isFav);
        } catch (error) {
          console.error('Error checking favorites:', error);
        }
      };

      checkFavorite();
    }
  }, [blog?.$id, userData?.$id]);

  const addFavourite = async () => {
    if (!userData?.$id || !blog?.$id) {
      console.error('User data or blog data is missing');
      return;
    }

    try {
      if (isFavorite) {
        await service.removeFavouriteBlogs(userData.$id, blog.$id);
        toast.warning('Removed from Favourites');
        setIsFavorite(false);
      } else {
        await service.addFavouriteBlog(userData.$id, blog.$id);
        toast.success('Added to Favourites');
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <Link to={`/post/${blog.slug}`}>
      <div className="relative flex w-full cursor-pointer flex-col gap-1 rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-sm transition-shadow hover:shadow-md lg:gap-2">
        <img
          src={blog.featuredImageUrl}
          alt=""
          className="h-28 rounded-lg object-cover md:h-32 md:w-full lg:h-44"
        />
        <p className="text-[11px] font-medium text-gray-500 md:text-sm">
          {blog.$createdAt
            ? format(new Date(blog.$createdAt), 'MMMM d, yyyy')
            : 'Unknown Date'}
        </p>
        <h1 className="line-clamp-2 text-lg font-medium text-gray-800 md:text-xl lg:text-2xl">
          {blog.title}
        </h1>
        <div className="prose line-clamp-3 text-gray-700">
          {HTMLReactParser(`${blog.content}`)}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={blog.authorImage}
              alt=""
              className="h-8 w-8 rounded-full md:h-12 md:w-12"
            />
            <p className="text-sm font-medium text-gray-800 md:text-base">
              {blog.author}
            </p>
          </div>

          <FiHeart
            className={`h-4 w-4 cursor-pointer text-2xl transition-colors md:h-5 md:w-5 ${
              isFavorite ? 'fill-red-700 text-red-700' : 'bg-transparent'
            }`}
            onClick={(e) => {
              e.preventDefault(); // Prevents navigating to the blog post when clicking the heart icon
              addFavourite();
            }}
          />
        </div>
        <div className="absolute left-6 top-6 rounded-full bg-white/20 p-1 px-2 backdrop-blur-lg">
          <p className="text-xs font-medium text-white md:text-sm">
            {blog.category}
          </p>
        </div>
        {showEditButton && (
          <Link to={`/edit-post/${blog.slug}`} className="mx-auto">
            <Button className={'bg-blue-500 p-1 px-4 text-white'}>Edit</Button>
          </Link>
        )}
      </div>
    </Link>
  );
};

export default BlogCard;
