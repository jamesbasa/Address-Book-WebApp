import styles from './input.module.scss'

export default function Input({icon, inputLabel, name, required, pattern, title, onChange}) {
  return (
    <div className="mb-8">
      <label className="block text-lg mb-4" htmlFor="input">{inputLabel}</label>
      {icon && <img className={styles['input__icon']} src={`/${icon}`} />}
      {/* Address line2 input is the only input not required */}
      {required ?
        <input className={`block w-full ${styles.input}`}  id={name} name={name} 
          pattern={pattern} title={title} required/> 
      :
        <input className={`block w-full ${styles.input}`}  id={name} name={name}
          pattern={pattern} onChange={onChange}/>
      }
    </div>
  )
}