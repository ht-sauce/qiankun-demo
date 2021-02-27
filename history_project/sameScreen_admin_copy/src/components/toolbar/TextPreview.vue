<style scoped>
  .text-preview{
	width: 100%;
	height: 100%;
	padding: 0 10px 10px 10px;
	display: flex;
	flex-direction: column;
}
.chat-list {
	background: #fff;
	border-radius: 4px;
	border: 1px solid #fff;
	box-sizing: border-box;
	overflow-y: auto;
	height: calc(100vh - 143px);
}

.chat-bottom {
	padding-top: 30px;
}

.chat-item {
	display: flex;
	align-items: flex-start;
	margin-bottom: 10px;
}

.chat-item .icon {
	display: inline-block;
	width: 32px;
	height: 32px;
	border-radius: 50%;
}

.chat-txt {
  display: inline-block;
	background-color: #eee;
	padding: 8px 10px;
	max-width: 70%;
	min-width: 20px;
	line-height: 22px;
	min-height: 17px;
}

.robot-item .icon {
	background: url(./images/robot.png) 0 0 no-repeat;
}

.people-item .icon {
	background: url(./images/people.png) 0 0 no-repeat;
}

.robot-item .chat-txt {
	border-radius: 0 10px 10px 10px;
}

.people-item .chat-txt {
	background-color: #ecf5ff;
	border-radius: 10px 0px 10px 10px;
}

.people-item {
	flex-direction: row-reverse;
}

.chat-input{
	position: relative;
}

.chat-input .input-mask{
	position: absolute;
  width: 100%;
  top: 0;
  height: 100%;
  background: rgba(249, 240, 240, 0.3);
  display: flex;
  justify-content:center;
}

.chat-content{
	flex: 1;
	padding: 0 0 5px 5px;
}

.people-item .chat-content{
	display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.chat-name{
	font-size: 12px;
  color: #ccc;
  margin-bottom: 5px;
}

.chat-end{
	position: absolute;
	right: 10px;
	bottom: 10px;
}
</style>
<template>
  <div class="text-preview">
    <div class="chat-list">
      <div v-for="(item,index) in chatList" :key="index" class="chat-item" :class="item.type == 'robot' ? 'robot-item' : 'people-item'">
        <i class="icon"></i>
        <div class="chat-content">
          <div class="chat-name" v-if="item.type == 'robot'">{{item.name}}</div>
          <div class="chat-txt">
            {{item.content}}
          </div>
        </div>
      </div>
      <div class="chat-bottom"></div>
    </div>
    <div class="chat-input">
      <el-input :disabled="!start" v-model.trim="content" :rows="3" @keyup.enter.native="answer" type="textarea" placeholder="请输入回答内容" resize="none"></el-input>
      <el-button @click.stop="endPreview" class="chat-end" v-if="start" type="primary" size="mini">结束</el-button>
      <div class="input-mask" v-if="!start">
        <el-button @click.stop="startPreview" type="text" size="small">{{end ? "重新预览" : "开始预览"}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  textPreview
} from "@/api/bot-core.js"
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
      uuid: "",
      content: "",
      start: false,
      end: false,
      chatList: []
    }
  },
  watch: {
    chatList() {
      this.$nextTick(() => {
        let last = document.querySelector(".chat-bottom");
        last && last.scrollIntoView(false);
      })
    }
  },
  methods: {
    answer() {
      let content = this.content;
      if (!content) {
        return;
      }
      this.content = "";
      this.chatList.push({
        type: "people",
        content: content,
        nodeName: ""
      })
      textPreview({
        callUuid: this.uuid,
        event: "Answer",
        content: content
      }).then(resp => {
        if (resp.code == 1 && resp.command) {
          let cmd = resp.command;
          let type = cmd.type;
          if (type == "Say") {
            this.chatList.push({
              type: "robot",
              content: cmd.sectionsDescription,
              name: cmd.nodeName
            });
          } else if (type == "Hangup" || type == "Transfer") {
            this.start = false;
            this.end = true;
          }
        }
      })
    },
    startPreview() {
      this.end = false;
      this.start = false;
      this.chatList = [];
      textPreview({
        internalUuid: 1,
        event: "Start",
        slice: 0,
        callInfo: {
          corpId: this.corpId,
          bizId: this.bizId
        }
      }).then(resp => {
        if (resp.code == 1 && resp.command) {
          this.start = true;
          let cmd = resp.command;
          this.uuid = cmd.callUuid;
          this.chatList.push({
            type: "robot",
            content: cmd.sectionsDescription,
            name: cmd.nodeName
          });
        }
      });
    },
    endPreview() {
      textPreview({
        callUuid: this.uuid,
        event: "End"
      }).then(() => {
        this.start = false;
        this.end = true;
      })
    }
  }
}
</script>