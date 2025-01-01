import React, { LabelHTMLAttributes } from 'react'

export const Label: React.FC<LabelHTMLAttributes<HTMLLabelElement>> = ({ className = '', ...props }) => {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
      {...props}
    />
  )
}

