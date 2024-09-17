import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { FiKey, FiMail, FiUser } from "react-icons/fi";
import './styles.scss';
import { useCallback, useMemo } from "react";
import * as Yup from 'yup';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import getServerError from "../../utils/getServerError";
import { toast } from "react-toastify";
import api from "../../services/api";

export const SignUpPage = () => {
  const formValidation = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('Insira seu nome completo!'),
      email: Yup.string().required('Insira seu e-mail').email('E-mail inválido!'),
      password: Yup.string().required('Insira sua senha!'),
    });
  }, []);

  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(formValidation),
  });

  const handleLogin = useCallback(async (data) => {
    try {
      await api.post(`/users`, data);

      toast('Conta criada com sucesso!', { type: 'success' });

      navigate('/login');
    } catch (err) {
      console.error(err);

      const serverError = getServerError(err);

      toast(serverError?.message, {
        type: 'error',
      });
    }
  }, [navigate]);

  return (
    <div id="container">
      <div id="background" />

      <div id="login">
        <div>
          <h1>Barber Connect</h1>

          <h2>Cadastro Barbeiro</h2>

          <form onSubmit={handleSubmit(handleLogin)}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  icon={FiUser}
                  placeholder="Nome"
                  onChange={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  icon={FiMail}
                  placeholder="E-mail"
                  onChange={onChange}
                  value={value}
                  error={error?.message}
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
                  onChange={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />

            <Button>Cadastrar</Button>

            <Link to="/">Voltar para o login</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
