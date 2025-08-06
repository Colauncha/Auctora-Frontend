


import CountDown from "../../Components/CountDown";
import Carousel from "../../Components/Carousel";

const Spotlight = () => {
  return (
    <div className="bg-[#F2F0F1] min-h-screen w-full">
      <div className="max-w-[1433px] mx-auto formatter flex flex-col lg:flex-row justify-between px-2 lg:px-20 py-4 lg:py-4">
        {/* CountDown Section */}
        <div className="w-full lg:w-1/2">
          <CountDown />
        </div>

        {/* Carousel Section */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <Carousel />
        </div>
      </div>
    </div>
  );
};

export default Spotlight;