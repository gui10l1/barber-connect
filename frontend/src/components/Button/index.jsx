import './styles.scss';

export const Button = ({ children, ...rest }) => {
  return (
    <button id="button" {...rest}>{children}</button>
  );
}