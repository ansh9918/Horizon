import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import service from '../appwrite/service';
import Loader from '../components/Loader';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiHeart } from 'react-icons/fi';

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);
  const [allResult, setAllResult] = useState([]);

  const { slug } = useParams();
  const userData = useSelector((state) => state.auth.userData);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorites = await service.getFavouriteBlogs(userData.$id);
        const isFav = favorites.some((fav) => fav.$id === result.$id);
        setIsFavorite(isFav);
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    };

    checkFavorite();
  }, [result.$id, userData.$id]);

  const addFavourite = async () => {
    try {
      if (isFavorite) {
        await service.removeFavouriteBlogs(userData.$id, result.$id);
        toast.warning('Removed from Favourites');
        setIsFavorite(false);
      } else {
        await service.addFavouriteBlog(userData.$id, result.$id);
        toast.success('Added to Favourites');
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await service.getPostBySlug(slug);
        let blog;
        try {
          const featuredImageUrl = await service.getfilePreview(
            response.featuredImage,
          );

          const user = await service.getUser(response.userId);
          const profilePhotoUrl = await service.getfilePreview(
            user.profilePhoto,
          );

          blog = {
            ...response,
            featuredImageUrl,
            author: user.name,
            authorImage: profilePhotoUrl,
          };
        } catch (error) {
          console.error(`Error processing blog :`, error);
          blog = {
            ...response,
            featuredImageUrl: null,
            author: 'Unknown',
            authorImage: null,
          };
        }

        setResult(blog);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAllBlogs = async () => {
      try {
        const response = await service.getPosts();
        const blogsWithPreviews = await Promise.all(
          response.documents.map(async (blog) => {
            try {
              const featuredImageUrl = await service.getfilePreview(
                blog.featuredImage,
              );

              const user = await service.getUser(blog.userId);
              const profilePhotoUrl = await service.getfilePreview(
                user.profilePhoto,
              );

              return {
                ...blog,
                featuredImageUrl,
                author: user.name, // Adjust based on the actual structure of `response2`
                authorImage: profilePhotoUrl, // Adjust if your user data includes an image
              };
            } catch (error) {
              console.error(`Error processing blog ${blog.$id}:`, error);
              return {
                ...blog,
                featuredImageUrl: null,
                author: 'Unknown',
                authorImage: null,
              };
            }
          }),
        );

        setAllResult(blogsWithPreviews);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured blogs:', error);
        setLoading(false);
      }
    };

    fetchAllBlogs();

    fetchBlogs();
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="flex min-h-screen animate-slideup flex-col gap-10 px-4 py-10 md:px-10 lg:px-28">
      <div className="flex flex-col gap-7 lg:flex-row">
        <div className="flex w-full flex-col space-y-10 lg:w-3/4">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold capitalize md:text-4xl lg:text-5xl">
                {result.title}
              </h1>
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

            <p className="mt-3 font-medium">
              {result.$createdAt
                ? format(
                    new Date(result.$createdAt),
                    'MMMM d, yyyy',
                  ).toUpperCase()
                : 'Invalid Time'}
            </p>
            <img
              src={result.featuredImageUrl}
              alt=""
              className="mt-4 h-[30vh] rounded-lg md:h-[45vh] lg:h-[60vh]"
            />
            <p className="mt-5">{result.content}</p>
          </div>
          <div className="flex w-full flex-col items-start gap-5 pt-10 lg:hidden lg:w-1/4">
            <h4 className="rounded-full bg-gray-300 p-1 px-2 text-center text-sm font-medium md:p-2 md:px-4 md:text-base">
              {result.category}
            </h4>
            <div className="flex items-center gap-5">
              <img
                src={result.authorImage}
                alt=""
                className="h-14 w-14 rounded-full"
              />
              <p className="font-medium">{result.author}</p>
            </div>
          </div>
          <div className="flex flex-col gap-5 border-t border-t-gray-200 py-3">
            {allResult.map((blog) => (
              <div
                key={blog.$id}
                className="flex flex-col gap-5 border-b border-b-gray-200 py-5 md:flex-row"
              >
                <img
                  src={blog.featuredImageUrl}
                  alt=""
                  className="h-[20vh] w-full rounded-lg md:h-[30vh] md:w-1/3"
                />
                <div className="flex w-full flex-col gap-2 md:w-2/3">
                  <p className="text-sm">
                    {format(
                      new Date(blog.$createdAt),
                      'MMMM d, yyyy',
                    ).toUpperCase()}
                  </p>
                  <h1 className="text-lg font-medium capitalize md:text-xl">
                    {blog.title}
                  </h1>
                  <p className="line-clamp-3">{blog.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden w-full flex-col items-start gap-5 pt-10 lg:flex lg:w-1/4">
          <h4 className="rounded-full bg-gray-300 p-1 px-2 text-center text-sm font-medium md:p-2 md:px-4 md:text-base">
            {result.category}
          </h4>
          <div className="flex items-center gap-5">
            <img
              src={result.authorImage}
              alt=""
              className="h-14 w-14 rounded-full"
            />
            <p className="font-medium">{result.author}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
