/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/* globals XPCOMUtils, NewTabInit, TopSitesFeed */

"use strict";

const {utils: Cu} = Components;
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
const {Store} = Cu.import("resource://activity-stream/lib/Store.jsm", {});
const {actionTypes: at} = Cu.import("resource://activity-stream/common/Actions.jsm", {});

// Feeds
XPCOMUtils.defineLazyModuleGetter(this, "NewTabInit",
  "resource://activity-stream/lib/NewTabInit.jsm");
XPCOMUtils.defineLazyModuleGetter(this, "TopSitesFeed",
  "resource://activity-stream/lib/TopSitesFeed.jsm");

this.ActivityStream = class ActivityStream {

  /**
   * constructor - Initializes an instance of ActivityStream
   *
   * @param  {object} options Options for the ActivityStream instance
   * @param  {string} options.id Add-on ID. e.g. "activity-stream@mozilla.org".
   * @param  {string} options.version Version of the add-on. e.g. "0.1.0"
   * @param  {string} options.newTabURL URL of New Tab page on which A.S. is displayed. e.g. "about:newtab"
   */
  constructor(options) {
    this.initialized = false;
    this.options = options;
    this.store = new Store();
  }
  init() {
    this.initialized = true;
    this.store.init([
      new NewTabInit(),
      new TopSitesFeed()
    ]);
    this.store.dispatch({type: at.INIT});
  }
  uninit() {
    this.store.dispatch({type: at.UNINIT});
    this.store.uninit();
    this.initialized = false;
  }
};

this.EXPORTED_SYMBOLS = ["ActivityStream"];
