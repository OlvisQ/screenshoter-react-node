import express from 'express';
import { adminAuth, adminSignUp } from '../controllers/jwtAuthController';
import adminController from '../controllers/adminController';

const router = express.Router();

const adminRoute = (passport) => {

  router.post('/login', adminAuth);
  router.post('/register', adminSignUp);
  router.post('/logout', (req, res) => { utils.successJson(req, res, 'Log out successfully') });

  router.use('/', passport.authenticate('jwt', { session: false }), adminController)

  return router;
}

export default adminRoute;
