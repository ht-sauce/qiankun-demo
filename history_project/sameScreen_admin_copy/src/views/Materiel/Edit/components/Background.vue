<template>
  <div class="background">
    <div v-if="title" class="title">{{ title }}</div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.background {
  margin: 15px 0;
  .title {
    font-size: 14px;
    font-weight: 600;
    padding-bottom: 8px;
  }
  .content {
    background: #f2f2f2;
    padding: 10px;
    width: 100%;
    //height: 100%;
  }
}
</style>
