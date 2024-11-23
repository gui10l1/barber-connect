import { useEffect, useMemo, useState } from 'react';
import { Header } from '../../components/Header';
import './styles.scss';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { addMinutes, format, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AppointmentScheduledPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    async function loadAppointment() {
      const { data } = await api.get(`/appointments/${appointmentId}`);

      setAppointment(data);
    }

    loadAppointment();
  }, [appointmentId]);

  const appointmentDate = useMemo(() => {
    if (!appointment) return '';

    const { date: dateString, hour } = appointment;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const start = startOfDay(Date.now());
    const startsAt = addMinutes(start, hour);
    const appointmentStartsAt = format(startsAt, 'HH:mm');

    const string = format(
      date,
      `iiii, 'dia' dd 'de' LLLL 'de' yyyy 'às' ${appointmentStartsAt}'h'`,
      { locale: ptBR }
    );

    return string;
  }, [appointment]);

  console.log({ appointmentDate });

  return (
    <div id="appointment-scheduled">
      <Header />

      <div id="content">
        <h1>Agendamento Concluído</h1>
        <p>
          {appointmentDate} com {appointment?.user.name}
        </p>

        <button onClick={() => navigate('/auth/appointments')}>OK</button>
      </div>
    </div>
  );
}