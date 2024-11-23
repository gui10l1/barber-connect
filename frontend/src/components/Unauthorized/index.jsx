import './styles.scss'

export const Unauthorized = ({ message }) => {
  return (
    <div id="unauthorized">
      <h1>Não autorizado</h1>

      <p>{message || 'Você não pode acessar este recurso!'}</p>
    </div>
  );
}