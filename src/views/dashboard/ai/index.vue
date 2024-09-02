<template>
  <PageWrapper contentFullHeight fixedHeight contentClass="flex">
      <AiChat></AiChat>
  </PageWrapper>
</template>

<script setup>
  import { PageWrapper } from '/@/components/Page';
  import AiChat from '/@/components/Custom/AiChat/index.vue';
  
</script>

<style lang="less" scoped>
  .wrap {
    height: 100%;
    width: 100%;
    padding: 20px;
    .content {
      background: #fff;
      width: 100%;
      height: 100%;
      padding: 20px;
    }
  }
</style>
