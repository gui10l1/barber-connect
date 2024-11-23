import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api";
import './styles.scss';
import { Header } from "../../components/Header";
import defaultAvatar from '../../../assets/img/default-avatar-2.png';
import Calendar from "react-calendar";
import { Controller, useForm } from "react-hook-form";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const HourField = ({ name, hour, onChange, selected }) => {
  return (
    <div
      className="hour-field"
      style={{
        backgroundColor: selected ? 'var(--green)' : 'var(--lighter-gray)'
      }}
    >
      <input type="radio" name={name} onChange={onChange} id={hour} value={hour} />
      <label htmlFor={hour}>{hour}</label>
    </div>
  );
}

export const CreateAppointmentPage = () => {
  const formValidation = useMemo(() => {
    return Yup.object().shape({
      serviceId: Yup.string().required('Escolha um serviço!'),
      time: Yup.string().required('Escolha um horário!'),
    });
  }, []);

  const navigate = useNavigate();
  const { barberId } = useParams();
  const { handleSubmit, control, formState, setValue } = useForm({
    resolver: yupResolver(formValidation),
  });

  const [barber, setBarber] = useState(null);
  const [barberSchedule, setBarberSchedule] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState('');

  useEffect(() => {
    async function loadBarber() {
      const { data } = await api.get(`/users/${barberId}`);

      setBarber(data);
    }

    loadBarber();
  }, [barberId]);

  useEffect(() => {
    async function loadServices() {
      const { data } = await api.get(`/services/barbers/${barberId}`);

      console.log(data);

      setServices(data);
    }

    loadServices();
  }, [barberId]);

  useEffect(() => {
    async function loadBarberSchedule() {
      const { data } = await api.get(
        `/appointments/barbers/${barberId}/schedule`,
        { params: { date: format(selectedDate, 'yyyy-MM-dd') } }
      );

      setBarberSchedule(data);
      setSelectedHour('');
      setValue('time', '');
    }

    loadBarberSchedule();
  }, [barberId, selectedDate, setValue]);

  const handleCalendarDateChange = useCallback(async (value) => {
    setSelectedDate(value);
  }, []);

  const handleFormSubmit = useCallback(async (data) => {
    try {
      const { data: appointment } = await api.post('/appointments', { 
        time: data.time,
        service: data.serviceId,
        date: format(selectedDate, 'dd/MM/yyyy'),
      });

      toast('Agendamento realizado com sucesso!', { type: 'success' });
      navigate(`/auth/appointments/scheduled/${appointment.id}`);
    } catch (err) {
      console.error(err);

      toast('Um erro desconhecido aconteceu!', {
        type: 'error'
      });
    }
  }, [navigate, selectedDate]);

  const parsedSchedule = useMemo(() => {
    const schedules = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    for (const schedule of barberSchedule) {
      const { period, hour } = schedule;
      const selectedSchedulePeriod = schedules[period];

      if (selectedSchedulePeriod) selectedSchedulePeriod.push(hour);
    }

    return schedules;
  }, [barberSchedule]);

  const renderSchedule = useCallback((hourList = []) => {
    if (!hourList.length) {
      return <span>Não há horários disponíveis!</span>
    }

    const hourElements = hourList.map(hour => (
      <Controller
        key={hour}
        name="time"
        control={control}
        render={({ field: { name, onChange } }) => (
          <HourField
            selected={selectedHour === hour}
            hour={hour}
            name={name}
            onChange={event => {
              console.log(event);

              setSelectedHour(hour)
              onChange(event);
            }}
          />
        )}
      />
    ));

    return hourElements;
  }, [selectedHour, control]);

  const formErrors = useMemo(() => {
    return formState.errors;
  }, [formState]);

  return (
    <div id="create-appointment">
      <Header />

      <div id="content">
        <h1>Agendar Atendimento</h1>

        <div className="barber">
          <img src={defaultAvatar} alt="Avatar" />

          <div>
            <strong>{barber?.name}</strong>

            <span>Segunda à Sexta 8 às 18</span>
          </div>
        </div>

        <div className="title">
          <h2>Escolha uma data</h2>

          {!selectedDate && (
            <span className="input-error">
              Escolha uma data para o agendamento!
            </span>
          )}
        </div>

        <Calendar
          value={selectedDate}
          onChange={handleCalendarDateChange}
          minDate={new Date()}
        />

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="title">
            <h2>Escolha um horário</h2>

            {formErrors?.time?.message && (
              <span className="input-error">
                {formErrors?.time?.message}
              </span>
            )}
          </div>

          <div className="schedule">
            <span>Manhã</span>

            <div>{renderSchedule(parsedSchedule.morning)}</div>
          </div>

          <div className="schedule">
            <span>Tarde</span>

            <div>{renderSchedule(parsedSchedule.afternoon)}</div>
          </div>

          <div className="schedule">
            <span>Noite</span>

            <div>{renderSchedule(parsedSchedule.evening)}</div>
          </div>

          <div className="title">
            <h2>Tipo de Serviço</h2>

            {formErrors?.serviceId?.message && (
              <span className="input-error">
                {formErrors?.serviceId?.message}
              </span>
            )}
          </div>

          <Controller
            name="serviceId"
            control={control}
            render={({ field: { name, onChange, value }, fieldState: { error } }) => (
              <>
                <select onChange={onChange} name={name} value={value}>
                  <option value="" hidden selected>Selecione uma opção</option>
                  {services.map(service => (
                    <option value={service.id} key={service.id}>
                      {service.name} ${service.price}
                    </option>
                  ))}
                </select>
                {error?.message && <span className="input-error"></span>}
              </>
            )}
          />

          <button type="submit">Agendar</button>
        </form>
      </div>
    </div>
  );
}