import { Input, Button } from '../index';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import service from '../../appwrite/service';
import authService from '../../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginStore } from '../../redux/AuthSlice';
import { toast } from 'react-toastify';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState({
    file: null,
    url: '',
  });
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar({
        file,
        url: URL.createObjectURL(file),
      });
    }
  };
  const signInForm = async (data) => {
    try {
      setError('');
      let fileUpload;
      if (avatar.file) {
        fileUpload = await service.UploadFile(avatar.file);
        console.log(fileUpload);
        if (fileUpload.error) {
          toast.error(fileUpload.error.message);
          return;
        }
      }

      const { name, email, password } = data;
      const user = await authService.createAccount({
        name,
        email,
        password,
        profilePhoto: fileUpload ? fileUpload.$id : null,
      });
      console.log(user);
      dispatch(loginStore(user));
      navigate('/');

      reset();
      toast.success('Account created successfully');
    } catch (error) {
      console.log('Error creating account:', error);
      toast.error(error.message);
    }
  };
  return (
    <section className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full items-center justify-center">
        <div
          className={`mx-auto w-full max-w-lg rounded-xl border border-gray-300 bg-white p-10 shadow-lg`}
        >
          <h2 className="text-center text-3xl font-semibold leading-tight text-gray-800">
            Create an account
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Already have an account?&nbsp;
            <Link
              to="/login"
              className="font-medium text-blue-600 transition-all duration-200 hover:underline"
            >
              Sign In
            </Link>
          </p>

          <form className="mt-8" onSubmit={handleSubmit(signInForm)}>
            <div className="flex flex-col justify-center gap-4">
              <div className="flex items-center justify-center gap-5">
                <img
                  src={avatar.url || './assets/avatar.png'}
                  className="h-12 w-12 rounded-full object-cover"
                  alt=""
                />
                <Input
                  label={'Upload an image'}
                  labelClass={'underline font-medium'}
                  type={'file'}
                  className={'hidden'}
                  onChange={handleAvatar}
                />
              </div>

              <Input
                label={'Name: '}
                placeholder={'Enter your name'}
                type={'text'}
                className={'p-[6px] px-3'}
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              <Input
                label={'Email: '}
                placeholder={'Enter your email'}
                type={'email'}
                className={'p-[6px] px-3'}
                {...register('email', {
                  required: 'Email is required',
                  validate: {
                    matchPatern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value,
                      ) || 'Email address must be a valid address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              <Input
                label={'Password: '}
                type={'password'}
                placeholder={'Enter your password'}
                className={'p-[6px] px-3'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
              <Button
                type={'submit'}
                disabled={isSubmitting}
                className={'mx-auto bg-blue-600 text-white'}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
