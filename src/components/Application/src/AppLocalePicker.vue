<!--
 * @Author: Vben
 * @Description: Multi-language switching component
-->
<template>
  <Dropdown
    placement="bottom"
    :trigger="['click']"
    :dropMenuList="localeList"
    :selectedKeys="selectedKeys"
    @menu-event="handleMenuEvent"
    overlayClassName="app-locale-picker-overlay"
  >
    <span class="cursor-pointer flex items-center">
      <Icon icon="ion:language" />
      <span v-if="showText" class="ml-1">{{ getLocaleText }}</span>
    </span>
  </Dropdown>
</template>
<script lang="ts" setup>
  import type { LocaleType } from '/#/config';
  import type { DropMenu } from '/@/components/Dropdown';
  import { ref, watchEffect, unref, computed } from 'vue';
  import { Dropdown } from '/@/components/Dropdown';
  import { Icon } from '/@/components/Icon';
  import { useLocale } from '/@/locales/useLocale';
  import { localeList } from '/@/settings/localeSetting';
  import { updateLanguage } from '/@/api/sys/user';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  const userStore = useUserStoreWithOut();
  import { useI18n } from '/@/hooks/web/useI18n';
  import { LocaleLang } from '/@/enums/appEnum';
  import { localeSetting } from '/@/settings/localeSetting';
  const { locale } = localeSetting;
  import { useMessage } from '/@/hooks/web/useMessage';
  const props = defineProps({
    /**
     * Whether to display text
     */
    showText: { type: Boolean, default: true },
    /**
     * Whether to refresh the interface when changing
     */
    reload: { type: Boolean },
  });

  const selectedKeys = ref<string[]>([]);

  const { changeLocale, getLocale } = useLocale();

  const getLocaleText = computed(() => {
    const key = selectedKeys.value[0];
    if (!key) {
      return '';
    }
    return localeList.find((item) => item.event === key)?.text;
  });

  watchEffect(() => {
    selectedKeys.value = [unref(getLocale)];
  });

  async function toggleLocale(lang: LocaleType | string) {
    const { t } = useI18n();
    const language = LocaleLang[lang || locale];
    const { createMessage } = useMessage();
    const loadingI = createMessage.loading({
      content: t('sys.app.changLocale'),
      duration: 0,
    });
    // TODO
    // await updateLanguage({ language, userId: userStore.userInfo?.id });
    loadingI();
    await changeLocale(lang as LocaleType);
    selectedKeys.value = [lang as string];
    props.reload && location.reload();
  }

  function handleMenuEvent(menu: DropMenu) {
    if (unref(getLocale) === menu.event) {
      return;
    }
    toggleLocale(menu.event as string);
  }
</script>

<style lang="less">
  .app-locale-picker-overlay {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }
</style>
