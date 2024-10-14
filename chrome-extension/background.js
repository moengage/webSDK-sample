/**
 *  moengage-web-sdk-serviceworker v{{ VERSION }}
 * (c) MoEngage Inc. http://moengage.com
 */
var MoengageSW = (function(self) {
  var baseDomain = {
    env: 'sdk-01.moengage.com',
    get: function() {
      return 'https://' + baseDomain.env;
    },
    set: function(env) {
      baseDomain.env = env;
    }
  };
  var URLS = {
    addReport: function() {
      return baseDomain.get() + '/v2/report/add';
    },
    batch: function() {
      return baseDomain.get() + '/v2/sdk/report/';
    },
    FCM_END_POINT: 'https://fcm.googleapis.com/fcm/send/',
    MOZILLA_END_POINT: 'https://updates.push.services.mozilla.com/wpush/v2/',
    EDGE_END_POINT: 'https://wns2-pn1p.notify.windows.com/w/?token=',
    SAFARI_END_POINT: 'https://web.push.apple.com/'
  };

  async function setStoreData(key, value) {
    await chrome.storage.local.set({ [key]: value });
  }

  // To get items with async/await
  async function getStoreData(key) {
    const data = (await chrome.storage.local.get([key])) || {};
    return data[key];
  }

  async function removeStoreData(key) {
    await chrome.storage.local.remove(key);
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
      await chrome.storage.local.set({ moe_backup: data });
    }
  }

  async function removeCampaignData(key) {
    const data = (await getStoreData('moe_backup')) || {};
    if (data) {
      delete data[key];
      await chrome.storage.local.set({ moe_backup: data });
      return true;
    }
    return false;
  }

  async function getOfflineStoreData(key) {
    const data = (await getStoreData('offline_data')) || {};
    return data[key];
  }

  async function resetStorageData(params) {
    await removeStoreData('moe_backup');
    await removeStoreData('reportParams');
    await removeStoreData('offline_data');
  }
  // Iterates all data in a specified chrome.storage area
  function iterateData(data, callback) {
    return new Promise((resolve, reject) => {
      resolve(Object.keys(data).map(key => callback(key, data[key])));
    });
  }

  // we remove the campaigns saved in indexedDB after 28 days
  // FCM follow 28 days.
  const MAX_DAYS_CAMPAIGN_SAVE = 28;

  var init = async function() {
    console.log('Init Function call');
    await resetStorageData();
    self.addEventListener('install', onInstall);
    self.addEventListener('activate', onActivate);
    chrome.runtime.onMessage.addListener(onMessage);
    self.addEventListener('push', onPush);
    self.addEventListener('notificationclick', onNotificationClick);
    self.addEventListener('notificationclose', onNotificationClose);
    self.addEventListener('sync', onSync);
    initOfflineSync();
  };

  function onInstall(event) {
    console.log('Service Worker onInstall');
    event.waitUntil(self.skipWaiting());
  }

  function onActivate(event) {
    console.log('Service Worker OnActive');
    event.waitUntil(self.clients.claim());
  }

  async function onMessage(event) {
    if (event.data) {
      if (event.data.app_id) {
        await setStoreData('reportParams', event);
        if (event.data?.environment) {
          baseDomain.set(event.data.environment);
        }
      } else if (event.data.cartToken) {
        //track cart cookie as user attribute
        event.waitUntil(
          getStoreData('reportParams')
            .then(function(res) {
              if (res.data.environment) {
                baseDomain.set(res.data.environment);
              }
              return;
            })
            .then(function() {
              return trackCartToken(event.data);
            })
        );
      }
    }
  }

  function trackCartToken(data) {
    return new Promise((resolve, reject) => {
      //check upto 5 seconds if cart cookie exists
      let maxSecondsToCheck = 5;
      const cartTokenInterval = setInterval(async () => {
        try {
          const cookie = await cookieStore.get('cart');

          if (cookie && cookie.value) {
            //cookie found, clearInterval and track the cookie as cart_token
            clearInterval(cartTokenInterval);
            const extraKeys = {
              h: '',
              meta: {
                bid: uuidV4()
              },
              url: data.url
            };
            const idbPayload = { cart_token: cookie.value }; //setting this key to check if re-tracking cart_token attribute is eligible on next page
            const userId = data.moe_user_id;
            if (userId) {
              extraKeys['identifiers'] = {
                moe_user_id: userId
              };

              //setting this key to check if re-tracking cart_token attribute is eligible on next page
              idbPayload['USER_ATTRIBUTE_UNIQUE_ID'] = userId;
            }
            trackEvent(
              'EVENT_ACTION_USER_ATTRIBUTE',
              {
                cart_token: cookie.value
              },
              undefined,
              extraKeys
            );
            await setStoreData('shopify_cookie_attr', idbPayload);
            resolve();
          }

          maxSecondsToCheck--;
          if (maxSecondsToCheck <= 0) {
            //5 second elapsed, clearInterval
            clearInterval(cartTokenInterval);
            resolve();
          }
        } catch (error) {
          //error occurred while trying to get the cookie
          clearInterval(cartTokenInterval);
          console.error(`Unable to fetch the cart cookie: ${error}`);
          resolve();
        }
      }, 1000);
    });
  }

  async function onPush(event) {
    console.log('Service Worker OnPush');
    if (!(self.Notification && self.Notification.permission === 'granted')) {
      return;
    }
    removeOldCampaignsFromIndexedDB();
    var campaignId;
    var idbData = {};
    event.waitUntil(
      getStoreData('reportParams')
        .then(function(res) {
          if (res && res.data) {
            idbData = res.data;
            if (res.data.environment) {
              baseDomain.set(res.data.environment);
            }
          }
          return;
        })
        .then(function() {
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
        .then(async function(data) {
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
              'MOE_NO_PAYLOAD_WEB',
              {
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
            'NOTIFICATION_RECEIVED_WEB_MOE',
            {
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
            requireInteraction:
              (payload && !JSON.parse(data.payload.reqInteract)) || false,
            actions: payload.actions,
            image: payload.image
          };

          return showNotification(payload.title, params);
        })
        .catch(function(err) {
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
        iterateData(data, function(dbCampaignId) {
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
    iterateData(data, async function(campaignId, campaign) {
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

    var eventTracker = new Promise(async function(res) {
      const data = await getCampaignData();
      iterateData(data, async function(campaignId, campaign) {
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
            'NOTIFICATION_CLICKED_WEB_MOE',
            {
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
      }).then(function(result) {
        console.info('Web Push Campaign clicked: ', result);
        res();
      });
    });

    event.waitUntil(
      getStoreData('reportParams')
        .then(function(res) {
          if (res.data.environment) {
            baseDomain.set(res.data.environment);
          }
          return;
        })
        .then(function() {
          return Promise.all([clickResponsePromise, eventTracker]);
        })
    );
  }

  async function onNotificationClose(event) {
    var notificationData = event.notification.data;
    const data = await getCampaignData();
    iterateData(data, function(campaignId, campaign) {
      if (campaignId == notificationData.cid) {
        //   moeCampaignsDB.removeItem(campaignId);
        return campaignId;
      }
    }).then(function(result) {
      console.info('Web Push Campaign closed: ', result);
    });
  }

  function splitEndPointSubscription(subscriptionDetails) {
    var endpoint = subscriptionDetails.endpoint;
    if (endpoint.indexOf(URLS.FCM_END_POINT) === 0) {
      return endpoint.replace(URLS.FCM_END_POINT, '');
    } else if (endpoint.indexOf(URLS.MOZILLA_END_POINT) === 0) {
      return endpoint.replace(URLS.MOZILLA_END_POINT, '');
    } else if (endpoint.indexOf(URLS.SAFARI_END_POINT) === 0) {
      return endpoint.replace(URLS.SAFARI_END_POINT, '');
    } else if (endpoint.indexOf(URLS.EDGE_END_POINT) === 0) {
      return endpoint.replace(URLS.EDGE_END_POINT, '');
    }
    return subscriptionDetails.subscriptionId;
  }

  function constructGet(url, params) {
    url = url + '?';
    for (var key in params) {
      url += key + '=' + params[key] + '&';
    }
    return url;
  }

  function showNotification(title, data) {
    return self.registration.showNotification(title, data);
  }

  function showNotificationForError(title, data) {
    return self.registration.showNotification(title, data).then(function() {
      setTimeout(closeNotifications, 2000);
    });
  }

  function closeNotifications() {
    self.registration.getNotifications().then(function(notifications) {
      for (var i = 0; i < notifications.length; ++i) {
        notifications[i].close();
      }
    });
  }

  function trackEvent(eventName, attrs, flag, extraKeys = {}) {
    getStoreData('reportParams').then(function(res) {
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
        .then(function(subscription) {
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
            viewsInfo: [
              {
                EVENT_ACTION: eventName,
                EVENT_ATTRS: attrs,
                EVENT_G_TIME: new Date().getTime().toString(),
                EVENT_L_TIME: convertDateToDateMonthYearFormat()
              }
            ],
            ...extraKeys
          };

          fetch(URLS.batch() + data.app_id, {
            method: 'POST',
            body: JSON.stringify(payload)
          }).then(function(response) {
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

  /**
   * Sync event will be registered incase of offline mode
   * Background sync supported browsers will replay in periodic intervals till promise is resolved
   */
  function onSync(event) {
    console.log('Service Worker OnSync');
    if (event.tag === 'moe_offline_data_sync') {
      event.waitUntil(
        openDatabaseAndReplayMOERequests().then(function(message) {
          // callback on success
        })
      );
    }
  }

  /**
   * Merges multiple batch reports from offline db
   */
  function mergeMOEReports() {
    return new Promise(function(resolve) {
      return Object.keys(getStoreData('offline_data'))
        .then(function(keys) {
          return keys;
        })
        .then(function(keys) {
          return new Promise(function() {
            var promises = [];
            keys.map(function(key) {
              if (key !== 'requestMetaData') {
                getOfflineStoreData(key).then(res => {
                  promises.push(getOfflineStoreData(res));
                });
              }
            });
            Promise.all(promises).then(function(reports) {
              resolve(reports);
            });
          });
        });
    });
  }

  /**
   * Flattens the array
   */
  function flattenArray(reports) {
    return reports.reduce(function(acc, report) {
      return Array.isArray(report)
        ? acc.concat(flattenArray(report))
        : acc.concat(report);
    }, []);
  }

  /**
   * Reterives API request metadata from offline db
   */
  function getRequestMetaData() {
    return getStoreData('requestMetaData').then(function(requestMetaData) {
      return requestMetaData;
    });
  }

  /**
   * Creates Report Adf request object
   */
  function requestPayload() {
    return Promise.all([getRequestMetaData(), mergeMOEReports()]).then(function(
      moeRequestValues
    ) {
      if (moeRequestValues[0] && moeRequestValues[1]) {
        var requestData = moeRequestValues[0];
        var mergedReports = flattenArray(moeRequestValues[1]);
        requestData.viewsInfo = mergedReports;
        requestData.viewsCount = mergedReports.length;
        return requestData;
      }
      return;
    });
  }

  /**
   * Replays failed report_add requests in a single batch
   * Fetches offline data from indexdb
   */
  function openDatabaseAndReplayMOERequests() {
    return new Promise(function(resolve, reject) {
      requestPayload()
        .then(function(reports) {
          if (!reports) {
            resolve('No pending requests to replay');
          } else {
            return fetch(URLS.batch() + reports.query_params.app_id, {
              method: 'POST',
              body: JSON.stringify(reports)
            })
              .then(function(response) {
                return response.json();
              })
              .then(function(response) {
                if (response.status !== 'success') {
                  throw new Error();
                }
                return removeStoreData('offline_data').then(function() {
                  resolve(
                    'successfully replayed failed requests and cleared db'
                  );
                });
              });
          }
        })
        .catch(function(err) {
          reject('Replaying failed.', err);
        });
    });
  }

  /**
   * Browsers that won't support background sync will replay when service worker starts.
   * Fallback strategy
   */
  function initOfflineSync() {
    getStoreData('reportParams').then(function(res) {
      if (
        res &&
        res.data &&
        (res.data.isBatchingEnabled === 'allowed' ||
          res.data.isBatchingEnabled === true)
      ) {
        openDatabaseAndReplayMOERequests()
          .then(function(message) {
            console.log(message);
          })
          .catch(function(message) {
            console.log(message);
          });
      }
    });
  }

  return {
    init: init
  };
})(self);

MoengageSW.init();

self.addEventListener('fetch', event => {
  // This is a dummy event listener
  // just to pass the PWA installation criteria on
  // some browsers
});
