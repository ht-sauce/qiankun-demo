import {
  getObjValue
} from "@/utils/obj.js"

import storage from "@/api/storage.js"

export default {
  config: null,
  init(conf) {
    this.config = conf;
  },
  getConfig(key) {
    return this.config[key];
  },
  getValue(target, path) {
    return getObjValue(target, path);
  },
  formatOssFile(url) {
    return (this.getConfig("ossfile") + '/' + url).replace(/([^:])\/\//g, "$1/");
  },
  formatVoiceUrl(url) {
    return (this.getConfig("voicefile") + '/' + url).replace(/([^:])\/\//g, "$1/");
  },
  formatSSUrl(url, bizId) {
    let ssFile = this.getConfig("ssfile");
    ssFile = ssFile.replace("{corpId}", storage.getCorpId("corpid")).replace("{bizId}", bizId);
    return (ssFile + url).replace(/([^:])\/\//g, "$1/");
  },
  formatSecond(secs) {
    if (!secs) {
      return "--";
    }
    let min = parseInt(secs / 60),
      sec = secs % 60;
    let ret = "";
    if (min > 0) {
      ret = min + "分"
    }
    ret += sec + "秒"
    return ret;
  }
}