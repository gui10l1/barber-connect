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
      role: Yup.string().required('Escolha um perfil!'),
    });
  }, []);

  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(formValidation),
  });

  const handleLogin = useCallback(async (data) => {
    try {
      const signUpData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      const target = data.role === 'client' ?  `/users/clients` : `/users`;

      await api.post(target, signUpData);

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

          <h2>Cadastro</h2>

          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="select-role">
              <div>
                <div>
                  <label htmlFor="barber">Sou barbeiro</label>

                  <Controller
                    name="role"
                    control={control}
                    render={({ field: { name, onChange } }) => (
                      <input type="radio" name={name} value="barber" id="barber" onChange={onChange} />
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="client">Sou cliente</label>

                  <Controller
                    name="role"
                    control={control}
                    render={({ field: { name, onChange } }) => (
                      <input type="radio" name={name} value="client" id="client" onChange={onChange} />
                    )}
                  />
                </div>
              </div>

              {errors?.role?.message && (
                <span>{errors?.role?.message}</span>
              )}
            </div>

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
