import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { FiKey, FiMail } from "react-icons/fi";
import './styles.scss';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useMemo } from "react";
import * as Yup from 'yup';
import getServerError from "../../utils/getServerError";
import useAuth from "../../hooks/auth";
import { toast } from "react-toastify";

export const LoginPage = () => {
  const formValidation = useMemo(() => {
    return Yup.object().shape({
      email: Yup.string().required('Insira seu e-mail').email('E-mail inválido!'),
      password: Yup.string().required('Insira sua senha!'),
    });
  }, []);

  const { login } = useAuth();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(formValidation),
  });

  const handleLogin = useCallback(async (data) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      console.error(err);

      const serverError = getServerError(err);

      toast(serverError?.message, {
        type: 'error',
      });
    }
  }, [login]);

  return (
    <div id="container">
      <div id="login">
        <div>
          <h1>Barber Connect</h1>

          <h2>Faça seu login</h2>

          <form onSubmit={handleSubmit(handleLogin)}>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  icon={FiMail}
                  placeholder="E-mail"
                  error={error?.message}
                  onChange={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  type="password"
                  icon={FiKey}
                  placeholder="Senha"
                  error={error?.message}
                  onChange={onChange}
                  value={value}
                />
              )}
            />

            <Button>Entrar</Button>

            <Link>Esqueci minha senha</Link>
          </form>

          <Link to="/sign-up">Criar conta</Link>
        </div>
      </div>

      <div id="background" />
    </div>
  );
}
