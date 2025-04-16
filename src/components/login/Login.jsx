import { Link } from 'react-router';
import { Input, Button } from '../index';
import { useForm } from 'react-hook-form';
import authService from '../../appwrite/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { login } from '../../redux/AuthSlice';
import service from '../../appwrite/service';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginForm = async (data) => {
    try {
      setError('');

      const { email, password } = data;
      const user = await authService.login({
        email,
        password,
      });
      const userdata = await service.getUser(user.$id);
      //console.log(userdata);
      dispatch(login(userdata));
      navigate('/');

      reset();
      toast.success('Logged In');
    } catch (error) {
      console.log('Error logging:', error);
      toast.error(error.message);
    }
  };
  return (
    <section className="flex h-[80vh] items-center justify-center bg-gray-50">
      <div className="flex w-full items-center justify-center">
        <div
          className={`mx-auto w-full max-w-lg rounded-xl border border-gray-300 bg-white p-10 shadow-lg`}
        >
          <h2 className="text-center text-3xl font-semibold leading-tight text-gray-800">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-base text-gray-600">
            Don&apos;t have an account?&nbsp;
            <Link
              to="/sign-up"
              className="font-medium text-blue-600 transition-all duration-200 hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <form className="mt-8" onSubmit={handleSubmit(loginForm)}>
            <div className="flex flex-col justify-center gap-5">
              <Input
                label={'Email: '}
                placeholder={'Enter your email'}
                type={'email'}
                className={'p-2 px-3'}
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
                className={'p-2 px-3'}
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

export default Login;
