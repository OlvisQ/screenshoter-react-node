import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import Auth from '../Auth'
import Admin from './Admin';
import AuthProvider, { UserContext } from './AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <UserContext.Consumer>
        {({ user }) => (
          <Router>
            {user ? (
              <Switch>
                <Route path='/app' component={Admin} />
                <Route><Redirect to="/app" /></Route>
              </Switch>
            ) : (
                <Switch>
                  <Route path='/auth' component={Auth} />
                  <Route><Redirect to="/auth" /></Route>
                </Switch>
              )}
          </Router>
        )}
      </UserContext.Consumer>
    </AuthProvider>
  );
}
