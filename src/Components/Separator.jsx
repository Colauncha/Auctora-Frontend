const Separator = ({ title }) => {
  return (
    <div className="bg-gradient-to-r from-[#7B2334] to-[#9F3247] h-[70px] md:h-[122px] w-full text-[24px] md:text-[40px] font-[800] text-white flex items-center justify-center">
      <div className="w-full max-w-[1433px] text-center">{title}</div>
    </div>
  );
};

export default Separator;
