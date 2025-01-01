"use client"

import { useState } from 'react'

const users = [
  { id: 1, name: "Alice", walletAddress: "0x1234...5678", stakedAmount: "$1,000", referrals: 5 },
  { id: 2, name: "Bob", walletAddress: "0x2345...6789", stakedAmount: "$2,500", referrals: 3 },
  { id: 3, name: "Charlie", walletAddress: "0x3456...7890", stakedAmount: "$500", referrals: 1 },
  { id: 4, name: "David", walletAddress: "0x4567...8901", stakedAmount: "$5,000", referrals: 10 },
  { id: 5, name: "Eve", walletAddress: "0x5678...9012", stakedAmount: "$750", referrals: 2 },
]

export function UserTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-sm px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-[#2DE96C] bg-white dark:bg-[#0B0B0B] text-black dark:text-white border-[#11C7FF] dark:border-[#2DE96C]"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2">User Name</th>
              <th className="px-4 py-2">Wallet Address</th>
              <th className="px-4 py-2">Staked Amount</th>
              <th className="px-4 py-2">Referrals</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.walletAddress}</td>
                <td className="px-4 py-2">{user.stakedAmount}</td>
                <td className="px-4 py-2">{user.referrals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

