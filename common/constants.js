module.exports = {
  // The opacity value of favicon background colors
  BACKGROUND_FADE: 0.5,

  // Age of bookmarks in milliseconds that results in a 1.0 quotient, i.e., an
  // age smaller/younger than this value results in a larger-than-1.0 fraction
  BOOKMARK_AGE_DIVIDEND: 3 * 24 * 60 * 60 * 1000,

  // What is our default locale for the app?
  DEFAULT_LOCALE: "en-US",

  // Locales that should be displayed RTL
  RTL_LIST: ["ar", "he", "fa", "ur"],

  // Number of large Highlight titles in the new Highlights world, including
  // all rows.
  HIGHLIGHTS_LENGTH: 9,

  // How many items per query?
  LINKS_QUERY_LIMIT: 500,

  // This is where we cache redux state so it can be shared between pages
  LOCAL_STORAGE_KEY: "ACTIVITY_STREAM_STATE",

  // Default number of top sites
  TOP_SITES_DEFAULT_LENGTH: 6,

  // Number of top sites with show more pref enabled
  TOP_SITES_SHOWMORE_LENGTH: 12,

  // This is a perf event
  WORKER_ATTACHED_EVENT: "WORKER_ATTACHED",

  // Newtab preferences encoding
  NEWTAB_PREFS_ENCODING: {
    "showSearch": 1 << 0,
    "showTopSites": 1 << 1,
    "showHighlights": 1 << 2,
    "showMoreTopSites": 1 << 3
  },

  // The minimum size to consider an icon high res
  MIN_HIGHRES_ICON_SIZE: 64
};
