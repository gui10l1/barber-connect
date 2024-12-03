import { useCallback, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import './styles.scss'
import api from "../../services/api";
import useAuth from "../../hooks/auth";
import { FiEdit, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

export const ListServicesPage = () => {
  const { user } = useAuth();

  const [services, setServices] = useState([]);

  useEffect(() => {
    async function loadServices() {
      const { data } = await api.get(`/services/barbers/${user.id}`);

      setServices(data);
    }

    loadServices();
  }, [user]);

  const handleDeleteService = useCallback(async (id) => {
    const confirmation = confirm("Voce quer mesmo deletar este serviço?");

    if (confirmation) {
      await api.delete(`/services/${id}`);

      toast('Serviço removido com sucesso!', {
        type: 'success',
      });

      setServices(oldState => {
        const services = [...oldState];

        return services.filter(service => service.id !== id);
      })
    }
  }, []);

  const renderServices = useCallback(() => {
    if (!services.length) {
      return (
        <span>Não há serviços</span>
      );
    }

    return services.map(service => {
      return (
        <div className="service" key={service.id}>
          <h1>{service.name}</h1>

          <div>
            <Link to={`/auth/services/edit/${service.id}`}>
              <FiEdit size={35} color="#fff" />
            </Link>
            
            <button onClick={() => handleDeleteService(service.id)}>
              <FiX size={35} color="#f00" />
            </button>
          </div>
        </div>
      );
    });
  }, [services, handleDeleteService]);

  return (
    <div id="list-services">
      <Header />

      <div id="content">
        <div className="heading">
          <div>
            <h1>Gerenciador de Serviços</h1>

            <span>Gerencie seus serviços de forma simples e organizada</span>

            <strong>Serviços Atuais</strong>
          </div>

          <Link to="/auth/services/create">
            + Adicionar Serviço
          </Link>
        </div>

        <div className="services-list">
          {renderServices()}
        </div>
      </div>
    </div>
  );
}