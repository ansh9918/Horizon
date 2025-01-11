import { useSearchParams } from 'react-router';
import Loader from './Loader';
import { useEffect, useState } from 'react';
import service from '../appwrite/service';
import BlogCard from './BlogCard';

const SearchBlog = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await service.getPosts();

        const filteredBlogs = response.documents.filter((blog) =>
          blog.title.toLowerCase().includes(query.toLowerCase()),
        );

        const enrichedBlogs = await Promise.all(
          filteredBlogs.map(async (blog) => {
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
                author: user.name,
                authorImage: profilePhotoUrl,
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

        setResult(enrichedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [query]);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="min-h-screen animate-slideup p-4 py-6">
      <div>
        <h1 className="text-2xl font-medium">
          Search Results: &quot;{query}&quot;
        </h1>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {result.length > 0 ? (
          result.map((blog) => <BlogCard key={blog.$id} blog={blog} />)
        ) : (
          <p className="text-gray-500">
            No blogs found for &quot;{query}&quot;.
          </p>
        )}
      </div>
    </section>
  );
};

export default SearchBlog;
