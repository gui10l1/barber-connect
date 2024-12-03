import { HiUser } from "react-icons/hi2";
import { Calendar } from 'react-calendar';
import './styles.scss'
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { format } from 'date-fns';
import parseMinutesToHourString from "../../utils/parseMinutesToHourString";
import { Header } from "../../components/Header";

export const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);

  const loadAppointmentsInDate = useCallback(async (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const { data } = await api.get(`/appointments/barbers/${formattedDate}`, {
      params: {
        now: Date.now(),
      }
    });

    const sortedData = data.sort((a, b) => a.hour - b.hour);

    return sortedData;
  }, []);

  useEffect(() => {
    async function loadAppointments() {
      const now = new Date();

      const appointments = await loadAppointmentsInDate(now);

      setAppointments(appointments);
    }

    loadAppointments();
  }, [loadAppointmentsInDate]);

  useEffect(() => {
    async function loadStats() {
      const { data } = await api.get('/appointments/stats');

      setStats(data);
    }

    loadStats();
  }, []);

  const handleCalendarDateChange = useCallback(async (value) => {
    const appointments = await loadAppointmentsInDate(value);

    setSelectedDate(value);
    setAppointments(appointments);
  }, [loadAppointmentsInDate]);

  const firstAppointment = useMemo(() => {
    return appointments[0];
  }, [appointments]);

  const restAppointment = useMemo(() => {
    const rest = [...appointments];

    rest.splice(0, 1);

    return rest;
  }, [appointments]);

  const numberFormat = useMemo(() => {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' }).format;
  }, []);

  return (
    <div id="home">
      <Header />

      <div id="content">
        <div>
          <h1>Horários Agendados</h1>

          <span>Dia {format(selectedDate, 'dd/MM')}</span>

          <div className="current-appointment">
            <h1>Agora</h1>

            {firstAppointment ? (
              <div>
                <HiUser color="#22BE62" size={80} />

                <strong>{firstAppointment.client.name}</strong>

                <span>{parseMinutesToHourString(firstAppointment.hour)}</span>
              </div>
            ) : (
              <span>Não há agendamentos</span>
            )}
          </div>

          <div className="next-appointments">
            <h1>Próximos Atendimentos</h1>

            {restAppointment.length ? (
              restAppointment.map((appointment, index) => (
                <div key={index.toString()}>
                  <strong>{parseMinutesToHourString(appointment.hour)}</strong>

                  <div>
                    <HiUser color="#22BE62" size={80} />

                    <strong>{appointment.client.name}</strong>
                  </div>
                </div>
              ))
            ) : (
              <span>Não há proximos agendamentos</span>
            )}
          </div>
        </div>

        <div>
          <Calendar
            value={selectedDate}
            onChange={handleCalendarDateChange}
            minDate={new Date()}
          />

          {stats && (
            <div>
              <div>
                <strong>{stats.total}</strong>
                <span>Agendamentos</span>
              </div>

              <div>
                <strong>{numberFormat(stats.sells)}</strong>
                <span>Total Vendas</span>
              </div>

              <div>
                <strong>{numberFormat(stats.commissions)}</strong>
                <span>Comissões</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}