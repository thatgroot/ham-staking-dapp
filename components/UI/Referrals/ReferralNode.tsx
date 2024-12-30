"use client";

export function ReferralNode({
  node,
  isRoot = false,
}: {
  node: Referral;
  isRoot?: boolean;
}) {
  const { data, children } = node;
  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className={`${isRoot ? "" : "ml-8"} mb-4`}>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isRoot ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          <span className="text-sm font-medium text-white">{initials}</span>
        </div>

        <div>
          <div className="flex gap-3 justify-between items-center">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-lg hover:text-blue-700 transition-colors"
              href={`https://solana.fm/address/${data.wallet}/nfts?cluster=mainnet-alpha`}
            >
              {data.name}
            </a>
          </div>

          <p className="text-sm text-gray-300 poppins-regular">
            {children.length} direct referral
            {children.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {children.length > 0 && (
        <div className="mt-4 border-l border-white pl-4 poppins-regular">
          {children.map((child) => (
            <ReferralNode key={child.data.wallet} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
