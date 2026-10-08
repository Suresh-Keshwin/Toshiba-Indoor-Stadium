import { Link } from 'react-router-dom'

export default function Button({
  children,
  variant = 'primary',
  size,
  fullWidth = false,
  to,
  type = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size ? `btn--${size}` : '',
    fullWidth ? 'btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
