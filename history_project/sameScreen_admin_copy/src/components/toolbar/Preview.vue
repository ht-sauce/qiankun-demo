<style scoped>
  .tool-chat {
	height: calc(100vh - 62px);
}
.chat-icon{
	position: fixed;
	left: 30px;
	bottom: 30px;
	cursor: pointer;
	z-index: 20;
}
</style>
<template>
  <div>
    <el-drawer :title="title" :visible.sync="drawer" :modal="false" :modal-append-to-body="false" direction="ltr">
      <ChatDialog v-if="type == 'online'" :calluuid="calluuid" class="tool-chat" />
      <TextPreview :bizId="bizId" :corpId="corpId" v-else-if="type == 'text'" />
    </el-drawer>
    <el-button @click.stop="drawer = true" size="small" class="chat-icon" type="primary" circle>转</el-button>
  </div>
</template>
<script>
import ChatDialog from "./ChatDialog"
import TextPreview from "./TextPreview"
import {
  mapState,
  mapActions
} from "vuex"
import phone from "@/api/phone.js"
import config from "@/api/config.js"

export default {
  props: {
    bizId: {
      type: String,
      required: true
    },
    corpId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      drawer: false,
      type: "online",
      calluuid: ""
    }
  },
  computed: {
    ...mapState('phone', [
      "opened"
    ]),
    title() {
      return this.type == "text" ? "文本预览" : "人机对话";
    }
  },
  methods: {
    ...mapActions("phone", [
      "setOpen",
      "setStatus"
    ]),
    online() {
      this.type = "online";
      let extraHeaders = [`X-corp-id:${this.corpId}`, `X-biz-id:${this.bizId}`];
      if (!this.opened) {
        return;
      }
      phone.callout(config.getConfig("fsconfig").preview, {
        extraHeaders
      })
    },
    text() {
      this.type = "text";
      this.drawer = true;
    },
    hangup() {
      phone.hangup();
    }
  },
  mounted() {
    if (!this.opened) {
      phone.open();
    }
    phone.onMessage(res => {
      let msgType = res.msgType;
      if (msgType == "EventOpened") {
        this.setOpen(res.status);
      } else if (msgType == "EventDialing") {
        this.setStatus("dialing")
      } else if (msgType == "EventEstablished") {
        this.setStatus("established")
      } else if (msgType == "EventReleased") {
        this.setStatus("")
        this.calluuid = "";
      } else if (msgType == "EventRinging") {
        this.calluuid = res.data.calluuid;
        this.drawer = true;
      }
    })
  },
  components: {
    ChatDialog,
    TextPreview
  }
}
</script>