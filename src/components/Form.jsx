import { useForm, Controller } from 'react-hook-form';
import { useCallback, useEffect, useState, useId, useRef } from 'react';
import service from '../appwrite/service';
import { Input, Button, Select } from './index';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';
import conf from '../conf/conf';

const Form = ({ post }) => {
  const id = useId();
  const {
    register,
    control,
    handleSubmit: onSubmit,
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      slug: '',
      status: 'active',
      category: '',
    },
  });
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [previewImage, setPreviewImage] = useState('');
  const editorRef = useRef(null);

  useEffect(() => {
    if (post) {
      // Reset form with post values when editing
      reset({
        title: post.title || '',
        content: post.content || '',
        slug: post.slug || '',
        status: post.status || 'active',
        category: post.category || '',
      });

      // Set preview image for editing
      if (post.featuredImage) {
        service
          .getfilePreview(post.featuredImage)
          .then((url) => setPreviewImage(url))
          .catch((err) => console.error('Error fetching file preview:', err));
      }
    } else {
      // Reset to empty form for new post
      reset({
        title: '',
        content: '',
        slug: '',
        status: 'active',
        category: '',
      });
      setPreviewImage('');
    }
  }, [post, reset]);

  const formSubmit = async (data) => {
    try {
      const file = data.image?.[0]
        ? await service.UploadFile(data.image[0])
        : null;

      if (post) {
        // Update post
        if (file) await service.deleteFile(post.featuredImage);
        const updatedPost = await service.updatePost(post.$id, {
          ...data,
          featuredImage: file?.$id,
        });
        if (updatedPost) navigate(`/post/${updatedPost.slug}`);
        toast.success('Blog Updated');
      } else {
        // Create new post
        const newPost = await service.createPost({
          ...data,
          userId: userData.$id,
          featuredImage: file?.$id || null,
        });
        if (newPost) navigate(`/post/${newPost.slug}`);
        toast.success('Blog Added');
      }

      reset(); // Clear the form after submission
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message);
    }
  };

  const slugTransform = useCallback((value) => {
    return value
      ? value
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s]+/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
      : '';
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        const newSlug = slugTransform(value.title);
        setValue('slug', newSlug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <section className="rounded-lg bg-white p-6">
      <form onSubmit={onSubmit(formSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <Select
            options={['Places', 'LifeStyle', 'Food', 'Tips&Tricks']}
            label={'Category'}
            className={'w-full rounded-md border border-gray-300 p-2'}
            {...register('category', { required: true })}
          />
          <Input
            label={'Title :'}
            placeholder={'Title'}
            className={'w-full rounded-md border border-gray-300 p-2'}
            {...register('title', { required: 'Title is required' })}
          />
          <Input
            label={'Slug :'}
            placeholder={'Slug'}
            className={'w-full rounded-md border border-gray-300 p-2'}
            {...register('slug', { required: 'Slug is required' })}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor={id}>Content :</label>
            <Controller
              name="content"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Editor
                  apiKey={conf.tinymceKey}
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  value={value}
                  initialValue={getValues('content')}
                  init={{
                    initialValue: getValues('content'),
                    height: 500,
                    menubar: true,
                    plugins: [
                      'image',
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'code',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                      'code',
                      'help',
                      'wordcount',
                      'anchor',
                    ],
                    toolbar:
                      'undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |removeformat | help',
                    content_style:
                      'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  }}
                  onEditorChange={onChange}
                />
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <Input
            label={'Featured Image :'}
            type={'file'}
            className={'w-full rounded-md border border-gray-300 p-2'}
            accept={'image/png, image/jpg, image/jpeg, image/gif, image/webp'}
            {...register('image')}
          />
          {previewImage && (
            <div className="mx-auto mt-4">
              <img
                src={previewImage}
                alt={post?.title || 'Preview'}
                className={'h-[60vh] w-[60vw] rounded-lg object-center'}
              />
            </div>
          )}
          <Select
            options={['active', 'inactive']}
            label={'Status'}
            className={'w-full rounded-md border border-gray-300 p-2'}
            {...register('status', { required: true })}
          />
          <Button
            type={'submit'}
            className={'mx-auto rounded-md bg-blue-500 p-2 px-7 text-white'}
          >
            {post ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Form;
