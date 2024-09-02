<template>
  <div ref="wrapRef"></div>
</template>
<script lang="ts">
  import type { Ref } from 'vue';
  import {
    defineComponent,
    ref,
    unref,
    nextTick,
    computed,
    watch,
    onBeforeUnmount,
    onDeactivated,
  } from 'vue';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';
  import { useLocale } from '/@/locales/useLocale';
  import { useModalContext } from '../../Modal';
  import { toolbar,liuchengtu } from './toolbar';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { GetUploadLink,Upload } from '/@/api/sys/file';
  import { svgPath } from './svg';
  import { getTheme } from './getTheme';

  type Lang = 'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR' | undefined;

  export default defineComponent({
    inheritAttrs: false,
    props: {
      height: { type: Number, default: 360 },
      value: { type: String, default: '' },
    },
    emits: ['change', 'get', 'update:value'],
    setup(props, { attrs, emit }) {
      const wrapRef = ref<ElRef>(null);
      const vditorRef = ref(null) as Ref<Nullable<Vditor>>;
      const initedRef = ref(false);

      const modalFn = useModalContext();

      const { getLocale } = useLocale();
      const { getDarkMode } = useRootSetting();
      const valueRef = ref(props.value || '');

      watch(
        [() => getDarkMode.value, () => initedRef.value],
        ([val, inited]) => {
          if (!inited) {
            return;
          }
          instance
            .getVditor()
            ?.setTheme(getTheme(val) as any, getTheme(val, 'content'), getTheme(val, 'code'));
        },
        {
          immediate: true,
          flush: 'post',
        },
      );

      watch(
        () => props.value,
        (v) => {
          if (v !== valueRef.value) {
            instance.getVditor()?.setValue(v);
          }
          valueRef.value = v;
        },
      );

      const getCurrentLang = computed((): 'zh_CN' | 'en_US' | 'ja_JP' | 'ko_KR' => {
        let lang: Lang;
        switch (unref(getLocale)) {
          case 'en':
            lang = 'en_US';
            break;
          case 'ja':
            lang = 'ja_JP';
            break;
          case 'ko':
            lang = 'ko_KR';
            break;
          default:
            lang = 'zh_CN';
        }
        return lang;
      });
      function init() {
        const wrapEl = unref(wrapRef) as HTMLElement;
        if (!wrapEl) return;
        const bindValue = { ...attrs, ...props };
        const insEditor = new Vditor(wrapEl, {
          // 设置外观主题
          theme: getTheme(getDarkMode.value) as any,
          lang: unref(getCurrentLang),
          mode: 'sv',
          fullscreen: {
            index: 520,
          },
          outline: {
            enable: true,
            position:'right'
          },
          upload: {
            accept: 'image/*',
            fieldName: 'multipartFile',
            handler: (files) => {
              const array = [];
              files.forEach((file) => {
                array.push(Upload({ file: file }));
              });
              Promise.all(array).then((list) => {
                console.log('listlist', list);
                list.forEach(async (item) => {
                  let res = await GetUploadLink({
                    expires: 30000,
                    objectName: item.data.data.fileUrl,
                  });
                  insEditor?.insertValue(`<p data-block="0">\u200b<wbr>\n![${item.data.data.fileName}](${res})</p>`, true); // 文本编辑器中插入图片
                });
              });
            },
          },
          toolbar: [
            ...toolbar,
            // {
            //   name: 'alignType',
            //   icon: svgPath.alignType,
            //   tip: '对齐方式',
            //   tipPosition: 'ne',
            //   toolbar: [
            //     {
            //       name: 'alignType-left',
            //       icon: svgPath.alignTypeLeft + '&nbsp;&nbsp;左对齐',
            //       click: (event: Event, vditor: IVditor) => {
            //         // setAlign('left')
            //       }
            //     },
            //     {
            //       name: 'alignType-center',
            //       icon: svgPath.alignType + '&nbsp;&nbsp;居中对齐',
            //       click: (event: Event, vditor: IVditor) => {
            //         // setAlign('center')
            //       }
            //     },
            //     {
            //       name: 'alignType-right',
            //       icon: svgPath.alignTypeRight + '&nbsp;&nbsp;右对齐',
            //       click: (event: Event, vditor: IVditor) => {
            //         // setAlign('right')
            //       }
            //     }
            //   ]
            // },
            {
              name: 'liuchengtu',
              icon: svgPath.liuchengtu,
              tip: '图表',
              tipPosition: 'ne',
              toolbar: liuchengtu.map(item => {
                return {
                  ...item,
                  click: (event: Event, vditor: IVditor) => {
                    insEditor?.insertValue(item.textValue,true)
                  }
                }
              })
            },
            {
              name: 'fullscreen',
              className:'toolbar-right'
            },
            {
              name: 'help',
              className:'toolbar-right'
            },
            {
              name: 'summary',
              icon: svgPath.summary,
              tip: '目录',
              tipPosition: 'ne',
              className:'toolbar-right',
              click: (event: Event, vditor: IVditor) => {
                const btnEllastElementChildement = vditor.toolbar.elements.summary?.lastElementChild;
                btnEllastElementChildement.ariaLabel = `目录`
                if (vditor.outline.element.style.display == 'none') {
                  vditor.outline.element.style.display = "block"
                  btnEllastElementChildement.ariaLabel = `关闭目录`
                } else {
                  vditor.outline.element.style.display = "none"
                  btnEllastElementChildement.ariaLabel = `目录`
                }
              }
            },
            {
              name: 'previewCard',
              icon: svgPath.previewCard,
              tip: '仅预览区',
              tipPosition: 'ne',
              className: 'toolbar-right',
              click: (event: Event, vditor: IVditor) => {
                const editCard = vditor.toolbar.elements.editCard
                const previewCard = vditor.toolbar.elements.previewCard.lastElementChild
                editCard.lastElementChild.ariaLabel = `仅编辑区`
                if (vditor.sv.element.style.display == 'none') {
                  vditor.sv.element.style.display = "block"
                  vditor.preview.element.style.display = "block";
                  previewCard.ariaLabel = `仅预览区`
                } else {
                  vditor.sv.element.style.display = "none"
                  vditor.preview.element.style.display = "block";
                  previewCard.ariaLabel = `恢复默认`
                }
                // insEditor?.setPreviewMode('editor')
              }
            },
            {
              name: 'editCard',
              tip: `仅编辑区`,
              icon: svgPath.editCard,
              tipPosition: 'ne',
              className: 'toolbar-right',
              click: (event: Event, vditor: IVditor) => {
                const previewCard = vditor.toolbar.elements.previewCard
                const editCard = vditor.toolbar.elements.editCard.lastElementChild
                previewCard.lastElementChild.ariaLabel = `仅预览区`
                if (vditor.options.preview.mode == 'editor') {
                  insEditor?.setPreviewMode('both')
                  vditor.sv.element.style.display = "block"
                  vditor.preview.element.style.display = "block";
                  editCard.ariaLabel = `仅编辑区`
                } else {
                  insEditor?.setPreviewMode('editor')
                  vditor.sv.element.style.display = "block"
                  vditor.preview.element.style.display = "none";
                  editCard.ariaLabel = `恢复默认`
                }
              }
            },
          ],
          preview: {
            theme: {
              // 设置内容主题
              current: getTheme(getDarkMode.value, 'content'),
            },
            hljs: {
              // 设置代码块主题
              style: getTheme(getDarkMode.value, 'code'),
            },
            actions: [],
          },
          input: (v) => {
            valueRef.value = v;
            emit('update:value', v);
            emit('change', v);
          },
          after: () => {
            nextTick(() => {
              modalFn?.redoModalHeight?.();
              insEditor.setValue(valueRef.value);
              vditorRef.value = insEditor;
              initedRef.value = true;
              emit('get', instance);
            });
          },
          blur: () => {
            //unref(vditorRef)?.setValue(props.value);
          },
          ...bindValue,
          cache: {
            enable: false,
          },
        });
      }

      const instance = {
        getVditor: (): Vditor => vditorRef.value!,
      };

      function destroy() {
        const vditorInstance = unref(vditorRef);
        if (!vditorInstance) return;
        try {
          vditorInstance?.destroy?.();
        } catch (error) {}
        vditorRef.value = null;
        initedRef.value = false;
      }

      onMountedOrActivated(init);

      onBeforeUnmount(destroy);
      onDeactivated(destroy);
      return {
        wrapRef,
        ...instance,
      };
    },
  });
</script>
<style lang="less">
  .vditor-toolbar {
    .vditor-toolbar__item {
      margin: 0.1rem 0.4rem !important;
    }
    .toolbar-right {
      float:right
    }
  }
  .right {
    .vditor-tooltipped {
      &::after {
        display: none;
      }
    }
  }
</style>
