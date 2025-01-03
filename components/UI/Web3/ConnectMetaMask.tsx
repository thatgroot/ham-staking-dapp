import { useAccount, useDisconnect } from "wagmi";
import HBox from "../Directional/HBox";
import { useState } from "react";
import { Wallet } from "lucide-react";
import Button from "../Main/Button";
import WalletModel from "./WalletModel";
function ConnectMetaMask() {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);

  return (
    <HBox gap={24} className="bg-blue-400 rounded-xl">
      {account.status === "connected" ? (
        <Button onClick={() => disconnect()} icon={<Wallet />}>
          <span>Disconnect</span>
          <div>
            {account.address.slice(0, 4)}...{account.address.slice(-4)}
          </div>
        </Button>
      ) : (
        <Button
          onClick={() => {
            setShowModal(true);
          }}
          icon={<Wallet />}
        >
          <span>Connect</span>
        </Button>
      )}
      {showModal && (
        <WalletModel
          onConnect={() => {
            setShowModal(false);
          }}
        />
      )}
    </HBox>
  );
}
export default ConnectMetaMask;
