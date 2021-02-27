<template>
  <background>
    <span class="jump-discourse-market">
      <span>若以下流程设置无法满足，</span>
      <span @click="jump" class="jump">请前往高级设置 >></span>
    </span>
  </background>
</template>

<script>
import Background from '../Background'
import sayoption from './sayoption'
export default {
  components: {
    Background,
  },
  props: {},
  data() {
    return {}
  },
  methods: {
    jump() {
      sessionStorage.setItem('__sayoption', JSON.stringify(sayoption))
      sessionStorage.setItem('__permission', '{"menu":["bot","/speech/my","/speech/design"]}')
      const url = '/sss/zh/#/speech/my'
      window.open(url)
    },
  },
}
</script>

<style scoped lang="scss">
.jump-discourse-market {
  //padding-left: 100px;
  margin-left: 60px;
  font-weight: 600;
  font-size: 14px;
  .jump {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
