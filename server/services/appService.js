import cronJob from './cronJob';
import { Config } from '../models';

const appService = {
  start
}

function start() {
  Config.findOne().then((c) => {
    if (c) {
      const { interval } = c;
      cronJob.start(interval);
    }
  })
  cronJob.startOldFileDelete();
}

export default appService;
