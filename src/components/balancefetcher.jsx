import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export function Balancefetcher({ address }) {
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;

      try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const publicKey = new PublicKey(address);
        const balanceInLamports = await connection.getBalance(publicKey);
        setBalance(balanceInLamports / 1e9);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [address]);

  if (!address) {
    return <div>No wallet address found</div>;
  }

  return (
    <div>
      Balance: {balance !== null ? `${balance} SOL` : "Loading..."}
    </div>
  );
}
