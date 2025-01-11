import { useForm } from 'react-hook-form';
import { Input, Button } from '../components/index';
import conf from '../conf/conf';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

const About = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log('Sending email:', data);
      await emailjs.send(conf.emailServiceId, conf.emailTemplateId, data, {
        publicKey: conf.emailPublicKey,
      });
      toast.success('Email sent successfully!');
      reset();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email. Please try again later.');
    }
  };

  return (
    <section className="h-screen">
      <div className="container mx-auto w-1/2 animate-slideup p-4">
        <h1 className="mb-4 text-4xl font-bold">About Us</h1>
        <p className="mb-4">
          Welcome to our blog! We are dedicated to providing you with the latest
          news, insights, and tips on various topics. Our team of experienced
          writers works tirelessly to bring you high-quality content that is
          both informative and engaging.
        </p>
        <h2 className="mb-2 text-2xl font-bold">Contact Us</h2>
        <form
          className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <Input
              className={
                'focus:shadow-outline w-full appearance-none rounded border border-gray-200 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none'
              }
              type={'text'}
              label={'Name'}
              placeholder={'Your name'}
              labelClass={'mb-2 block text-sm font-bold text-gray-700'}
              {...register('name', {
                required: 'Name is required',
              })}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <Input
              className={
                'focus:shadow-outline w-full appearance-none rounded border border-gray-200 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none'
              }
              type={'email'}
              label={'Email'}
              placeholder={'Your email'}
              labelClass={'mb-2 block text-sm font-bold text-gray-700'}
              {...register('email', {
                required: 'Email is required',
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    'Email address must be a valid address',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              id="message"
              placeholder="Your message"
              rows="4"
              {...register('message', {
                required: 'Message is required',
              })}
            ></textarea>
            {errors.message && (
              <p className="text-red-500">{errors.message.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Button
              className={
                'focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none'
              }
              type={'submit'}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default About;
