import { Routes as DOMRoutes, Outlet, Route } from 'react-router-dom';
import { PublicRoutes } from './Public';
import { PrivateRoutes } from './Private';
import { LoginPage } from '../pages/Login';
import { SchedulePage } from '../pages/Schedule';
import { SignUpPage } from '../pages/SignUp';
import { ProfilePage } from '../pages/Profile';
import { BarberRoutes } from './Barber';
import { ClientRoutes } from './Client';
import { BarbersPage } from '../pages/Barbers';
import { CreateAppointmentPage } from '../pages/CreateAppointment';
import { AppointmentScheduledPage } from '../pages/AppointmentScheduled';
import { AppointmentsPage } from '../pages/Appointments';

export const Routes = () => {
  return (
    <DOMRoutes>
      <Route
        path="/auth"
        Component={() => (
          <PrivateRoutes>
            <Outlet />
          </PrivateRoutes>
        )}
      >
        <Route
          Component={() => (
            <BarberRoutes>
              <Outlet />
            </BarberRoutes>
          )}
        >
          <Route path="schedule" Component={SchedulePage} />
        </Route>

        <Route
          Component={() => (
            <ClientRoutes>
              <Outlet />
            </ClientRoutes>
          )}
        >
          <Route path="barbers" Component={BarbersPage} />
          <Route path="appointments" Component={AppointmentsPage} />
          <Route path="appointments/create/:barberId" Component={CreateAppointmentPage} />
          <Route path="appointments/scheduled/:appointmentId" Component={AppointmentScheduledPage} />
        </Route>
        
        <Route path="profile" Component={ProfilePage} />
      </Route>

      <Route
        Component={() => (
          <PublicRoutes>
            <Outlet />
          </PublicRoutes>
        )}
      >
        <Route path="/" Component={LoginPage} />
        <Route path="/login" Component={LoginPage} />
        <Route path="/sign-up" Component={SignUpPage} />
      </Route>
    </DOMRoutes>
  )
};
