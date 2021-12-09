import React from 'react';
import {
  Switch,
  Route,
  BrowserRouter as Router,
} from "react-router-dom";
import { NotFound } from "../../components/NotFound";
import Auth from '../Auth'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}
