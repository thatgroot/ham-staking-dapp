import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input: React.FC<InputProps> = ({ className = '', error = false, ...props }) => {
  const baseStyles = 'w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none transition-colors duration-200'
  const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'

  return (
    <input
      className={`${baseStyles} ${errorStyles} ${className}`}
      {...props}
    />
  )
}

