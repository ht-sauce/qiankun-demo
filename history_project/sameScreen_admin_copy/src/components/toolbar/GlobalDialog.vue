<style scoped>
.set-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.set-item-lbl {
  display: inline-block;
  width: 80px;
  color: #606266;
}
.set-item-val {
  flex: 1;
}
.opt-item .input-number {
  width: 100px;
}
.opt-saylist {
  margin-right: 15px;
}
.item-unit {
  padding-left: 5px;
}
</style>
<template>
  <el-dialog
    width="600px"
    :append-to-body="true"
    title="全局设置"
    :visible.sync="show"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form ref="globalForm" :model="globalForm" label-width="140px">
      <el-form-item label="智能打断">
        <el-checkbox v-model="globalForm.intelligenceMatch"></el-checkbox>
      </el-form-item>
      <el-form-item label="等待时间">
        <el-input-number
          class="input-number"
          size="mini"
          v-model="globalForm.inputTimeout"
          :min="-1"
          :step="1"
        ></el-input-number>
        <span class="item-unit">秒</span>
        <el-button style="margin-left:100px" @click.stop="noAnswer" type="text" size="mini">无需回答</el-button>
      </el-form-item>
      <el-form-item label="智能打断等待时间" v-if="globalForm.intelligenceMatch">
        <el-input-number
          class="input-number"
          size="mini"
          v-model="globalForm.intelligenceInputTimeout"
          :min="-1"
          :step="1"
        ></el-input-number>
        <span class="item-unit">秒</span>
      </el-form-item>
      <el-form-item v-for="(item,index) in optionList" :key="index" :label="item.name">
        <template v-if="item.dataSource && Array.isArray(item.dataSource)">
          <el-select
            v-model="globalForm[item.key]"
            size="mini"
            clearable
            @change="optionChange($event,item)"
            style="width:300px"
          >
            <el-option
              v-for="data in  (item.dataSource.length > 0 ? item.dataSource : getDataSource(item)) "
              :key="data.value"
              :value="data.value"
              :label="data.label"
            ></el-option>
          </el-select>
        </template>
        <template v-else>
          <el-input
            style="width:300px"
            v-model="globalForm[item.key]"
            type="text"
            size="mini"
            :placeholder="item.name"
          ></el-input>
        </template>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button size="small" type="primary" @click="ok">保 存</el-button>
      <el-button size="small" @click="close">返 回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { saveGlobalConfig } from "@/api/robot-ss.js";
import { mapState, mapActions } from "vuex";
import { getSayOption } from "@/api/jsondata.js";
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    bizId: {
      type: String,
      required: true,
    },
    globalConfig: {
      type: Object,
      required: true,
    },
  },
  model: {
    prop: "show",
    event: "change",
  },
  computed: {},
  data: function () {
    return {
      globalForm: {
        intelligenceMatch: 0,
        inputTimeout: 5,
        intelligenceInputTimeout: 20,
        ttsEngine: undefined,
        asrGrammar: "",
        ttsVoice: undefined,
        interrupt: "",
        asrEngine: undefined,
      },
      optionList: [],
    };
  },
  watch: {
    bizId: function (value) {
      this.bizId = value;
    },
  },
  methods: {
    optionChange(val, item) {
      if (item && item.refs) {
        let changeItem = this.optionList.find(
          (option) => item.refs.indexOf(option.key) >= 0
        );
        let changeDataSource = item.dataSource.find((d) => d.value === val);
        this.globalForm[changeItem.key] =
          changeDataSource &&
          changeDataSource.dataSource &&
          changeDataSource.dataSource[0].value;
      }
    },
    getDataSource(item) {
      let ref = this.optionList.find((option) => option.key == item.ref);
      let data = ref.dataSource.find(
        (data) => data.value == this.globalForm[ref.key]
      );
      return data ? data.dataSource : [];
    },
    noAnswer() {
      this.globalForm.inputTimeout = -1
    },
    ok() {
      this.$refs.globalForm.validate((valid) => {
        if (!valid) {
          return;
        }
        const params = {
          corpId: this.$storage.getCorpId(),
          speechSkillId: this.bizId,
          node: {
            intelligenceMatch: this.globalForm.intelligenceMatch ? 1 : 0,
          },
          options: {
            ttsEngine: this.globalForm.ttsEngine,
            asrGrammar: this.globalForm.asrGrammar,
            ttsVoice: this.globalForm.ttsVoice,
            interrupt: this.globalForm.interrupt,
            asrEngine: this.globalForm.asrEngine,
            intelligenceInputTimeout: this.globalForm.intelligenceInputTimeout * 1000,
            inputTimeout: this.globalForm.inputTimeout  * 1000,
          },
        };
        saveGlobalConfig(JSON.stringify(params)).then((res) => {
          if (res.code === "000000") {
            this.$emit('reload')
            
            this.$notify({
              title: "提示",
              message: "保存成功",
              type: "success",
            });
            this.close();
            
          }
        });
      });
      
    },
    close() {
      this.$emit("change", false);
    },
  },
  created() {
    this.globalForm = {
      intelligenceMatch: !!this.globalConfig.node.intelligenceMatch,
      inputTimeout: this.globalConfig.options.inputTimeout / 1000 ,
      intelligenceInputTimeout: this.globalConfig.options
        .intelligenceInputTimeout / 1000 ,
      ttsEngine: this.globalConfig.options.ttsEngine,
      asrGrammar: this.globalConfig.options.asrGrammar,
      ttsVoice: this.globalConfig.options.ttsVoice,
      interrupt: this.globalConfig.options.interrupt,
      asrEngine: this.globalConfig.options.asrEngine,
    };
  },
  mounted() {
    getSayOption().then((resp) => {
      this.optionList = resp;
    });
  },
};
</script>