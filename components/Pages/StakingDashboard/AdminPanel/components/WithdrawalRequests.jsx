"use client"

import { useState } from 'react'

const withdrawalRequests = [
  { id: 1, user: "Alice", amount: "$500", status: "Pending" },
  { id: 2, user: "Bob", amount: "$1,000", status: "Pending" },
  { id: 3, user: "Charlie", amount: "$250", status: "Pending" },
  { id: 4, user: "David", amount: "$2,000", status: "Pending" },
  { id: 5, user: "Eve", amount: "$750", status: "Pending" },
]

export function WithdrawalRequests() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRequests = withdrawalRequests.filter(request =>
    request.user.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search requests..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-sm px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#11C7FF] dark:focus:ring-[#2DE96C] bg-white dark:bg-[#0B0B0B] text-black dark:text-white border-[#11C7FF] dark:border-[#2DE96C]"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{request.user}</td>
                <td className="px-4 py-2">{request.amount}</td>
                <td className="px-4 py-2">{request.status}</td>
                <td className="px-4 py-2">
                  <button className="px-3 py-1 text-xs font-medium text-white bg-[#11C7FF] dark:bg-[#2DE96C] rounded-md mr-2 hover:bg-[#0FB8EC] dark:hover:bg-[#27D161] transition-colors">
                    Approve
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

