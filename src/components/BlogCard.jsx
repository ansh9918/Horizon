import { FiHeart } from 'react-icons/fi';
import { format } from 'date-fns';
import { Link } from 'react-router';
import service from '../appwrite/service';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from './Button';

const BlogCard = ({ blog, showEditButton }) => {
  console.log(blog);
  const userData = useSelector((state) => state.auth.userData);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
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
  }, [blog.$id, userData.$id]);

  const addFavourite = async () => {
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
      <div className="relative flex w-full cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 bg-gray-100 p-4 shadow-md">
        <img
          src={blog.featuredImageUrl}
          alt=""
          className="h-44 w-full rounded-lg object-cover"
        />
        <p className="text-sm font-medium text-gray-500">
          {blog.$createdAt
            ? format(new Date(blog.$createdAt), 'MMMM d, yyyy')
            : 'Unknown Date'}
        </p>
        <h1 className="text-2xl font-semibold text-gray-800">{blog.title}</h1>
        <p className="line-clamp-3 leading-6 text-gray-700">{blog.content}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={blog.authorImage}
              alt=""
              className="h-12 w-12 rounded-full"
            />
            <p className="font-medium text-gray-800">{blog.author}</p>
          </div>

          <FiHeart
            className={`h-5 w-5 cursor-pointer text-2xl transition-colors ${
              isFavorite ? 'fill-red-700 text-red-700' : 'bg-transparent'
            }`}
            onClick={(e) => {
              e.preventDefault(); // Prevents navigating to the blog post when clicking the heart icon
              addFavourite();
            }}
          />
        </div>
        <div className="absolute left-6 top-6 rounded-full bg-white/20 p-1 px-2 backdrop-blur-lg">
          <p className="text-sm font-medium text-white">{blog.category}</p>
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
