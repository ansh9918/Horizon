import { useEffect, useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { BlogCard } from '../components/index';
import service from '../appwrite/service';
import { useSelector } from 'react-redux';
import { Query } from 'appwrite';

const Library = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [libraryBlogs, setLibraryBlogs] = useState([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showYourBlogs, setShowYourBlogs] = useState(false);
  const [showBlogs, setShowBlogs] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await service.getFavouriteBlogs(userData.$id);
        console.log('response: ', response);
        setLibraryBlogs(response || []); // Handle null/undefined response
      } catch (error) {
        console.error('Error fetching favorite blogs:', error);
        setLibraryBlogs([]); // Handle error by setting an empty array
      }
    };

    if (userData) {
      fetchLibrary();
    }
  }, [userData]);

  useEffect(() => {
    const blog = async () => {
      try {
        const response = await service.getPosts([
          Query.equal('userId', userData.$id),
        ]);

        if (response && response.documents) {
          const blogDetails = await Promise.all(
            response.documents.map(async (blogDoc) => {
              try {
                const featuredImageUrl = await service.getfilePreview(
                  blogDoc.featuredImage,
                );
                // Fetch user details for the blog's author
                const author = await service.getUser(blogDoc.userId);
                const profilePhotoUrl = await service.getfilePreview(
                  author.profilePhoto,
                );

                return {
                  ...blogDoc,
                  featuredImageUrl,
                  author: author.name,
                  authorImage: profilePhotoUrl,
                };
              } catch (err) {
                console.error(
                  `Error processing blog with ID ${blogDoc.$id}:`,
                  err,
                );
                return null; // Skip if there's an error for a particular blog
              }
            }),
          );

          // Filter out any null values in case of errors
          setShowBlogs(blogDetails.filter((blog) => blog !== null));
        } else {
          setShowBlogs([]); // Handle empty or invalid response
        }
      } catch (error) {
        console.error('Error fetching your blogs:', error);
        setShowBlogs([]); // Handle error by setting an empty array
      }
    };

    if (userData) {
      blog();
    }
  }, [userData]);

  return (
    <div className="h-auto space-y-14 p-4 py-6 transition-all duration-300">
      <div
        onClick={() => setShowLibrary(!showLibrary)}
        className="flex w-full items-center justify-between rounded-lg border-b border-b-gray-300 p-1 shadow-md hover:bg-gray-100 lg:p-2"
      >
        <h1 className="text-lg font-semibold md:text-xl lg:text-2xl">
          Library:{' '}
        </h1>
        {showLibrary ? (
          <BiChevronUp className="text-2xl" />
        ) : (
          <BiChevronDown className="text-2xl" />
        )}
      </div>
      {showLibrary && (
        <div className="mt-2 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {libraryBlogs.map((blog) => (
            <BlogCard key={blog.$id} blog={blog} />
          ))}
        </div>
      )}

      <div
        onClick={() => setShowYourBlogs(!showYourBlogs)}
        className="flex w-full items-center justify-between rounded-lg border-b border-b-gray-300 p-1 shadow-md hover:bg-gray-100 lg:p-2"
      >
        <h1 className="text-lg font-semibold md:text-xl lg:text-2xl">
          Your Blogs:{' '}
        </h1>
        {showYourBlogs ? (
          <BiChevronUp className="text-2xl" />
        ) : (
          <BiChevronDown className="text-2xl" />
        )}
      </div>
      {showYourBlogs && (
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {showBlogs.map((blog) => (
            <BlogCard key={blog.$id} blog={blog} showEditButton={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
