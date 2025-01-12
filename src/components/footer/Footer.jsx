import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
} from 'react-icons/fa';
import Button from '../Button';
import Input from '../Input';

const Footer = () => {
  return (
    <footer className="flex flex-col gap-5 rounded-lg bg-black p-4 text-white">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* First Container */}
        <div className="flex flex-1 basis-1/3 flex-col gap-3">
          <h1 className="text-2xl font-bold">Horizon</h1>
          <p className="text-xs text-gray-400">
            Our mission is to do give people access to the high quality blogs
            capable of improving their lifestyles. Our mission is to do give
            people access to the high quality blogs capable of improving their
            lifestyles.
          </p>
        </div>

        {/* Second Container */}
        <div className="hidden flex-1 basis-1/6 flex-col items-center md:flex">
          <div className="flex flex-col gap-3">
            <h2>About</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>About Us</li>
              <li>Blog</li>
              <li>Career</li>
            </ul>
          </div>
        </div>

        {/* Third Container */}
        <div className="hidden flex-1 basis-1/6 flex-col items-center md:flex">
          <div className="flex flex-col gap-3">
            <h2>Support</h2>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Contact Us</li>
              <li>Return</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>

        {/* Fourth Container */}
        <div className="flex flex-1 basis-1/3 flex-col items-center">
          <div className="flex flex-col gap-4">
            <h2 className="self-start">Get Updates</h2>
            <div className="space-y-4">
              <div className="flex items-center rounded-md border border-gray-400 bg-white/20 p-1">
                <Input
                  placeholder={'Enter Your Email..'}
                  className={'border-none bg-transparent'}
                />
                <Button className={'bg-white font-medium text-black'}>
                  Submit
                </Button>
              </div>
              <div className="flex gap-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
                  <FaInstagram />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
                  <FaTwitter />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
                  <FaFacebook />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
                  <FaDiscord />
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
                  <FaTiktok />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <h2>2024 Horizon. All rights reserved.</h2>
        <div className="flex gap-3">
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
