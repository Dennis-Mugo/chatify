// export const baseUrl = "https://say-hello-rp4s4n4rcq-uc.a.run.app/chatify--chat/us-central1";
export const baseUrl = "http://127.0.0.1:5001/chatify--chat/us-central1";
export const searchFriendsUrl =
  "https://search-friends-rp4s4n4rcq-uc.a.run.app/chatify--chat/us-central1";
export const getConnectionsUrl =
  "https://get-connections-rp4s4n4rcq-uc.a.run.app/chatify--chat/us-central1";
export const getNumUsersUrl =
  "https://get-num-users-rp4s4n4rcq-uc.a.run.app/chatify--chat/us-central1";
export const getNewUsersGraphUrl =
  "https://get-new-monthly-users-rp4s4n4rcq-uc.a.run.app//chatify--chat/us-central1";

export const Time = {
  getTime: (nanoSeconds) => {
    // console.log(nanoSeconds);
    let nano = parseInt(nanoSeconds);
    let d = new Date(nano);
    return d
      .toLocaleTimeString("en-US", { hour12: true, timeStyle: "short" })
      .toLowerCase();
  },

  relativeDate: (nanoSeconds) => {
    let nano = parseInt(nanoSeconds);
    let now = Date.now();
    let diff = now - nano;
    let t = new Date(nano);

    if (diff < 5 * 60 * 1000) {
      return "Now";
    } else if (Time.isToday(nanoSeconds)) {
      return Time.getTime(nanoSeconds);
    } else if (Time.isYesterday(nanoSeconds)) {
      return "Yesterday";
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return t.toLocaleDateString("en-GB", { weekday: "long" });
    } else {
      return t.toLocaleDateString();
    }
  },

  formatDate: (date) => {
    let dd = ("0" + date.getDate()).slice(-2);
    let mm = ("0" + (date.getMonth() + 1)).slice(-2);
    let yy = date.getFullYear();
    return `${dd}/${mm}/${yy}`;
  },

  bubbleRelativeDate: (nanoSeconds) => {
    let nano = parseInt(nanoSeconds);
    let now = Date.now();
    let diff = now - nano;
    let t = new Date(nano);

    if (Time.isToday(nanoSeconds)) {
      return Time.getTime(nanoSeconds);
    } else if (Time.isYesterday(nanoSeconds)) {
      return "Yesterday, " + Time.getTime(nanoSeconds);
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return (
        t.toLocaleDateString("en-GB", { weekday: "long" }) +
        ", " +
        Time.getTime(nanoSeconds)
      );
    } else {
      return Time.formatDate(t) + ", " + Time.getTime(nanoSeconds);
    }
  },

  formatLastSeen: (nanoSeconds) => {
    if (nanoSeconds.toLowerCase() === "online") return nanoSeconds;
    let nano = parseInt(nanoSeconds);
    let now = Date.now();
    let diff = now - nano;
    let t = new Date(nano);

    if (Time.isToday(nanoSeconds)) {
      return "Last seen today at " + Time.getTime(nanoSeconds);
    } else if (Time.isYesterday(nanoSeconds)) {
      return "Last seen yesterday at " + Time.getTime(nanoSeconds);
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return `Last seen on ${t.toLocaleDateString("en-GB", {
        weekday: "long",
      })} at ${Time.getTime(nanoSeconds)}`;
    } else {
      return `Last seen on ${Time.formatDate(t)} at  ${Time.getTime(
        nanoSeconds
      )}`;
    }
  },

  isToday: (nanoSeconds) => {
    let nano = parseInt(nanoSeconds);
    let now = Date.now();
    let diff = now - nano;
    let t = new Date(nano);
    let hoursSinceDayStarted = new Date(now).getHours();
    let diffInHours = diff / (1 * 60 * 60 * 1000);

    return diffInHours < hoursSinceDayStarted;
  },

  isYesterday: (nanoSeconds) => {
    let nano = parseInt(nanoSeconds);
    let now = Date.now();
    let diff = now - nano;
    let t = new Date(nano);
    let hoursSinceYesterdayStarted = new Date(now).getHours() + 24;
    let diffInHours = diff / (1 * 60 * 60 * 1000);

    return diffInHours < hoursSinceYesterdayStarted;
  },
};

export const getFileSize = (bytes) => {
  let kilobyte = 1024;
  if (bytes < kilobyte) {
    return bytes.toString() + " B";
  } else if (bytes <= Math.pow(kilobyte, 2)) {
    return parseInt(bytes / Math.pow(kilobyte, 1)).toString() + " KB";
  } else if (bytes <= Math.pow(kilobyte, 3)) {
    return parseInt(bytes / Math.pow(kilobyte, 2)).toString() + " MB";
  } else if (bytes <= Math.pow(kilobyte, 4)) {
    return parseInt(bytes / Math.pow(kilobyte, 3)).toString() + " GB";
  } else if (bytes <= Math.pow(kilobyte, 5)) {
    return parseInt(bytes / Math.pow(kilobyte, 4)).toString() + " TB";
  }
};

export const allowedDocumentFiles =
  ".xlsx,.xls,.doc,.docx,.ppt,.pptx,.txt,.pdf,.rtf,.zip,.php";

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
