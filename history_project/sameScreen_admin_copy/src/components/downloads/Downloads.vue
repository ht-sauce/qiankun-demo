<style scoped>
  .download-icon {
  background: url(./images/download.png) 0 0 no-repeat;
  background-size: contain;
  width: 24px;
  height: 24px;
  display: inline-block;
  cursor: pointer;
}

.task-item {
  margin: 5px 0;
}

.donw-status{
  color: #E6A23C;
}
.down-status5{
  color: rgb(245, 108, 108);
}

.down-status4{
  color: #67C23A;
}

.cell-link{
  display: inline-block;
  margin-right: 10px;
  font-size: 12px;
}

.cell-link a{
  margin-left: 7px;
  text-decoration: none;
}
</style>
<template>
  <el-popover @show="showDownTask" @hide="hideDownTask" placement="top-start" width="660" trigger="click">
    <div v-loading="loading">
      <div v-if="dataList.lenght == 0">
        数据为空
      </div>
      <el-table v-else :data="dataList" height="495">
        <el-table-column prop="taskName" label="任务名称">
        </el-table-column>
        <el-table-column prop="totalCount" label="总条数" width="80">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <span class="donw-status" :class="'down-status'+scope.row.status">{{formatStatus(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="创建时间" width="160">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button icon="el-icon-download" class="mr10" v-if="scope.row.status != 4" :disabled="true" type="text" size="mini">下载 </el-button>
            <div class="cell-link" v-else><i class="el-icon-download"></i><a download :href="formatOssFile(scope.row.filePath)">下载</a></div>
            <el-popconfirm title="删除文件后将无法恢复, 是否继续？" @onConfirm="delTask(scope.row.taskId)">
              <el-button icon="el-icon-delete" type="text" class="danger" size="mini" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-if="page.total > 0" class="pagination" @current-change="handleCurrentChange" :page-size="page.pageSize" :current-page="page.pageIndex" layout="total, prev, pager, next" :total="page.total">
      </el-pagination>
    </div>
    <template slot="reference">
      <el-badge :is-dot="isDot">
        <i class="download-icon" title="下载中心"></i>
      </el-badge>
    </template>
  </el-popover>
</template>
<script>
import {
  queryDownTask,
  deleteDownTask
} from "@/api/robot-data.js"
import {
  formatLongDate
} from "@/utils/date.js"

export default {
  data() {
    return {
      loading: true,
      isDot: false,
      dataList: [],
      page: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      timer: null
    }
  },
  methods: {
    handleCurrentChange(page) {
      this.page.pageIndex = page;
      clearTimeout(this.timer);
      this.reloadData();
    },
    showDownTask() {
      this.loading = true;
      this.isDot = false;
      this.reloadData();
    },
    hideDownTask() {
      this.loading = false;
      clearTimeout(this.timer);
    },
    formatOssFile(url) {
      return this.$config.formatOssFile(url);
    },
    formatStatus(status) {
      //["未开始","已提交","进行中","正在写文件","已完成","失败"]
      let arr = ["未开始", "已提交", "进行中", "进行中", "已完成", "失败"];
      return arr[status] || "--";
    },
    formatTime(time) {
      return formatLongDate(time)
    },
    reloadData() {
      clearTimeout(this.timer);
      queryDownTask({
        pageIndex: this.page.pageIndex,
        pageSize: this.page.pageSize
      }).then(resp => {
        this.dataList = this.$config.getValue(resp, "result.rows") || [];
        this.page.total = this.$config.getValue(resp, "result.totalCount") || 0;
        this.loading = false;
      })
      this.timer = setTimeout(() => {
        this.reloadData();
      }, 2000)
    },
    delTask(taskId) {
      deleteDownTask({
        taskId
      }).then(resp => {
        if (resp.code == 0) {
          this.$notify({
            title: "提示",
            message: "删除成功",
            type: "success"
          });
          this.reloadData();
        } else {
          this.$notify({
            title: "提示",
            message: resp.message || "删除失败",
            type: "error"
          });
        }
      }, () => {
        this.$notify({
          title: "提示",
          message: "网络或服务异常",
          type: "error"
        });
      })
    }
  },
  mounted() {
    this.$event.$on("newDown", () => {
      this.isDot = true;
    });
  }
}
</script>