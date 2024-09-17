import './styles.scss';

export const Input = ({
  icon: Icon = null,
  error = '',
  ...rest
}) => {
  return (
    <div>
      <div id="input-container">
        {Icon && <Icon size={24} color="#fff" />}

        <input type="text" {...rest} />
      </div>
      {error && <span id="input-error">{error}</span>}
    </div>
  );
}