export default function Input({
  label,
  id,
  error,
  hint,
  className = '',
  as = 'input',
  children,
  ...props
}) {
  const fieldId = id || props.name
  const Comp = as === 'select' ? 'select' : as === 'textarea' ? 'textarea' : 'input'
  const controlClass = [
    Comp === 'textarea' ? 'textarea' : Comp === 'select' ? 'select' : 'input',
    error ? `${Comp === 'textarea' ? 'textarea' : Comp === 'select' ? 'select' : 'input'}--error` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="field">
      {label ? (
        <label className="field__label" htmlFor={fieldId}>
          {label}
        </label>
      ) : null}
      <Comp id={fieldId} className={controlClass} aria-invalid={Boolean(error)} {...props}>
        {Comp === 'select' ? children : null}
      </Comp>
      {error ? <span className="field__error">{error}</span> : null}
      {!error && hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  )
}
