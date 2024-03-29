enum global {
  GLOBAL_SET_IS_LOGGED_IN = "GLOBAL_SET_IS_LOGGED_IN",
  GLOBAL_SET_IS_LOADING = "GLOBAL_SET_IS_LOADING",
  GLOBAL_SET_IS_FETCHING = "GLOBAL_SET_IS_FETCHING",
  GLOBAL_INIT_AUTH = "GLOBAL_INIT_AUTH",
  GLOBAL_INIT_RE_AUTH = "GLOBAL_INIT_RE_AUTH",
  GLOBAL_INIT_LOGOUT = "GLOBAL_INIT_LOGOUT",
  GLOBAL_CHANGE_PASSWORD = "GLOBAL_CHANGE_PASSWORD",
  GLOBAL_SET_FORM_MESSAGE = "GLOBAL_SET_FORM_MESSAGE",
  GLOBAL_REQUEST_ERROR = "GLOBAL_REQUEST_ERROR",
  GLOBAL_SET_ERROR_FLAG = "GLOBAL_SET_ERROR_FLAG",
}

enum user {
  USER_GET_USER_DATA = "USER_GET_USER_DATA",
  USER_SET_USER_DATA = "USER_SET_USER_DATA",
  USER_SEND_USER_DATA = "USER_SEND_USER_DATA",
  USER_SET_ENTRIES = "USER_SET_ENTRIES",
  USER_FETCH_ENTRIES = "USER_FETCH_ENTRIES",
  USER_SET_PROJECTS = "USER_SET_PROJECTS",
  USER_CREATE_PROJECT = "USER_CREATE_PROJECT",
  USER_REMOVE_PROJECT = "USER_REMOVE_PROJECT",
  USER_UPLOAD_AVATAR = "USER_UPLOAD_AVATAR",
  USER_REMOVE_AVATAR = "USER_REMOVE_AVATAR",
  USER_SHOW_TIMER_ON_TITLE_BAR = "USER_SHOW_TIMER_ON_TITLE_BAR",
}

enum timer {
  TIMER_SET_IS_RUNNING = "TIMER_SET_IS_RUNNING",
  TIMER_SET_TIMER = "TIMER_SET_TIMER",
  TIMER_SET_DURATION = "TIMER_SET_DURATION",
  TIMER_SET_DESCRIPTION = "TIMER_SET_DESCRIPTION",
  TIMER_SET_BILLABLE = "TIMER_SET_BILLABLE",
  TIMER_SET_PROJECT = "TIMER_SET_PROJECT",
  TIMER_SET_CURRENT_ENTRY_ID = "TIMER_SET_CURRENT_ENTRY_ID",
  TIMER_HANDLE_RUNNING_ENTRY = "TIMER_HANDLE_RUNNING_ENTRY",
}

enum entry {
  ENTRY_CREATE = "ENTRY_CREATE",
  ENTRY_CREATE_FROM_EXISTING = "ENTRY_CREATE_FROM_EXISTING",
  ENTRY_UPDATE = "ENTRY_UPDATE",
  ENTRY_INSERT = "ENTRY_INSERT",
  ENTRY_INSERT_BATCH = "ENTRY_INSERT_BATCH",
  ENTRY_INIT_DELETE = "ENTRY_INIT_DELETE",
  ENTRY_DELETE = "ENTRY_DELETE",
  ENTRY_DELETE_CURRENT = "ENTRY_DELETE_CURRENT",
}

export const types = { ...global, ...user, ...timer, ...entry };
