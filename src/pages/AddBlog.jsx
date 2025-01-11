import { Form } from '../components/index';

const AddBlog = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-3xl font-semibold">
          Add New Blog
        </h1>

        <Form />
      </div>
    </section>
  );
};

export default AddBlog;
