import { Card } from '../index';

const FeaturedSection = () => {
  return (
    <div className="mt-5 flex h-[70vh] w-full animate-slideup gap-2">
      <div className="flex w-1/3 flex-col gap-2">
        <Card
          bgImage={'/src/assets/img4.jpg'}
          className="flex h-1/2 w-full items-center rounded-lg bg-cover p-2 px-5"
          textClassName=" text-3xl text-white font-semibold"
        >
          Explore To Your Heart&apos;s <br /> Content
        </Card>
        <Card
          bgImage={'/src/assets/img3.jpg'}
          textClassName="text-white font-semibold text-2xl"
          className="flex h-1/2 w-full items-end rounded-lg bg-cover p-2 px-5 py-5"
        >
          Article Available <br /> 78
        </Card>
      </div>
      <div className="w-2/3">
        <Card
          bgImage={'/src/assets/photo2.png'}
          className="flex h-full w-full items-center justify-center rounded-lg bg-cover"
          textClassName="text-white font-semibold text-4xl text-center"
        >
          Beyond accomodation, creating <br /> memories of a lifetime
        </Card>
      </div>
    </div>
  );
};

export default FeaturedSection;
