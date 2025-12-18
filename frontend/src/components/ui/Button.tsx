import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<Props> = ({ children, variant = 'primary', ...rest }) => {
  const base = 'px-4 py-2 rounded'
  const cls = variant === 'primary' ? `${base} bg-blue-600 text-white` : `${base} bg-gray-200`
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}

export default Button
