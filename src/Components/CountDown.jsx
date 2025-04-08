


import Stopwatch from "./Stopwatch";
import Button from "./Button";

const CountDown = () => {
  return (
    <div className="mt-[40px] lg:py-[80px] flex flex-col gap-[32px]">
      {/* Heading */}
      <h1 className="w-full text-[32px] leading-[80px] md:text-[48px] lg:text-[64px] font-[700] text-[#9F3247]">
        Your Gateway to Exciting Auctions
      </h1>

      {/* Description */}
      <p className="w-full text-[16px] md:text-[18px] text-[#9F3247]">
        Discover treasures at Biddius - where bidding meets buying. Join online
        auctions and find unique items to buy and sell with excitement!
      </p>

      {/* Stopwatch and Button */}
      <div className="flex flex-col-reverse gap-[36px] md:flex-col items-center md:items-start">
        <Stopwatch days={5} hours={4} minutes={55} seconds={35} />
        <div className="w-full">
          <Button
            label="Bid Now"
            className="bg-gradient-to-r from-[#7B2334] to-[#9F3247] w-full lg:w-[200px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CountDown;