<style scoped>
.chat-list {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #fff;
  padding: 20px 10px 10px 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.chat-bottom {
  padding-top: 50px;
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

.chat-empty {
  background: url(./images/chat-icon.png) center 0 no-repeat;
  padding-top: 70px;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
<template>
  <div class="chat-list">
    <div v-if="chatList.length == 0" class="chat-empty">人机交互为空</div>
    <div v-else v-for="(item,index) in chatList" :key="index" class="chat-item" :class="item.type == 'robot' ? 'robot-item' : 'people-item'">
      <i class="icon"></i>
      <div class="chat-txt">
        {{item.content}}
      </div>
    </div>
    <div class="chat-bottom"></div>
  </div>
</template>
<script>
import {
  queryDialog
} from "@/api/bot-core.js"

export default {
  props: {
    calluuid: {
      type: String
    }
  },
  data: function() {
    return {
      chatList: []
    }
  },
  watch: {
    calluuid(val) {
      if (val) {
        this.getChatList();
      }
    },
    chatList() {
      let last = document.querySelector(".chat-bottom");
      last && last.scrollIntoView(false);
    }
  },
  methods: {
    getChatList() {
      if (this.calluuid) {
        queryDialog({
          calluuid: this.calluuid
        }).then(resp => {
          let body = resp.body || [];
          if (body.length > 0) {
            this.chatList = body.filter(item => item.eventName == "Answer" || item.eventName == "Say").map(item => {
              let {
                eventName,
                sectionsDescription,
                sayDescription,
                answer
              } = item;
              if (eventName == "Answer") {
                return {
                  type: "people",
                  content: answer
                }
              } else {
                return {
                  type: "robot",
                  content: sectionsDescription || sayDescription
                }
              }
            });
          }
          setTimeout(() => {
            this.getChatList()
          }, 1000);
        });
      } else {
        setTimeout(() => {
          this.getChatList()
        }, 1000);
      }
    }
  },
  mounted() {
    this.getChatList();
  }
}
</script>