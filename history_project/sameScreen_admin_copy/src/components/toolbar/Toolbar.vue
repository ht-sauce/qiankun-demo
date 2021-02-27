<style scoped>
  .tool-exit{
    margin-left: 40px;
  }
  .preview-btn,.handup-btn{
    margin-left: 10px;
  }
</style>
<template>
  <div>
    <el-dropdown @command="changeSetting">
      <el-button size="mini">
        设置<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="tag">标签设置</el-dropdown-item>
        <el-dropdown-item command="global">全局设置</el-dropdown-item>
        <el-dropdown-item command="nodevoice">话术录音</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button class="handup-btn" :disabled="saving || !isEdit" @click.stop="saveAll" icon="el-icon-edit-outline" size="mini" type="primary">保存</el-button>
    <el-dropdown class="preview-btn" v-show="!status" @command="showPreview">
      <el-button size="mini">
        预览<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="online" :disabled="!opened">在线预览</el-dropdown-item>
        <el-dropdown-item command="text">文本预览</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button class="handup-btn" v-show="status != ''" @click.stop="hangup" icon="el-icon-phone" type="danger" size="mini">挂断</el-button>
    <el-button @click.stop="publish" icon="el-icon-thumb" size="mini">错误检查</el-button>
    <el-button @click.stop="exit" class="tool-exit" icon="el-icon-back" size="mini">退出</el-button>
    <Preview :bizId="speechSkillId" :corpId="corpId" ref="preview" />
    <TagsDialog :bizId="mainId" v-if="showTag" v-model="showTag"/>
    <GlobalDialog :bizId="mainId" :globalConfig="globalConfig" v-if="showGlobal" v-model="showGlobal" @reload="queryConfig"/>
    <el-drawer size="50%" :wrapperClosable="true" :append-to-body="true" :visible.sync="nvVisible" title="话术录音">
      <NodeVoice :speechSkillId="speechSkillId" :mainId="mainId" @close="nvVisible = false" v-if="nvVisible" @change="voiceChange" />
    </el-drawer>
  </div>
</template>
<script>
import Preview from "./Preview"
import TagsDialog from './TagsDialog'
import GlobalDialog from './GlobalDialog'
import NodeVoice from "@/components/design/NodeVoice"
import {
  mapState,
  mapActions
} from "vuex"
import {
  treeToJson,
  getNodeJson,
  treeToList
} from "@/utils/tree.js"
import {
  modify,
  queryGlobalConfig
} from "@/api/robot-ss.js"
export default {
  props: {
    speechSkillId: {
      type: String,
      required: true
    },
    mainId: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      saving: false,
      corpId: "",
      showTag: false,
      showGlobal: false,
      globalConfig:{},
      nvVisible: false
    }
  },
  computed: {
    ...mapState('tree', [
      "tree",
      "isEdit"
    ]),
    ...mapState('phone', [
      "opened",
      "status"
    ]),
    ...mapState('setting', [
      "subList"
    ]),
  },
  methods: {
    ...mapActions("tree", [
      "setTreeList",
      "setEdit"
    ]),
    queryConfig() {
      queryGlobalConfig(this.$storage.getCorpId(), this.mainId).then(res=>{
        if(res.object){
          this.globalConfig = JSON.parse(JSON.parse(res.object).globalConfig)
        }
        
      })
    },
    showPreview(cmd) {
      if (!this.checkNode()) {
        return;
      }
      if (cmd == "online") {
        this.$refs.preview.online();
      } else if (cmd == "text") {
        this.$refs.preview.text();
      }
    },
    changeSetting(cmd) {
      if (cmd == "tag") {
        this.showTag = true
      } else if(cmd == "global") {
        this.showGlobal = true
      } else if (cmd == "nodevoice") {
        this.nvVisible = true;
      }
    },
    hangup() {
      this.$refs.preview.hangup();
    },
    saveAll() {
      this.saving = true;

      modify({
        speechSkillId: this.speechSkillId,
        corpId: this.$storage.getCorpId(),
        treeContent: treeToJson(this.tree),
        nodeContent: getNodeJson(this.tree),
        parentId: this.mainId === this.speechSkillId ? undefined : this.mainId
      }).then(resp => {
        if (resp.code == 0) {
          this.setEdit(false);
          this.$notify({
            title: "提示",
            message: "保存成功",
            type: "success"
          });
        } else {
          this.$notify({
            title: "提示",
            message: resp.message || "录音上传失败",
            type: "error"
          });
        }
        this.saving = false;
      }, () => {
        this.$notify({
          title: "提示",
          message: "网络或服务异常",
          type: "error"
        });
        this.saving = false;
      })
    },
    publish() {
      if (!this.checkNode()) {
        return;
      }
      this.$notify({
        title: "提示",
        message: "话术流程信息完整",
        type: "success"
      });
    },
    exit() {
      if (this.isEdit) {
        this.$confirm("修改话术还未保存，退出将丢失修改内容, 是否继续?", "确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          window.history.length == 1 ? window.close() : this.$router.go(-1);
        });
      } else {
        window.history.length == 1 ? window.close() : this.$router.go(-1);
      }
    },
    checkNode() {
      let treeList = treeToList(this.tree, this.subList);
      if (treeList.find(item => item.error) != null) {

        this.$notify({
          title: "提示",
          message: "话术设置不完整，请检查话术！",
          type: "error"
        });
        this.setTreeList(treeList);
        return false;
      }
      return true;
    },
    voiceChange(list) {
      this.$emit("voiceChange", list)
    }
  },
  mounted() {
    this.corpId = this.$storage.getCorpId();
    this.queryConfig()
  },
  components: {
    Preview,
    TagsDialog,
    GlobalDialog,
    NodeVoice
  }
}
</script>