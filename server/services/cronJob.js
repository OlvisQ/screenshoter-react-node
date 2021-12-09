// var Queue = require('better-queue');
import cron from 'node-cron';
import webScreenShooter from './webScreenShooter';
import { Site } from '../models';
import fs from 'fs';
import { Config } from '../models';

let task = null;  // for taking a screenshot of website
let task2 = null; // for deleting the old file
let takingScreenDone = true;

const cronJob = {
  start,
  stop,
  destroy,
  startOldFileDelete,
}

// const taskList = [];

// function doneTask(id) {
//   const i = taskList.findIndex(t => t.id === id)
//   if (i >= 0) {
//     taskList[i] = {
//       id,
//       done: true
//     };
//   }
// }

// function isDoneAllTask() {
//   return taskList.findIndex(t => !t.done) < 0
// }

// const q = new Queue((function (sites, cb) {
//   sites.forEach(site => {
//     const task = {
//       id: site.id,
//       done: false
//     }
//     const index = taskList.findIndex(t => t.id === task.id)
//     if (index >= 0) {
//       taskList[index] = task;
//     } else {
//       taskList.push(task);
//     }

//     webScreenShooter.takeScreen(site.url, `${site.name}_${new Date().getTime().toString()}`, site.id).then(() => {
//       doneTask(task.id)
//       if (isDoneAllTask()) {
//         setTimeout(() => {
//           cb()
//         }, 1000)
//       }
//     }).catch(e => {
//       doneTask(task.id)
//       setTimeout(() => {
//         cb()
//       }, 1000)
//     })
//   })
// }), { batchSize: 3 })

function takeWebScreens() {
  if (!takingScreenDone) return;
  Site.findAll().then(async (sites) => {
    // sites.forEach(site => {
    //   q.push(site)
    // })
    takingScreenDone = false;
    for (let i = 0 ; i < sites.length; i++) {
      const site = sites[i];
      try {
        await webScreenShooter.takeScreen(site.url, `${site.name}_${new Date().getTime().toString()}`, site.id)
      } catch (error) {
        console.log(error)        
      }
    }
    takingScreenDone = true;
  })
}

function start(minute) {
  destroy();
  takeWebScreens()
  task = cron.schedule(`*/${parseInt(minute)} * * * *`, () => {
    console.log('cronJob triggered every ', minute, 'minutes');
    takeWebScreens()
  }, { scheduled: false })
  task.start()
}

function stop() {
  task && task.stop();
}

function destroy() {
  task && task.destroy();
  task = null;
}

const optHour = 4; // past 4 hours old files will be deleted

function deleteFile() {
  Config.findOne().then((c) => {
    if (c) {
      const { willDelOldFile } = c;
      if (willDelOldFile) {
        console.log('starting to delete the old files');
        const today = new Date();
        // delete old files
        fs.readdir(`${__dirname}/../../public/upload`, (err, files) => {
          if (err) {
            console.log(err);
          }
          files.forEach(file => {
            try {
              const rPath = `${__dirname}/../../public/upload/${file}`;
              const { birthtime } = fs.statSync(rPath);
              const diff = today - birthtime;
              const limit = optHour * 60 * 60 * 1000;
              if (diff > limit) { // if past optHour then it will be deleted.
                fs.unlinkSync(`${__dirname}/../../public/upload/${file}`)
              }
            } catch (err) {
              console.error(err)
            }
          })
        })
      }
    }
  })
}

function startOldFileDelete() {
  deleteFile()
  task2 = cron.schedule(`0 */4 * * *`, () => {
    deleteFile()
  }, { scheduled: false })
  task2.start()
}

export default cronJob;
