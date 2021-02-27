<template>
  <el-popconfirm title="确定删除该分类节点吗" @onConfirm="onDel">
    <span slot="reference" title="删除分类" class="el-icon-delete del"></span>
  </el-popconfirm>
</template>

<script>
import Service from '@/servicesSauce'
export default {
  inject: ['word', 'getTabData'],
  props: {
    item: Object,
  },
  data() {
    return {}
  },
  methods: {
    async onDel() {
      try {
        await Service.RS.QaGroup.del({
          data: {
            groupId: this.item.id,
            materialId: this.getTabData().row.id,
            materialType: this.word().materialType,
          },
        })
        this.$emit('del', this.item)
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.del:hover {
  color: #f56c6c;
  box-shadow: rgba(0, 0, 0, 0.5);
}
</style>
