<template>
  <a-drawer v-model:visible="visible" title="日志详情" width="50%" :footer="false">
    <a-descriptions title="基本信息" :column="2" size="large" class="general-description">
      <a-descriptions-item label="日志 ID">{{ dataDetail?.id }}</a-descriptions-item>
      <a-descriptions-item label=""></a-descriptions-item>
      <a-descriptions-item label="操作人">{{ dataDetail?.userName }}</a-descriptions-item>
      <a-descriptions-item label="操作时间">{{ dataDetail?.createdAt }}</a-descriptions-item>
      <a-descriptions-item label="操作类型">{{ businessTypeMap[dataDetail?.businessType]?.label }}</a-descriptions-item>
      <a-descriptions-item label="操作内容">{{ dataDetail?.content }}</a-descriptions-item>
      <!-- <a-descriptions-item label="所属应用">{{ dataDetail?.appCode }}</a-descriptions-item> -->
      <a-descriptions-item label="操作 IP"><a-typography-paragraph :copyable="!!dataDetail?.userIp">{{ dataDetail?.userIp }}</a-typography-paragraph></a-descriptions-item>
      <a-descriptions-item label="操作地点">{{ dataDetail?.ipAddress }}</a-descriptions-item>
      <a-descriptions-item label="浏览器">{{ dataDetail?.browser }}</a-descriptions-item>
      <a-descriptions-item label="终端系统">{{ dataDetail?.platform }}</a-descriptions-item>
      <a-descriptions-item label="状态">
        <a-tag v-if="dataDetail?.errorInfo" color="red">失败</a-tag>
        <a-tag v-else  color="green">成功</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="耗时">
        <a-tag v-if="dataDetail?.timeTaken > 500" color="red"> {{ dataDetail?.executeTime }}ms </a-tag>
        <a-tag v-else-if="dataDetail?.timeTaken > 200" color="orange"> {{ dataDetail?.executeTime }}ms </a-tag>
        <a-tag v-else color="green">{{ dataDetail?.executeTime }} ms</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="请求 URI" :span="2">
        <a-typography-paragraph :copyable="!!dataDetail?.requestUrl">{{ dataDetail?.requestUrl }}</a-typography-paragraph>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions
      title="请求信息"
      :column="2"
      size="large"
      class="general-description http"
      style="margin-top: 20px; position: relative"
    >
      <a-descriptions-item :span="2">
        <a-tabs type="card"  class="w-full">
          <!-- <a-tab-pane key="1" title="请求头">
            <JsonPretty v-if="dataDetail?.requestHeaders" :json="dataDetail?.requestHeaders" />
            <span v-else>无</span>
          </a-tab-pane> -->
          <a-tab-pane key="2" tab="请求体">
            <JsonPretty v-if="dataDetail?.requestBody" :json="dataDetail?.requestBody" />
            <span v-else>无</span>
          </a-tab-pane>
        </a-tabs>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions
      title="响应信息"
      :column="2"
      size="large"
      class="general-description http"
      style="margin-top: 20px; position: relative"
    >
      <a-descriptions-item :span="2">
        <a-tabs type="card" class="w-full">
          <!-- <a-tab-pane key="1" tab="响应头">
            <JsonPretty v-if="dataDetail?.responseHeaders" :json="dataDetail?.responseHeaders" />
            <span v-else>无</span>
          </a-tab-pane> -->
          <a-tab-pane key="2" tab="响应体">
            <JsonPretty v-if="dataDetail?.responseBody" :json="dataDetail?.responseBody" />
            <span v-else>无</span>
          </a-tab-pane>
        </a-tabs>
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script lang="ts" setup>
import { defineComponent, ref,computed } from 'vue';
import {  getInfo } from '/@/api/system/logRecord/logRecord'
import { type LogRecordInfo } from '/@/api/system/logRecord/logRecordModel'
import { JsonPretty } from '/@/components/JsonPretty/index'
import { Description } from '/@/components/Description'
import { businessTypeMap } from '../operation/logRecord.data'
const dataId = ref('')
const dataDetail = ref<LogRecordInfo>()

// 查询详情
const getDataDetail = async () => {
  const res = await getInfo(dataId.value)
  dataDetail.value = res
}

const visible = ref(false)
// 详情
const onDetail = async (id: string) => {
  dataId.value = id
  await getDataDetail()
  visible.value = true
}

defineExpose({ onDetail })
</script>

<style lang="scss" scoped>
.http :deep(.arco-descriptions-item-label-block) {
  padding-right: 0;
}

:deep(.arco-tabs-content) {
  padding-top: 5px;
  padding-left: 15px;
}
</style>
