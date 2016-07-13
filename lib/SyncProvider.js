const {Cu} = require("chrome");
const simplePrefs = require("sdk/simple-prefs");

Cu.importGlobalProperties(["fetch"]);
Cu.importGlobalProperties(["btoa"]);

function SyncProvider(options) {
  this.init(options);
}

SyncProvider.prototype = {
  init: function(options) {
    this.options = options;
    this.firebaseBaseUrl = "https://slynk-7fa8b.firebaseio.com/clients/";
    this.firebaseAuthQuery = "?auth\=YF0ina4mpjvPcb6V3syqrGPv9CpXogAJUR2aJfba";
    this.username = simplePrefs.prefs["sync.username"];
  },

  getCollectionUrl: function(source) {
    return this.firebaseBaseUrl + this.username + "/" + source + ".json" + this.firebaseAuthQuery;
  },

  prepareLinks: function(links) {
    const preparedLinks = {};

    if (links) {
      for (let link of links) {
        const urlKey = btoa(link.cacheKey + link.lastVisitDate);
        preparedLinks[urlKey] = link;
      }
    }

    return preparedLinks;
  },

  mergeLinks: function(existingLinks, remoteLinks) {
    const mergedLinks = {};

    if (existingLinks) {
      for (let existingLinkKey of Object.keys(existingLinks)) {
        mergedLinks[existingLinkKey] = existingLinks[existingLinkKey];
      }
    }

    if (remoteLinks) {
      for (let remoteLinkKey of Object.keys(remoteLinks)) {
        mergedLinks[remoteLinkKey] = remoteLinks[remoteLinkKey];
      }
    }

    return mergedLinks;
  },

  unpackLinks: function(packedLinks) {
    const unpackedLinks = [];

    for (let packedLinkKey of Object.keys(packedLinks)) {
      unpackedLinks.push(packedLinks[packedLinkKey]);
    }

    return unpackedLinks;
  },

  addLinks: function(source, links) {
    const collectionUrl = this.getCollectionUrl(source);

    return fetch(collectionUrl, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "put",
      body: JSON.stringify(links)
    }).then((res) => {
      return res.json();
    }).catch((res) => {
      return {};
    });
  },

  getLinks: function(source) {
    const collectionUrl = this.getCollectionUrl(source);

    return fetch(collectionUrl, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "get",
    })
    .then((res) => {
      return res.json();
    }).catch((res) => {
      return {};
    });
  },

  syncLinks: function(source, existingLinks) {
    return this.getLinks(source).then((remoteLinks) => {

      remoteLinks = remoteLinks || {};

      const preparedExistingLinks = this.prepareLinks(existingLinks);

      const mergedLinks = this.mergeLinks(preparedExistingLinks, remoteLinks);

      this.addLinks(source, mergedLinks);

      const unpackedLinks = this.unpackLinks(mergedLinks);

      unpackedLinks.sort((a, b) => {
        return b.lastVisitDate - a.lastVisitDate;
      });

      return unpackedLinks;
    });
  },
};

exports.SyncProvider = SyncProvider;
