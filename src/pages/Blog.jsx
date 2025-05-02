import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import service from '../appwrite/service';
import Loader from '../components/Loader';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FiHeart } from 'react-icons/fi';
import HTMLReactParser from 'html-react-parser/lib/index';

const Blog = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);
  const [allResult, setAllResult] = useState([]);

  const { slug } = useParams();
  const userData = useSelector((state) => state.auth.userData);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!userData?.$id || !result?.$id) return;
      try {
        const favorites = await service.getFavouriteBlogs(userData.$id);
        const isFav = favorites.some((fav) => fav.$id === result.$id);
        setIsFavorite(isFav);
      } catch (error) {
        console.error('Error checking favorites:', error);
      }
    };

    checkFavorite();
  }, [result?.$id, userData?.$id]);

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

  console.log(result.content);

  return (
    <section className="flex min-h-screen animate-slideup flex-col gap-10 px-4 py-10 md:px-10 lg:px-40">
      <div className="flex flex-col gap-10">
        {/* Blog Header */}
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-3xl font-semibold capitalize md:text-4xl lg:text-5xl">
            {result.title}
          </h1>
          <div className="flex w-full items-center justify-between">
            <p className="font-medium text-gray-600">
              {result.$createdAt
                ? format(
                    new Date(result.$createdAt),
                    'MMMM d, yyyy',
                  ).toUpperCase()
                : 'Invalid Time'}
            </p>
            <FiHeart
              className={`h-6 w-6 cursor-pointer text-2xl transition-colors ${
                isFavorite ? 'fill-red-700 text-red-700' : 'bg-transparent'
              }`}
              onClick={(e) => {
                e.preventDefault();
                addFavourite();
              }}
            />
          </div>
        </div>

        {/* Featured Image */}
        <img
          src={result.featuredImageUrl}
          alt="Featured"
          className="h-[30vh] w-full rounded-lg object-cover md:h-[45vh] lg:h-[60vh]"
        />

        {/* Blog Content */}
        <div className="prose max-w-none">
          {HTMLReactParser(`${result.content}`)}
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-5 border-t border-gray-200 pt-5">
          <img
            src={result.authorImage}
            alt="Author"
            className="h-14 w-14 rounded-full"
          />
          <div>
            <p className="font-medium">{result.author}</p>
            <h4 className="rounded-full bg-gray-300 p-1 px-2 text-center text-sm font-medium md:p-2 md:px-4 md:text-base">
              {result.category}
            </h4>
          </div>
        </div>

        {/* Related Blogs */}
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-semibold">Related Blogs</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allResult.map((blog) => (
              <Link key={blog.$id} to={`/post/${blog.slug}`} className="group">
                <div className="flex flex-col gap-3 rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
                  <img
                    src={blog.featuredImageUrl}
                    alt="Blog Thumbnail"
                    className="h-[20vh] w-full rounded-lg object-cover"
                  />
                  <p className="text-sm text-gray-500">
                    {format(
                      new Date(blog.$createdAt),
                      'MMMM d, yyyy',
                    ).toUpperCase()}
                  </p>
                  <h3 className="text-lg font-medium capitalize">
                    {blog.title}
                  </h3>
                  <div className="prose line-clamp-3 text-gray-700">
                    {HTMLReactParser(blog.content)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
