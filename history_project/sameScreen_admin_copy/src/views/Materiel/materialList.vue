<template>
  <div class="contentView">
    <div class="search">
      <div class="condition">
        <div class="condition-item">
          <div>物料名称：</div>
          <div>
            <el-input
              v-model.trim="searchObj.name"
              placeholder="关键词"
              size="small"
              clearable
            ></el-input>
          </div>
        </div>
        <div class="condition-item">
          <div>物料状态：</div>
          <div>
            <el-select size="small" v-model="searchObj.status">
              <el-option
                v-for="item in OptionsStatus"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="condition-item">
          <el-button type="primary" @click.stop="search" size="small" icon="el-icon-search"
            >查询</el-button
          >
        </div>
      </div>
      <div>
        <el-button size="small" icon="el-icon-plus" @click="$emit('add')">新增</el-button>
      </div>
    </div>
    <div v-loading="loading" class="table-layout">
      <el-table
        :data="tableData"
        stripe
        highlight-current-row
        height="100%"
        :default-sort="{ prop: 'updateTime', order: 'descending' }"
        @sort-change="sortChange"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="id" label="物料ID" width="100"></el-table-column>
        <el-table-column label="物料名称" width="150">
          <template slot-scope="scope">
            <span @click="detail(scope.row)"
              ><a class="link-class">{{ scope.row.name }}</a></span
            >
          </template>
        </el-table-column>
        <el-table-column label="物料类型">
          <template slot-scope="scope">
            <span>
              {{ scope.row.capabilityPatternDTOList | typeFilter }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="所属用户" width="140"></el-table-column>
        <el-table-column label="物料状态" width="100">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.status == 1
                  ? '已完成'
                  : scope.row.status == 2
                  ? '待发布'
                  : scope.row.status == 0
                  ? '草稿'
                  : '全部'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="物料描述"></el-table-column>
        <el-table-column sortable prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <div>
              {{ scope.row.updateTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="$emit('sendDetail', scope.row)"
              >详情</el-button
            >
            <el-button
              :disabled="userName !== scope.row.username"
              size="small"
              type="text"
              @click="$emit('edit', scope.row)"
              >编辑</el-button
            >
            <el-button
              :disabled="userName !== scope.row.username"
              size="small"
              type="text"
              @click="remove(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footerPage">
      <el-pagination
        v-if="page.total > 0"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 15]"
        :page-size="page.pageSize"
        :current-page="page.pageNumber"
        layout="total, prev, pager, next,sizes"
        :total="page.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import Service from '@/servicesSauce/index'
function renderTime(date) {
  var dateee = new Date(date).toJSON()
  return new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '')
}
const MATERIEL_STATUS = [
  {
    key: '',
    value: '全部',
  },
  {
    key: 0,
    value: '草稿',
  },
  {
    key: 1,
    value: '已完成',
  },
  {
    key: 2,
    value: '待发布',
  },
]
import { mapState } from 'vuex'
export default {
  data() {
    return {
      ordType: '',
      MATERIEL_STATUS: MATERIEL_STATUS,
      OptionsStatus: MATERIEL_STATUS,
      renderTime: renderTime,
      tableData: [],
      materielsOption: [],
      page: {
        total: 0,
        pageNumber: 1,
        pageSize: 10,
      },
      searchObj: {
        status: '',
        name: '',
      },
      loading: false,
    }
  },
  computed: {
    ...mapState('user', ['userName']),
  },
  filters: {
    typeFilter: function(val) {
      const materialNamesObj = {
        1: '基础视频版',
        2: '3D视频版',
        3: '图文版',
        4: '2D真人版',
      }
      if (val == null || val.length < 1) {
        return ''
      }
      let typeArrs = val.map(item => {
        return materialNamesObj[item.materialType]
      })
      return typeArrs.join(';')
    },
  },
  mounted() {
    this.start()
  },
  methods: {
    // 保证点击回来的时候是最新的数据
    start() {
      this.initData()
    },
    search() {
      this.initData()
    },
    detail(item) {
      this.$emit('sendDetail', item)
    },
    async initData() {
      this.loading = true
      let options = Object.assign(
        {
          ordType: this.ordType,
          pageSize: this.page.pageSize,
          pageNum: this.page.pageNumber,
          corpId: this.$storage.getCorpId(),
        },
        this.searchObj,
      )
      const res = await Service.RS.materiel.list({ data: options })
      this.loading = false
      this.tableData = res.data.list
      this.page.total = res.data.total
    },
    sortChange(sortData) {
      if (sortData.order == 'ascending') {
        //升  正
        this.ordType = 1
      } else {
        //倒序
        this.ordType = 0
      }
      this.initData()
    },
    async remove(item) {
      await this.$confirm('物料删除后将无法恢复，是否继续!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      await Service.RS.materiel.del({ id: item.id })
      this.initData()
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.initData()
    },
    handleCurrentChange(page) {
      this.page.pageNumber = page
      this.initData()
    },
  },
}
</script>
<style scoped>
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.condition {
  display: flex;
}

.condition-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.table-layout {
  margin-top: 10px;
  height: calc(100vh - 278px);
  box-sizing: border-box;
}

.footerPage {
  background: #fff;
  padding: 10px 0;
  position: relative;
  bottom: 0;
  margin-top: 10px;
}
.link-class {
  color: blue;
  text-decoration: none;
  cursor: pointer;
}
</style>
