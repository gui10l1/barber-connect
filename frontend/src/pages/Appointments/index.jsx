import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "../../components/Header";
import './styles.scss';
import api from "../../services/api";
import { addMinutes, format } from 'date-fns';
import parseMinutesToHourString from "../../utils/parseMinutesToHourString";
import { HiUser } from "react-icons/hi2";
import image from '../../../assets/img/client-scheduled-appointments.png';

export const AppointmentsPage = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [selectedDate] = useState(new Date());

  useEffect(() => {
    async function loadAppointments() {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd')
      const { data } = await api.get(`/appointments/clients/${formattedDate}`);

      setUpcomingAppointments(data.upcoming);
      setPastAppointments(data.past);
    }

    loadAppointments();
  }, [selectedDate]);

  const firstAppointment = useMemo(() => {
    return upcomingAppointments[0];
  }, [upcomingAppointments]);

  const getDateFromString = useCallback((string = '') => {
    const [year, month, day] = string.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return date;
  }, []);

  const renderPastAppointments = useCallback(() => {
    if (!pastAppointments?.length) {
      return <span>Não há histórico de agendamentos</span>;
    }

    const elements = pastAppointments.map((appointment, index) => {
      const date = addMinutes(
        getDateFromString(appointment.date),
        appointment.hour
      );

      return (
        <div key={index.toString()}>
          <strong>
            {date.toLocaleDateString()}
            <br />
            {format(date, 'HH:mm')}
          </strong>

          <div>
            <HiUser color="#22BE62" size={80} />

            <strong>{appointment.user.name}</strong>
          </div>
        </div>
      );
    });

    return elements;
  }, [pastAppointments, getDateFromString]);

  return (
    <div id="appointments">
      <Header />

      <div id="content">
        <div>
          <h1>Horários Agendados</h1>

          <span>Histórico de Agendamentos</span>

          <div className="current-appointment">
            <h1>Próximo Agendamento</h1>

            {firstAppointment ? (
              <div>
                <HiUser color="#22BE62" size={80} />

                <strong>
                  {firstAppointment.user.name}
                </strong>

                <span>
                  {format(new Date(firstAppointment?.unix_date), 'dd/MM/yyyy')}
                  <br />
                  {parseMinutesToHourString(firstAppointment.hour)}
                </span>
              </div>
            ) : (
              <span>Não há agendamentos</span>
            )}
          </div>

          <div className="next-appointments">
            <h1>Agendamentos passados</h1>

            {renderPastAppointments()}
          </div>
        </div>

        <img src={image} alt="OImage" id="fixed-image" />
      </div>
    </div>
  )
}