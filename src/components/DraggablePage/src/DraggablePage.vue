<template>
    <div class="fold-left-box">
      <div class="fold-left-box-left" :style="{ width: asideWidth + 'px' }" v-show="asideWidth > 20">
        <slot name="left"></slot>
      </div>
      <div
        class="fold-left-box-line"
        :style="{ cursor: asideWidth === 20 ? '' : 'col-resize' }"
        ref="drag"
      >
        <RightSquareFilled v-show="asideWidth === 20" class="fold-left-box-line-button arrow-right" @click="foldLeft"></RightSquareFilled>
        <LeftSquareFilled v-show="asideWidth !== 20" class="fold-left-box-line-button" @click="foldLeft"></LeftSquareFilled>
      </div>
      <div class="fold-left-box-main">
        <slot name="right"></slot>
      </div>
    </div>
  </template>
  
<script lang="ts">
  import { ref, onMounted,defineComponent,nextTick } from 'vue'
  import { LeftSquareFilled,RightSquareFilled } from '@ant-design/icons-vue';
  import { propTypes } from '/@/utils/propTypes';
  export default defineComponent({
    name: 'DraggablePage',
    components:{
      RightSquareFilled,
      LeftSquareFilled
    },
    props: {
      asideLeftWidth: propTypes.number
    },
    setup(props, { slots, attrs }) {
      const drag = ref(null)
      const asideWidth = ref(0)
      asideWidth.value = props.asideLeftWidth
      console.log('asideWidth.valueasideWidth.value',props.asideLeftWidth)
      function foldLeft() {
        asideWidth.value = asideWidth.value === 20 ? (props.asideLeftWidth ? props.asideLeftWidth*0.8 : 250) : 20
      }
      function bindDrop() {
        drag.value.onmousedown = function () {
          document.onmousemove = function (e) {
            asideWidth.value = asideWidth.value + e.movementX
            if (asideWidth.value < 20) {
              document.onmouseup()
              asideWidth.value = 20
            }
          }
          document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
          }
          return false
        }
      }
      onMounted(() => {
        nextTick(()=>{
          bindDrop()
        })
      })
      return {
        drag,
        foldLeft,
        asideWidth
      };
    },
  })
  </script>
  <style scoped lang="less">
  .fold-left-box {
    height: 100%;
    overflow: hidden;
    display: flex;
  }
  .fold-left-box-left {
    height: 100%;
    overflow: hidden;
  }
  .fold-left-box-line {
    width: 4px;
    height: 100%;
    position: relative;
    border-left: 1px solid #e6e6e6;
    .arrow-right {
      transform: translateX(0);
    }
  }
  .fold-left-box-main {
    height: 100%;
    flex: 1;
    // padding-left: 12px;
    overflow: hidden;
  }
  .fold-left-box-line-button {
    font-size: 22px;
    position: absolute;
    top: 50%;
    transform: translateX(-50%);
  }
  </style>
  
  