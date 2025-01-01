import React, { HTMLAttributes } from 'react'

export const Card: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
      {...props}
    />
  )
}

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-200 ${className}`}
      {...props}
    />
  )
}

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className = '', ...props }) => {
  return (
    <h2
      className={`text-xl font-semibold text-gray-800 ${className}`}
      {...props}
    />
  )
}

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ className = '', ...props }) => {
  return (
    <p
      className={`mt-1 text-sm text-gray-600 ${className}`}
      {...props}
    />
  )
}

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 ${className}`}
      {...props}
    />
  )
}

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return (
    <div
      className={`px-6 py-4 bg-gray-50 ${className}`}
      {...props}
    />
  )
}

