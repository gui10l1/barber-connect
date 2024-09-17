import { useCallback, useMemo } from 'react';
import './styles.scss';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import getServerError from '../../utils/getServerError';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/auth';
import { Input } from '../../components/Input';
import { FiArrowLeft, FiKey, FiMail, FiUser } from 'react-icons/fi';
import { HiUser } from 'react-icons/hi2';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const formValidation = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('Preencha este campo!'),
      email: Yup.string().required('Preencha este campo!'),
      password: Yup.string(),
      confirmPassword: Yup.string()
        .when('password', {
          is: value => !!value,
          then: schema => schema.required('Preencha este campo!'),
        })
        .oneOf([Yup.ref('password')], 'As senhas não são iguais!'),
    });
  }, []);

  const navigate = useNavigate();
  const { updateUser, user } = useAuth();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(formValidation),
  });

  const handleUpdateProfile = useCallback(async (data) => {
    try {
      await updateUser({
        name: data.name,
        email: data.email,
        password: data.password
      });

      toast('Perfil atualizado com sucesso!', {
        type: 'success',
      });
    } catch (err) {
      console.error(err);

      const serverError = getServerError(err);

      toast(serverError?.message, {
        type: 'error',
      });
    }
  }, [updateUser]);

  return (
    <div id="profile">
      <div id="header">
        <button onClick={() => navigate('/home')}>
          <FiArrowLeft size={32} color="#fff" />
        </button>
      </div>

      <div id="content">
        <div id="profile-pic">
          <HiUser size={186} color="#22BE62" />

          <input type="file" />
        </div>

        <h1>Meu Perfil</h1>

        <form onSubmit={handleSubmit(handleUpdateProfile)}>
          <div>
            <Controller
              name="name"
              control={control}
              defaultValue={user.name}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  icon={FiUser}
                  onChange={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              defaultValue={user.email}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  icon={FiMail}
                  onChange={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  type="password"
                  icon={FiKey}
                  onChange={onChange}
                  value={value}
                  error={error?.message}
                  placeholder="Nova senha"
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Input
                  type="password"
                  icon={FiKey}
                  onChange={onChange}
                  value={value}
                  error={error?.message}
                  placeholder="Confirmar senha"
                />
              )}
            />
          </div>

          <Button>Salvar alterações</Button>
        </form>
      </div>
    </div>
  );
}