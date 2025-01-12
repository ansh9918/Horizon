import { Card } from '../index';

const FeaturedSection = () => {
  return (
    <div className="mt-5 flex h-[70vh] w-full animate-slideup flex-col gap-2 md:flex-row">
      <div className="flex w-full flex-col gap-2 md:w-1/3">
        <Card
          bgImage={'/assets/img4.jpg'}
          className="flex h-1/2 w-full items-center rounded-lg bg-cover p-2 px-5 py-5 md:py-0"
          textClassName="text-xl md:text-3xl text-white font-semibold"
        >
          Explore To Your Heart&apos;s <br /> Content
        </Card>
        <Card
          bgImage={'/assets/img3.jpg'}
          textClassName=" text-lg text-white font-semibold md:text-2xl"
          className="flex h-1/2 w-full items-end rounded-lg bg-cover p-2 px-5 py-5 md:py-0"
        >
          Article Available <br /> 78
        </Card>
      </div>
      <div className="w-full md:w-2/3">
        <Card
          bgImage={'/assets/photo2.png'}
          className="flex h-full w-full items-center justify-center rounded-lg bg-cover py-5 md:py-0"
          textClassName="text-2xl  text-white font-semibold md:text-4xl text-center"
        >
          Beyond accomodation, creating <br /> memories of a lifetime
        </Card>
      </div>
    </div>
  );
};

export default FeaturedSection;
