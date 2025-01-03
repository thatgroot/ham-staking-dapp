import { useConnect } from "wagmi";
import VBox from "../Directional/VBox";
import { useEffect } from "react";
import { Wallet } from "lucide-react";
import Button from "../Main/Button";
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
