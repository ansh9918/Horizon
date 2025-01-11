import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import service from '../appwrite/service';
import { Form } from '../components';

const EditBlogs = () => {
  const [posts, setPosts] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      service.getPostBySlug(slug).then((post) => {
        console.log(post);
        if (post) {
          setPosts(post);
        }
      });
    } else {
      navigate('/');
    }
  }, [slug, navigate]);
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-3xl font-semibold">Edit Blog</h1>

        <Form post={posts} />
      </div>
    </section>
  );
};

export default EditBlogs;
