/**
 *  moengage-web-sdk-serviceworker v{{ VERSION }}
 * (c) MoEngage Inc. http://moengage.com
 */

// Download the service worker code from https://cdn.moengage.com/release/{Your_DC}/versions/2/serviceworker_chrome_ext_cdn.js
// Add that code in your background.js file
// Use that code to register the service worker in your chrome extension

var MoengageSW = (function (self) {
  var baseDomain = {
    env: 'sdk-01.moengage.com',
    get: function () {
      return 'https://' + baseDomain.env;
    },
    set: function (env) {
      baseDomain.env = env;
    }
  };
  var URLS = {
    addReport: function () {
      return baseDomain.get() + '/v2/report/add';
    },
    batch: function () {
      return baseDomain.get() + '/v2/sdk/report/';
    },
    FCM_END_POINT: 'https://fcm.googleapis.com/fcm/send/',
  };

  async function setStoreData(key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({
        [key]: value
      }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError));
        } else {
          resolve();
        }
      });
    });
  }

  // To get items with async/await

  async function getStoreData(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError));
        } else {
          resolve(result[key]);
        }
      });
    });
  }

  async function removeStoreData(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError));
        } else {
          resolve();
        }
      });
    });
  }

  async function getCampaignData(key) {
    const data = (await getStoreData('moe_backup')) || {};
    if (key) {
      return data[key];
    }
    return data;
  }

  async function setCampaingData(key, value) {
    const data = (await getStoreData('moe_backup')) || {};
    if (data) {
      data[key] = value;
      await setStoreData('moe_backup', data);
    }
  }

  async function removeCampaignData(key) {
    const data = (await getStoreData('moe_backup')) || {};
    if (data) {
      delete data[key];
      await setStoreData('moe_backup', data);
      return true;
    }
    return false;
  }

  async function resetStorageData(params) {
    await removeStoreData('moe_backup');
    await removeStoreData('reportParams');
  }
  // Iterates all data in a specified chrome.storage area
  function iterateData(data, callback) {
    return new Promise((resolve, reject) => {
      for (let key of Object.keys(data)) {
        let result = callback(key, data[key]);
        if (result !== undefined) {
          resolve(result); // Return the response from the callback
        }
      }
    });
  }

  // we remove the campaigns saved in indexedDB after 28 days
  // FCM follow 28 days.
  const MAX_DAYS_CAMPAIGN_SAVE = 28;

  var init = async function () {
    await resetStorageData();
    self.addEventListener('install', onInstall);
    self.addEventListener('activate', onActivate);
    chrome.runtime.onMessage.addListener(onMessage);
    self.addEventListener('push', onPush);
    self.addEventListener('notificationclick', onNotificationClick);
    self.addEventListener('notificationclose', onNotificationClose);
  };

  function onInstall(event) {
    event.waitUntil(self.skipWaiting());
  }

  function onActivate(event) {
    event.waitUntil(self.clients.claim());
  }

  async function onMessage(event) {
    if (event.data) {
      if (event.data.app_id) {
        await setStoreData('reportParams', event);
        if (event.data && event.data.environment) {
          baseDomain.set(event.data.environment);
        }
      }
    }
  }

  async function onPush(event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
      return;
    }
    removeOldCampaignsFromIndexedDB();
    var campaignId;
    var idbData = {};
    event.waitUntil(
      getStoreData('reportParams')
      .then(function (res) {
        if (res && res.data) {
          idbData = res.data;
          if (res.data && res.data.environment) {
            baseDomain.set(res.data.environment);
          }
        }
        return;
      })
      .then(function () {
        try {
          var jsonPayload = event.data.json();
          if (jsonPayload) {
            return jsonPayload;
          }
        } catch (err) {
          console.error(
            'payload not received or has some errors in Moengage Push'
          );
        }
      })
      .then(async function (data) {
        var payload = data.payload;
        if (!(payload && payload.moe_cid_attr)) return;
        if (data.cid) {
          campaignId = data.cid;
          const isCampaigTriggered = await isCampaignAlreadyTriggered(
            campaignId
          );
          if (isCampaigTriggered) {
            throw new Error(
              `The campaign ${campaignId} has already been executed.`
            );
          }
          var campaignBackup = {
            cid: campaignId
          };

          if (payload) {
            campaignBackup = {
              cid: campaignId,
              title: payload.title,
              message: payload.message,
              actions: payload.actions,
              image: payload.image,
              moe_cid_attr: payload.moe_cid_attr,
              timestamp: Date.now()
            };
          }

          await setCampaingData(campaignId, campaignBackup);
        }

        if (!payload || !payload.title || !payload.message) {
          trackEvent(
            'MOE_NO_PAYLOAD_WEB', {
              cid: data.cid
            },
            0
          );
          console.error('Moengage - Web Push payload error');
          return showNotificationForError('Welcome', {
            body: 'Something unexpected happened',
            requireInteraction: false
          });
        }

        var campaign_id;
        var campaign_name;
        try {
          campaign_id = payload.moe_cid_attr.moe_campaign_id;
          campaign_name = payload.moe_cid_attr.moe_campaign_name;
        } catch (err) {
          throw new Error('cannot get campaign ID or campaign Name.');
        }

        trackEvent(
          'NOTIFICATION_RECEIVED_WEB_MOE', {
            cid: campaignId,
            moe_campaign_id: campaign_id,
            moe_campaign_name: campaign_name,
            ...payload.moe_cid_attr
          },
          1
        );

        var params = {
          body: payload.message,
          icon: payload.icon,
          tag: data.cid || 'moe-id',
          badge: payload.badge,
          data: {
            url: payload.urlToOpen,
            actions: payload.actions,
            cid: campaignId
          },
          requireInteraction: (payload && !JSON.parse(data.payload.reqInteract)) || false,
          actions: payload.actions,
          image: payload.image
        };

        return showNotification(payload.title, params);
      })
      .catch(function (err) {
        console.error('Moengage Service Worker Error - ', err);
        return showNotificationForError('Welcome', {
          body: 'Something unexpected happened',
          requireInteraction: false
        });
      })
    );
  }

  async function isCampaignAlreadyTriggered(campaignId) {
    try {
      const campaignData = (await getStoreData('moe_backup')) || {};
      const campaignDataLength = Object.keys(campaignData).length;
      if (campaignDataLength === 0) {
        throw new Error('Existing campaign not present in indexedDB');
      } else {
        const data = await getCampaignData();
        iterateData(data, function (dbCampaignId) {
          if (campaignId === dbCampaignId) {
            return true;
          }
        }).then(isTriggered => {
          return isTriggered;
        });
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async function removeOldCampaignsFromIndexedDB() {
    const data = await getCampaignData();
    iterateData(data, async function (campaignId, campaign) {
      const now = Date.now();
      const timeDiff = (now - campaign.timestamp) / (1000 * 60 * 60 * 24);
      if (timeDiff > MAX_DAYS_CAMPAIGN_SAVE) {
        await removeCampaignData(campaignId);
      }
    });
  }

  function onNotificationClick(event) {
    var notificationTitle;
    var notificationData = event.notification.data;
    event.notification.close();
    var clickResponsePromise = Promise.resolve();
    if (notificationData) {
      if (
        event.action === '0' &&
        notificationData.actions &&
        notificationData.actions instanceof Array &&
        notificationData.actions.length > 0 &&
        notificationData.actions[0].url
      ) {
        clickResponsePromise = clients.openWindow(
          notificationData.actions[0].url
        );
        notificationTitle = notificationData.actions[0].title;
      } else if (
        event.action === '1' &&
        notificationData.actions &&
        notificationData.actions instanceof Array &&
        notificationData.actions.length > 1 &&
        notificationData.actions[1].url
      ) {
        clickResponsePromise = clients.openWindow(
          notificationData.actions[1].url
        );
        notificationTitle = notificationData.actions[1].title;
      } else if (notificationData.url) {
        clickResponsePromise = clients.openWindow(notificationData.url);
        notificationTitle = notificationData.title;
      }
    }

    var eventTracker = new Promise(async function (res) {
      const data = await getCampaignData();
      iterateData(data, async function (campaignId, campaign) {
        if (campaignId == notificationData.cid) {
          var campaign_id;
          var campaign_name;
          try {
            campaign_id = campaign.moe_cid_attr.moe_campaign_id;
            campaign_name = campaign.moe_cid_attr.moe_campaign_name;
          } catch (err) {
            throw new Error(err);
          }
          trackEvent(
            'NOTIFICATION_CLICKED_WEB_MOE', {
              cid: campaign.cid,
              button: notificationTitle || void 0,
              moe_campaign_id: campaign_id,
              moe_campaign_name: campaign_name,
              ...campaign.moe_cid_attr
            },
            1
          );
          await removeCampaignData(campaignId);
          return campaignId;
        }
      }).then(function (result) {
        console.info('Web Push Campaign clicked: ', result);
        res();
      });
    });

    event.waitUntil(
      getStoreData('reportParams')
      .then(function (res) {
        if (res.data && res.data.environment) {
          baseDomain.set(res.data.environment);
        }
        return;
      })
      .then(function () {
        return Promise.all([clickResponsePromise, eventTracker]);
      })
    );
  }

  async function onNotificationClose(event) {
    var notificationData = event.notification.data;
    const data = await getCampaignData();
    iterateData(data, function (campaignId, campaign) {
      if (campaignId == notificationData.cid) {
        //   moeCampaignsDB.removeItem(campaignId);
        return campaignId;
      }
    }).then(function (result) {
      console.info('Web Push Campaign closed: ', result);
    });
  }

  function splitEndPointSubscription(subscriptionDetails) {
    var endpoint = subscriptionDetails.endpoint;
    if (endpoint.indexOf(URLS.FCM_END_POINT) === 0) {
      return endpoint.replace(URLS.FCM_END_POINT, '');
    }
    return subscriptionDetails.subscriptionId;
  }

  function showNotification(title, data) {
    return self.registration.showNotification(title, data);
  }

  function showNotificationForError(title, data) {
    return self.registration.showNotification(title, data).then(function () {
      setTimeout(closeNotifications, 2000);
    });
  }

  function closeNotifications() {
    self.registration.getNotifications().then(function (notifications) {
      for (var i = 0; i < notifications.length; ++i) {
        notifications[i].close();
      }
    });
  }

  function trackEvent(eventName, attrs, flag, extraKeys = {}) {
    getStoreData('reportParams').then(function (res) {
      if (!res) {
        return;
      }
      var data = res.data;
      // var postData = {
      //   e: eventName,
      //   a: attrs,
      //   f: flag,
      // };
      data.device_ts = getUtcTimestamp();
      delete extraKeys.h;

      self.registration.pushManager
        .getSubscription()
        .then(function (subscription) {
          if (subscription) {
            var subscriptionId = splitEndPointSubscription(subscription);
            if (subscriptionId) {
              data.push_id = subscriptionId;
            } else {
              delete data.push_id;
            }
          } else {
            //web push subscription not found
            delete data.push_id;
          }
          delete data.os_platform;
          data.app_ver = data.app_ver.toString();

          const payload = {
            query_params: data,
            meta: {
              bid: uuidV4(),
              request_time: new Date().toISOString()
            },
            viewsCount: 1,
            viewsInfo: [{
              EVENT_ACTION: eventName,
              EVENT_ATTRS: attrs,
              EVENT_G_TIME: new Date().getTime().toString(),
              EVENT_L_TIME: convertDateToDateMonthYearFormat()
            }],
            ...extraKeys
          };

          fetch(URLS.batch() + data.app_id, {
            method: 'POST',
            body: JSON.stringify(payload)
          }).then(function (response) {
            return response.json();
          });
        });
    });
  }

  function convertDateToDateMonthYearFormat() {
    const date = new Date();
    return `${date.getDate()}:${date.getMonth() +
      1}:${date.getFullYear()}:${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  function uuidV4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  function getUtcTimestamp() {
    var now = new Date();
    return Number(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
      )
    );
  }

  return {
    init: init
  };
})(self);

MoengageSW.init();