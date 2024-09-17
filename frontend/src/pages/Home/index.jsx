import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/auth";
import { HiUser } from "react-icons/hi2";
import { FiLogOut, FiMessageCircle } from "react-icons/fi";
import './styles.scss'

export const HomePage = () => {
  const { logOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div id="home">
      <div id="header">
        <div>
          <strong>Barber Connect</strong>
        </div>

        <button type="button" onClick={() => navigate('/profile')}>
          <HiUser color="#22BE62" size={56} />

          <span>Olá, {user?.name.split(' ').at(0)}</span>
        </button>

        <div>
          <Link to="#">
            <FiMessageCircle size={38} color="#fff" />
          </Link>

          <button type="button">
            <FiLogOut size={38} color="#fff" onClick={logOut} />
          </button>
        </div>
      </div>

      <div id="content">

      </div>
    </div>
  );
}