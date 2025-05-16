export function Userpanel() {
  {
    /* Side Panel - User Bets */
  }

  return (
    <div className="w-1/4 min-w-[250px] bg-[#132d4e] p-6  border-gray-600 overflow-y-auto flex flex-col">
    <h2 className="text-xl font-bold mb-6 text-orange-400 leading-snug">
        Users <br /> & <br /> Bets (USDT) 
    </h2>
    <ul className="space-y-4">
        <li className="flex justify-between items-center bg-[#1e3e62] p-3 rounded-md shadow-md w-full">
        <span className="text-white truncate max-w-[150px]">User123</span>
        <span className="text-orange-400 font-bold">15 USDT</span>
        </li>
        <li className="flex justify-between items-center bg-[#1e3e62] p-3 rounded-md shadow-md w-full">
        <span className="text-white truncate max-w-[150px]">CryptoKing</span>
        <span className="text-orange-400 font-bold">42 USDT</span>
        </li>
        <li className="flex justify-between items-center bg-[#1e3e62] p-3 rounded-md shadow-md w-full">
        <span className="text-white truncate max-w-[150px]">BetMaster</span>
        <span className="text-orange-400 font-bold">88 USDT</span>
        </li>
    </ul>
    </div>


  );
}
