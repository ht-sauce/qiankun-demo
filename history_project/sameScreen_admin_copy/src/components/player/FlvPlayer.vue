<style>
.flv-container {
  display: flex;
  justify-content: center;
}

.flv-container video {
  width: 100%;
}
</style>
<template>
  <el-dialog title="视频预览" :visible.sync="show" width="40%" :before-close="close" append-to-body="true">
    <div class="flv-container">
      <video controls="controls" id="flv-video"></video>
    </div>
    <span slot="footer">
      <el-button size="small" type="primary" @click="close">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  loadScript
} from "@/utils/dom.js"

let flvPlayer = null;

export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  },
  model: {
    prop: "show",
    event: "change"
  },
  data() {
    return {

    }
  },
  methods: {
    close() {
      this.$emit("change", false);
    }
  },
  mounted() {
    loadScript(process.env.BASE_URL + "flv/1.5.0/flv.min.js").then(() => {
      if (window.flvjs.isSupported()) {
        flvPlayer = window.flvjs.createPlayer({
          type: 'flv',
          url: this.src
        });
        flvPlayer.attachMediaElement(document.getElementById('flv-video'));
        flvPlayer.load();
        flvPlayer.play();
      }
    })
  },
  beforeDestroy() {
    if (flvPlayer) {
      flvPlayer.pause();
      flvPlayer.unload();
      flvPlayer.detachMediaElement();
      flvPlayer.destroy();
    }
  }
}
</script>