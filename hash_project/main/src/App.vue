<template>
  <router-view></router-view>
</template>
<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import vuex from '@/store'
import { PollingAuth } from '@/Tool/LoginSet'
export default defineComponent({
  setup() {
    // 登陆轮询检测
    const orgid = computed(() => vuex.state.user.orgid)
    watch(
      () => orgid.value,
      (id) => {
        const pollingAuth = new PollingAuth({ orgid: id as number })
        if (id) pollingAuth.start()
        else pollingAuth?.stop()
      },
      {
        immediate: true,
      },
    )
    //testLogin()
  },
})
</script>

<style lang="scss"></style>
