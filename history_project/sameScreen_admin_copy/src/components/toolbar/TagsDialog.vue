<style scoped>
.tag-item {
  margin: 5px;
  cursor: pointer;
}

.input-new-tag,
.new-tag-btn {
  width: 90px;
  margin-left: 5px;
}
</style>
<template>
  <el-dialog
    width="600px"
    :append-to-body="true"
    title="标签设置"
    :visible.sync="show"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <div>
      <el-tag v-for="tag in tags"  @close="removeClick(tag.id)" :key="tag.id" class="tag-item" closable>{{tag.labelName}}</el-tag>
      <el-input v-if="inputVisible" class="input-new-tag" v-model.trim="inputValue" ref="tagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="new-tag-btn" size="small" @click="showInput">+ 添加标签</el-button>
    </div>
    <span slot="footer">
      <el-button size="small" @click="close">返 回</el-button>
    </span>
  </el-dialog>
 
</template>
<script>
import {
  queryLabel,
  addLabel,
  removeLabel
} from "@/api/robot-ss.js"
import { mapState, mapActions } from "vuex"
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    tags: {
      type: Array,
      default: function() {
        return []
      }
    },
    bizId: {
      type: String,
      required: true
    }
  },
  model: {
    prop: "show",
    event: "change"
  },
  computed: {
    ...mapState('setting', [
      "tags"
    ])
  },
  data: function() {
    return {
      inputValue: "",
      inputVisible: false,
    };
  },
  watch: {
    bizId:function(value){
      this.bizId = value
    }
  },
  methods: {
    ...mapActions("setting", [
      "removeTag",
      "appendTag"
    ]),
    ok() {
      this.close();
    },
    close() {
      this.$emit("change", false)
    },
    removeClick(id){
        this.$confirm(
            "该标签可能已经被关联，是否确认删除？",
            "删除确认",
            {
              confirmButtonText: "删除",
              cancelButtonText: "取消",
              type: "warning"
            }
        ).then(() => {
           removeLabel({id}).then(res=>{
              if (res.code === 0) {
                  this.$notify({
                      title: "提示",
                      message: "删除成功",
                      type: "success"
                  });
                  this.removeTag(id)
              } else {
                  this.$notify({
                      title: "提示",
                      message: res.message || "删除失败",
                      type: "error"
                  });
              }
          })
        });
        
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.tagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        addLabel({
          labelName: inputValue,
          labelDesc: inputValue,
          speechSkillId: this.bizId,
          isDeleted:0
        }).then(resp => {
          if (resp.code === 0) {
            this.appendTag(resp.result.rows[0])
          } else {
            this.$notify({
              title: "提示",
              message: resp.message || "添加失败",
              type: "error"
            });
          }
        })
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
  },
  mounted() {

  }
};
</script>