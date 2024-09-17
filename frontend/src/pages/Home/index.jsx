import useAuth from "../../hooks/auth";

export const HomePage = () => {
  const { logOut } = useAuth();

  return (
    <div>
      <h1>Home page</h1>

      <button type="button" onClick={logOut}>Sair</button>
    </div>
  );
}