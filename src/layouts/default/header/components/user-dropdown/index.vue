<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name`" class="truncate">
          {{ getUserInfo[getNameKey] }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <!-- <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
        /> -->
        <MenuItem key="account" :text="t('layout.header.dropdownItemSwitchAccount')" icon="ant-design:setting-outlined" />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
  <!-- <ChangeApi @register="registerApi" /> -->
</template>
<script lang="ts" setup>
  import { Dropdown, Menu } from 'ant-design-vue';
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';
  import { computed } from 'vue';
  import { DOC_URL } from '/@/settings/siteSetting';
  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';
  import headerImg from '/@/assets/images/header.png';
  import { propTypes } from '/@/utils/propTypes';
  import { openWindow } from '/@/utils';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { UserLabelLocaleLang } from '/@/enums/appEnum'
  import { useLocale } from '/@/locales/useLocale';
  import { useGo } from '/@/hooks/web/usePage';
  const { getLocale } = useLocale();
  type MenuEvent = 'logout' | 'doc' | 'lock' | 'api' | 'account';

  const MenuItem = createAsyncComponent(() => import('./DropMenuItem.vue'));
  const LockAction = createAsyncComponent(() => import('../lock/LockModal.vue'));
  // const ChangeApi = createAsyncComponent(() => import('../ChangeApi/index.vue'));

  defineOptions({ name: 'UserDropdown' });

  defineProps({
    theme: propTypes.oneOf(['dark', 'light']),
  });

  const { prefixCls } = useDesign('header-user-dropdown');
  const { t } = useI18n();
  const go = useGo();
  const { getShowDoc, getUseLockPage, getShowApi } = useHeaderSetting();
  const userStore = useUserStore();

  const getUserInfo = computed(() => {
    const { userName = '',userNameEn, headPic, userRemark,userCode } = userStore.getUserInfo || {};
    return { userName, avatar: headPic || headerImg,userNameEn, userRemark , userCode};
  });

  const getNameKey = computed(() => {
    return UserLabelLocaleLang[getLocale.value]
  });

  const [register, { openModal }] = useModal();
  const [registerApi, { openModal: openApiModal }] = useModal();

  function handleLock() {
    openModal(true);
  }

  function handleApi() {
    openApiModal(true, {});
  }

  //  login out
  function handleLoginOut() {
    userStore.confirmLoginOut();
  }

  // open doc
  function openDoc() {
    openWindow(DOC_URL);
  }

  function handleMenuClick(e: MenuInfo) {
    switch (e.key as MenuEvent) {
      case 'logout':
        handleLoginOut();
        break;
      case 'doc':
        openDoc();
        break;
      case 'lock':
        handleLock();
        break;
      case 'api':
        handleApi();
        break;
      case 'account':
        //update-begin---author:wangshuai ---date:20221125  for：进入用户设置页面------------
        go(`/system/usersetting`);
        //update-end---author:wangshuai ---date:20221125  for：进入用户设置页面--------------
        break;
    }
  }
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      // update-begin--author:liaozhiyang---date:20231226---for：【QQYUN-7512】顶部账号划过首次弹出时位置会变更一下
      width: 140px;
      // update-end--author:liaozhiyang---date:20231226---for：【QQYUN-7512】顶部账号划过首次弹出时位置会变更一下
      .ant-dropdown-menu-item {
        min-width: 140px;
      }
    }
  }
</style>
