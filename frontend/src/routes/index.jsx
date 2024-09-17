import { Routes as DOMRoutes, Outlet, Route } from 'react-router-dom';
import { PublicRoutes } from './Public';
import { PrivateRoutes } from './Private';
import { LoginPage } from '../pages/Login';
import { HomePage } from '../pages/Home';
import { SignUpPage } from '../pages/SignUp';
import { ProfilePage } from '../pages/Profile';

export const Routes = () => {
  return (
    <DOMRoutes>
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

      <Route
        Component={() => (
          <PrivateRoutes>
            <Outlet />
          </PrivateRoutes>
        )}
      >
        <Route path="/home" Component={HomePage} />
        <Route path="/profile" Component={ProfilePage} />
      </Route>
    </DOMRoutes>
  )
};
