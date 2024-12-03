import { Header } from '../../components/Header';
import { useForm, Controller } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import './styles.scss'
import { Input } from '../../components/Input';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

export const ServiceDataPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [service, setService] = useState(null);

  const formValidation = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required('Preencha este campo!'),
      price: Yup
        .number()
        .transform((va, ov) => {
          if (!ov) return undefined;

          return va;
        })
        .required('Preencha este campo!')
        .typeError('Insira um número válido!')
    });
  }, []);

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(formValidation),
  });

  useEffect(() => {
    async function loadService() {
      if (!id) return;

      const { data } = await api.get(`/services/${id}`);

      setService(data);
    }

    loadService();
  }, [id]);

  useEffect(() => {
    if (!service) return;

    setValue('name', service.name);
    setValue('price', service.price);
  }, [service]);

  const submitForm = useCallback(async (data) => {
    try {
      if (id) {
        await api.put(`/services/${id}`, data);
      } else {
        await api.post(`/services`, data);
      }

      toast('Serviço adicionado com sucesso!', {
        type: 'success',
      });

      navigate('/auth/services');
    } catch (err) {
      console.error(err);

      toast('Ocorreu um erro, tente novamente mais tarde!', {
        type: 'error',
      });
    }
  }, [navigate, id]);

  const handleCancel = useCallback(() => {
    navigate('/auth/services');
  }, [navigate]);

  return (
    <div id="service-data">
      <Header />

      <div id="content">
        <h1>Gerenciador de Serviços</h1>

        <span>Crie/Edite serviços para personalizar e manter sua lista sempre atualizada.</span>

        <form onSubmit={handleSubmit(submitForm)}>
          <div>
            <label>Nome do Serviço:</label>
            <Controller
              name="name"
              control={control}
              render={({ field: { name, onChange, value }, fieldState: { error } }) => (
                <Input
                  value={value}
                  name={name}
                  placeholder="Nome"
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
          </div>

          <div>
            <label>Preço do Serviço:</label>
            <Controller
              name="price"
              control={control}
              render={({ field: { name, onChange, value }, fieldState: { error } }) => (
                <Input
                  value={value}
                  type="number"
                  name={name}
                  placeholder="R$ 0.00"
                  onChange={onChange}
                  error={error?.message}
                  step=".01"
                />
              )}
            />
          </div>

          <div className='button-wrappers'>
            <button type="submit"className='success'>{id ? 'Atualizar' : 'Criar'}</button>
            <button type="button"className='error' onClick={handleCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}