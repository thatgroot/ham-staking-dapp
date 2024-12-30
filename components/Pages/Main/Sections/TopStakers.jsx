const StakerCard = ({ name, avatar, hamCoins, reward, height }) => (
  <div
    className={`bg-gradient-to-b from-[#5AC0FF]/10 to-[#5AC0FF]/40
    border border-[#C6E0FB] drop-shadow-card rounded-2xl p-6
    flex flex-col items-center justify-center text-center`}
    style={{ height }}
  >
    <div className="w-[70px] h-[70px] bg-white shadow-md rounded-full mb-4 overflow-hidden">
      <div>
        <img
          src={avatar}
          alt={name}
          className="object-cover"
          width={70}
          height={70}
          aria-label={`Avatar of ${name}`}
        />
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-2 text-black">{name}</h3>
    <p className="text-[#202020]/80 text-sm">
      {hamCoins} HamCoins - {reward} Coins Reward
    </p>
  </div>
);

const TopStakers = () => {
  const topStakers = [
    {
      name: "KryptoKing 45",
      avatar: "https://placebeard.it/250/250",
      hamCoins: "50,000",
      reward: "7,500",
    },
    {
      name: "CryptoQueen 77",
      avatar: "https://placebeard.it/250/200",
      hamCoins: "40,000",
      reward: "6,000",
    },
    {
      name: "StakeMaster 33",
      avatar: "https://placebeard.it/250/256",
      hamCoins: "30,000",
      reward: "4,500",
    },
    {
      name: "TokenTitan 22",
      avatar: "https://placebeard.it/250/257",
      hamCoins: "20,000",
      reward: "3,000",
    },
    {
      name: "NFTNinja 99",
      avatar: "https://placebeard.it/250/255",
      hamCoins: "70,000",
      reward: "9,000",
    },
    {
      name: "MetaMogul 88",
      avatar: "https://placebeard.it/250/254",
      hamCoins: "60,000",
      reward: "8,500",
    },
    {
      name: "CoinCommander 55",
      avatar: "https://placebeard.it/250/253",
      hamCoins: "25,000",
      reward: "3,500",
    },
    {
      name: "BlockBoss 11",
      avatar: "https://placebeard.it/250/252",
      hamCoins: "15,000",
      reward: "2,000",
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 md:px-16">
        <header className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-black">
            Meet Our Top Stakers
          </h2>
          <p className="text-lg text-gray-600">
            Each entry is complemented with a personalized badge or rank,
            motivating others with the tagline: "Your name could be here. Start
            staking now!"
          </p>
        </header>

        {/* Desktop Layout */}
        <div className="hidden md:flex space-x-4 min-h-[600px]">
          {/* Column 1 */}
          <div className="flex flex-col space-y-4 w-1/5">
            <StakerCard {...topStakers[0]} height="40%" />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col space-y-4 w-1/5">
            <StakerCard {...topStakers[1]} height="40%" />
            <StakerCard {...topStakers[2]} height="50%" />
          </div>

          {/* Column 3 */}
          <div className="flex flex-col space-y-4 w-1/5">
            <StakerCard {...topStakers[3]} height="45%" />
            <StakerCard {...topStakers[4]} height="50%" />
          </div>

          {/* Column 4 */}
          <div className="flex flex-col space-y-4 w-1/5">
            <StakerCard {...topStakers[5]} height="60%" />
            <StakerCard {...topStakers[6]} height="40%" />
          </div>

          {/* Column 5 */}
          <div className="flex flex-col space-y-4 w-1/5">
            <StakerCard {...topStakers[7]} height="50%" />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topStakers.map((staker, index) => (
            <StakerCard key={index} {...staker} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopStakers;
