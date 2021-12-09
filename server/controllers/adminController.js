import express from "express";
import { failedJson, invalidParamJson, successJson } from "../helper/utils";
import { Site, Config, Screen } from '../models';
import cronJob from "../services/cronJob";
import { sendDataToClient } from "../services/socketService";
import webScreenShooter from "../services/webScreenShooter";

const router = express.Router();

// sites apis
router.get('/sites', (req, res) => {
  Site.findAll().then((sites) => {
    successJson(req, res, sites);
  }).catch(err => {
    failedJson(req, res, 'Something went wrong', err);
  })
})

router.post('/sites', (req, res) => {
  const { name, url } = req.body;
  if (name && url) {
    Site.create({
      name, url
    }).then((site) => {
      // take a screen
      webScreenShooter.takeScreen(url, `${name}_${new Date().getTime().toString()}`, site.id)
      //
      successJson(req, res, site);
    }).catch(err => {
      failedJson(req, res, 'Something went wrong', err)
    })
  } else {
    invalidParamJson(req, res);
  }
})

router.put('/sites/:id', (req, res) => {
  const { name, url } = req.body;
  const id = req.params.id;
  if (name && url) {
    Site.update({
      name, url
    }, {
      where: { id }
    }).then((ids) => {
      if (ids == 0) {
        failedJson(req, res, 'Does not exists')
      } else {
        // take a screen
        webScreenShooter.takeScreen(url, `${name}_${new Date().getTime().toString()}`, id)
        // response
        successJson(req, res, { id: parseInt(id), name, url });
      }
    }).catch(err => {
      failedJson(req, res, 'Something went wrong', err)
    })
  } else {
    invalidParamJson(req, res);
  }
})

router.delete('/sites/:id', (req, res) => {
  const id = req.params.id;
  Site.destroy({
    where: { id }
  }).then((ids) => {
    if (ids == 0) {
      failedJson(req, res, 'Does not exists')
    } else {
      Screen.findOne({
        where: { siteID: id }
      }).then((s) => {
        if (s) { // update
          sendDataToClient({ deleted: { id: parseInt(id) } })
          return s.update({ deleted: true });
        }
      })
      successJson(req, res, { id: parseInt(id) });
    }
  }).catch(err => {
    failedJson(req, res, 'Something went wrong', err)
  })
})

// config apis
router.get('/configs', (req, res) => {
  Config.findOne().then((config) => {
    successJson(req, res, config);
  }).catch(err => {
    failedJson(req, res, 'Something went wrong', err);
  })
})

router.put('/configs/:id', (req, res) => {
  const { row, col, interval, willDelOldFile } = req.body;
  if (row || col || interval) {
    let p = {}
    if (row) p = { ...p, row }
    if (col) p = { ...p, col }
    if (interval) p = { ...p, interval }
    if (willDelOldFile !== undefined && willDelOldFile !== null) p = { ...p, willDelOldFile }
    const params = p;
    Config.findOne().then((config) => {
      const isUpdatedInterval = config.interval !== interval;
      if (config) {
        config.update(params).then(() => {
          // send new layout information to client via socket
          sendDataToClient({ config: { ...params } })

          // if interval is updated, restart cronJob
          if (isUpdatedInterval) {
            cronJob.start(interval);
          }

          // response
          successJson(req, res, {}, 'Success');
        })
      } else {
        failedJson(req, res, 'Failed');
      }
    }).catch(err => {
      failedJson(req, res, 'Something went wrong', err);
    })
  } else {
    invalidParamJson(req, res);
  }
})

// screen apis
router.get('/screens', (req, res) => {
  Screen.findAll({ where: { deleted: false } }).then((screens) => {
    successJson(req, res, screens);
  }).catch(err => {
    failedJson(req, res, 'Something went wrong', err);
  })
})

export default router;
