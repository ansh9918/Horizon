import { useEffect, useState } from 'react';
import { BlogCard } from '../index';
import service from '../../appwrite/service';

const Blog = () => {
  const [selected, setSelected] = useState('All');
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  const categories = ['All', 'LifeStyle', 'Places', 'Food', 'Tips&Tricks'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await service.getPosts();
        const blogsInfo = await Promise.all(
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
        setBlogs(blogsInfo);
        setFilteredBlogs(blogsInfo); // Initialize filteredBlogs
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    // Filter and sort blogs when `selected` or `sortOrder` changes
    let updatedBlogs = blogs;

    // Filter by category
    if (selected !== 'All') {
      updatedBlogs = updatedBlogs.filter((blog) => blog.category === selected);
    }

    setFilteredBlogs(updatedBlogs);
  }, [selected, blogs]);

  return (
    <section className="mt-5 min-h-screen animate-slideup p-1 py-6 md:p-4">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <p className="mt-4 text-gray-600">
        Here we share tips, news, and stories to inspire your adventures.
      </p>
      <div className="mt-4 flex justify-between px-2">
        <div>
          <ul className="grid grid-cols-3 gap-1 md:flex md:gap-5 lg:gap-10">
            {categories.map((category) => (
              <li
                key={category}
                className={`cursor-pointer rounded-lg p-2 text-center text-sm transition-all duration-500 md:text-base ${
                  selected === category
                    ? 'border border-gray-300 bg-gray-200'
                    : 'border-none bg-transparent'
                }`}
                onClick={() => setSelected(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {filteredBlogs.map((blog) => (
          <BlogCard key={blog.$id} blog={blog} showEditButton={false} />
        ))}
      </div>
    </section>
  );
};

export default Blog;
