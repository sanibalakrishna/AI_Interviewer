function FormInput({ type, value, onChange, placeholder, className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    />
  );
}

export default FormInput;
