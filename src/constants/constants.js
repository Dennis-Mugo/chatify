// export const baseUrl = "https://say-hello-rp4s4n4rcq-uc.a.run.app/chatify--chat/us-central1";
export const baseUrl = "http://127.0.0.1:5001/chatify--chat/us-central1";
export const searchFriendsUrl =
  "https://search-friends-rp4s4n4rcq-uc.a.run.app/chatify--chat/us-central1";
export const getConnectionsUrl =
  "https://get-connections-rp4s4n4rcq-uc.a.run.app/chatify--chat/us-central1";

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
    } else if (diff < 24 * 60 * 60 * 1000) {
      return Time.getTime(nanoSeconds);
    } else if (diff < 2 * 24 * 60 * 60 * 1000) {
      return "Yesterday";
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return t.toLocaleDateString("en-GB", { weekday: "long" });
    } else {
      return t.toLocaleDateString();
    }
  },

  bubbleRelativeDate: (nanoSeconds) => {
    let nano = parseInt(nanoSeconds);
    let now = Date.now();
    let diff = now - nano;
    let t = new Date(nano);

    if (diff < 24 * 60 * 60 * 1000) {
      return Time.getTime(nanoSeconds);
    } else if (diff < 2 * 24 * 60 * 60 * 1000) {
      return "Yesterday, " + Time.getTime(nanoSeconds);
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return (
        t.toLocaleDateString("en-GB", { weekday: "long" }) +
        ", " +
        Time.getTime(nanoSeconds)
      );
    } else {
      return t.toLocaleDateString() + ", " + Time.getTime(nanoSeconds);
    }
  },
};
