import { useAccount, useConnect, useDisconnect } from "wagmi";
import { HBox, VBox } from "../Directional/flex";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import Button from "../Main/Button";
export function ConnectMetaMask() {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);

  return (
    <HBox gap={24} className="bg-blue-400 rounded-xl">
      {account.status === "connected" ? (
        <Button onClick={() => disconnect()} icon={<Wallet />}>
          <span>Disconnect</span>
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

export default function WalletModel({ onConnect }: { onConnect: () => void }) {
  const { connectors, connect, status, error } = useConnect();
  useEffect(() => {
    if (status === "success") {
      onConnect();
    }
  }, [status]);

  return (
    <VBox
      className="fixed bg-black/50 left-0 right-0 top-0 bottom-0"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <VBox gap={12} className="w-80 max-h-96 bg-white rounded-lg p-6">
        {connectors.map((connector) => (
          <Button
            key={connector.uid}
            onClick={() => connect({ connector })}
            icon={<Wallet />}
          >
            {connector.name}
          </Button>
        ))}
        <div>{error?.message}</div>
      </VBox>
    </VBox>
  );
}
