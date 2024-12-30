const Card = ({ icon, title, value, color }) => {
  return (
    <div className="p-4 xl:p-6 rounded-xl  dark:bg-[#0B0B0B] shadow-lg dark:border-none border border-[#11C7FF] drop-shadow-none  dark:drop-shadow-drop backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-start gap-3 md:gap-2">
        <div className={`p-[9px] md:p-[10px] rounded-full w-14 h-14 flex items-center  border dark:border-white/20  dark:shadow-none justify-center   `}>{icon}</div>
        <div className="space-y-1 text-center flex-1 md:text-left">
          <p className="text-xs md:text-sm font-bold  text-[#036988] dark:text-[#2DE9A7]">
            {title}
          </p>
          <p
            className={`text-lg md:text-xl font-semibold  text-[#11C7FF] dark:text-[#8BF495]`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
