<style scoped>
  .flow-location {
	position: fixed;
	left: 30px;
	bottom: 70px;
	cursor: pointer;
	z-index: 35;
}
</style>
<template>
  <div class="flow-location">
    <el-button @click.stop="location" icon="el-icon-place" size="small" type="primary" circle></el-button>
  </div>
</template>
<script>
import {
  treeToCenter
} from '@/utils/tree.js'
export default {
  methods: {
    location() {
      treeToCenter();
    }
  }
}
</script>