import { thumb } from 'node-thumbnail';
import captureWebsite from 'capture-website';
import { Screen } from '../models';
import { sendDataToClient } from './socketService';

const webScreenShooter = {
  takeScreen,
}

const options = {
  width: 1920,
  height: 1080,
  scaleFactor: 2,
  quality: 1,
  type: 'jpeg',
  delay: 1,
  launchOptions: {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  }
}

const taskList = [];

function takeScreen(url, filename, siteID) {
  return new Promise(async (resolve, reject) => {
    const task = {
      id: siteID,
      working: true,
    }
    try {
      if (url && filename && siteID) {
        console.log('trying to take a screen of', siteID);
        if (taskList.findIndex(t => t.id === siteID && t.working) >= 0) { // it is working
          console.log('already taking of', siteID);
          reject(`already taking of ${siteID}`);
          return;
        }
        // set task working status
        const index = taskList.findIndex(t => t.id === task.id)
        if (index >= 0) {
          taskList[index] = task;
        } else {
          taskList.push(task);
        }

        const uploadPath = `${__dirname}/../../public/upload/`;
        const filePath = `${uploadPath}${filename}.png`;
        await captureWebsite.file(`${url}`, `${filePath}`, options);
        await thumb({
          source: `${filePath}`,
          destination: `${uploadPath}`,
          width: 800,
        });

        // save screen information to Screen Table
        const params = {
          url: `upload/${filename}.png`,
          thumbUrl: `upload/${filename}_thumb.png`,
          siteID: task.id
        }
        const s = await Screen.findOne({
          where: { siteID: task.id }
        })
        if (s) { // update
          if (!s.deleted) {
            // send changes to client via socket
            const updated = await s.update(params);
            sendDataToClient({ screen: { ...params, id: updated.id } })
          }
        } else { // insert
          // send changes to client via socket
          const updated = await Screen.create(params)
          sendDataToClient({ screen: { ...params, id: updated.id } })
        }
        stopTask(task.id)
        resolve('Done')
      } else {
        resolve('Done')
      }
    } catch (err) {
      console.log(err);
      // set task non-working status
      stopTask(task.id)
      reject(err)
    }
  })
}

// set task non-working status
function stopTask(id) {
  console.log('trying to stop task of', id)
  const i = taskList.findIndex(t => t.id === id)
  if (i >= 0) {
    taskList[i] = {
      id,
      working: false
    };
    console.log('stopped task of', id)
  }
}

export default webScreenShooter;
