import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/auth"
import { HiUser } from "react-icons/hi2";
import { FiCalendar, FiLogOut, FiMessageCircle } from "react-icons/fi";
import './styles.scss'

export const Header = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  return (
    <div id="header">
      <button onClick={() => navigate('/')}>
        <strong>Barber Connect</strong>
      </button>

      <button type="button" onClick={() => navigate('/auth/profile')}>
        <HiUser color="#22BE62" size={56} />

        <span>Olá, {user?.name.split(' ').at(0)}</span>
      </button>

      <div>
        {user.access === 1 && (
          <Link to="/auth/appointments">
            <FiCalendar size={38} color="#fff" />
          </Link>
        )}

        <Link to="#">
          <FiMessageCircle size={38} color="#fff" />
        </Link>

        <button type="button">
          <FiLogOut size={38} color="#fff" onClick={logOut} />
        </button>
      </div>
    </div>
  )
}