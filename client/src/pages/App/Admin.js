import React from 'react';
import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Layout } from "../../components/Layout";
import Config from '../Config';
import Dashboard from '../Dashboard';
import Site from '../Site';

const Admin = () => {
  return (
    <Layout>
      <Switch>
        <Route path='/app/dashboard/:page?' component={Dashboard} />
        <Route path='/app/config' component={Config} />
        <Route path='/app/site' component={Site} />
        <Route><Redirect to="/app/dashboard" /></Route>
      </Switch>
    </Layout>
  );
}

export default Admin;
