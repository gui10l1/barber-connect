import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import './styles.scss';
import api from '../../services/api';
import defaultAvatar from '../../../assets/img/default-avatar-2.png';
import { useNavigate } from 'react-router-dom';

export const BarbersPage = () => {
  const navigate = useNavigate();

  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    async function loadBarbers() {
      const { data } = await api.get('/users/barbers');

      setBarbers(data);
    }

    loadBarbers();
  }, []);

  return (
    <div id="barbers">
      <Header />

      <div id="content">
        <h1>Agendar Atendimento</h1>

        <span>Barbeiros Disponíveis</span>

        <div id="list">
          {barbers.map(barber => (
            <button
              key={barber.id}
              onClick={() => navigate(`/auth/appointments/create/${barber.id}`)}
            >
              <img src={defaultAvatar} alt="Avatar" />

              <div>
                <strong>{barber.name}</strong>

                <span>Segunda à Sexta 8 às 18</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}