import { useEffect, useState } from 'react';
import service from '../../appwrite/service';
import { Query } from 'appwrite';
import Loader from '../Loader';
import { format } from 'date-fns';

const FeaturedBlog = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      const cachedBlogs = JSON.parse(localStorage.getItem('featuredBlogs'));
      const lastFetchedDate = localStorage.getItem('lastFetchedDate');
      const today = new Date().toISOString().split('T')[0]; // Get today's date

      if (cachedBlogs && lastFetchedDate === today) {
        setFeaturedBlogs(cachedBlogs);
        setLoading(false);
        return;
      }
      try {
        const response = await service.getPosts([
          Query.orderDesc('$createdAt'), // Order by createdAt descending
          Query.limit(3), // Limit to 3 documents
        ]);
        const blogsWithPreviews = await Promise.all(
          response.documents.map(async (blog) => {
            try {
              // Fetch the featured image URL
              const featuredImageUrl = await service.getfilePreview(
                blog.featuredImage,
              );

              // Fetch the user details
              const user = await service.getUser(blog.userId);
              const profilePhotoUrl = await service.getfilePreview(
                user.profilePhoto,
              );
              // Return a combined object
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

        setFeaturedBlogs(blogsWithPreviews);
        setLoading(false);
        localStorage.setItem(
          'featuredBlogs',
          JSON.stringify(blogsWithPreviews),
        );
        localStorage.setItem('lastFetchedDate', today);
      } catch (error) {
        console.error('Error fetching featured blogs:', error);
        setLoading(false);
      }
    };
    console.log('info:', featuredBlogs);

    fetchFeaturedBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading && featuredBlogs.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === featuredBlogs.length - 1) {
            return 0;
          }

          return prev + 1;
        });
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [loading, featuredBlogs]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <section
      className="flex h-[80vh] w-full animate-slowfade items-end rounded-lg bg-cover object-cover p-4 py-6 transition-all duration-1000"
      style={{
        backgroundImage: `url(${featuredBlogs[currentIndex].featuredImageUrl})`,
      }}
    >
      <div className="flex w-full justify-between">
        <div className="flex w-1/2 flex-col gap-5">
          <div className="mr-auto rounded-full bg-white/15 p-2 px-4 text-center backdrop-blur-lg">
            <p className="text-sm font-medium tracking-wide text-white">
              {featuredBlogs[currentIndex].category}
            </p>
          </div>
          <h1 className="text-3xl font-semibold text-white">
            {featuredBlogs[currentIndex].title}
          </h1>
          <p className="line-clamp-3 w-[60%] text-white">
            {featuredBlogs[currentIndex].content}
          </p>
          <div className="flex items-center gap-2">
            {featuredBlogs.map((_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full border border-white transition-colors duration-1000 ${currentIndex === index ? 'bg-white' : 'bg-transparent'}`}
              ></div>
            ))}
          </div>
        </div>
        <div className="mr-3 flex w-1/2 items-center justify-end font-medium text-white">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={featuredBlogs[currentIndex].authorImage}
                alt="Author"
                className="h-10 w-10 rounded-full bg-cover bg-center"
              />
              <h1 className="">{featuredBlogs[currentIndex].author}</h1>
            </div>
            <p className="text-xs">
              {format(
                new Date(featuredBlogs[currentIndex].$createdAt),
                'MMMM d, yyyy, h:mm a',
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlog;
