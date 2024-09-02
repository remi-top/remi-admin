<template>
  <div class="account-padding" :class="[`${prefixCls}`]">
    <div class="user-setting-top">
      <div class="account-avatar">
        <CropperAvatar
          :edit="false"
          :uploadApi="uploadApi"
          :showBtn="false"
          :value="userInfo.headPicPreviewUrl"
          :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
          @change="updateAvatar"
          width="80"
        />
        <div class="account-right">
          <div v-if="!isEdit">
            <span class="font-size-17 account-name">{{ userInfo[getNameKey] }}</span>
            <!-- <a-tooltip content="编辑姓名">
              <Icon class="pointer font-size-17 gray-bd account-icon" icon="ant-design:edit-outlined"
                    @click="editHandleClick" />
            </a-tooltip> -->
          </div>
          <!-- <div v-else>
            <a-input ref="accountNameEdit" :maxlength="100" v-model:value="userInfo.realname" @blur="editRealName" />
          </div> -->
          <div class="use-day">
            使用：<span>{{userInfo.createTimeText}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="account-data">
      <!-- 详细资料 -->
      <div class="account-detail mr-2">
        <!-- <div class="font-size-15 font-bold font-color-gray" style="margin-bottom: 16px">详细资料</div> -->
        <!-- <Description @register="infoRegister" class="enter-y" /> -->
          <template  v-for="item in schema" :key="item.field">
            <div class="margin-bottom-10 font-size-13" v-if="item?.show !== false" >
              <span class="text-gray-400 item-label">{{ item.label }}</span>
              <template v-if="item.field ==='userRoles'">
                <span class="text">{{ userInfo[item.field] && userInfo[item.field].map(i => i[getRoleNameKey]).join('、') }}</span>
              </template>
              <template v-else-if="item.field === 'sex'">
                <span class="text">{{ userInfo[item.field] == 2 ? t('common.sex.unknown') :  (userInfo[item.field] == 1 ? t('common.sex.men') : t('common.sex.woMen')) }}</span>
              </template>
              <template v-else>
                <span class="text">{{ userInfo[item.field] }}</span>
              </template>

            </div>
          </template>
        </div>
      <!-- 联系信息 -->
      <!-- <div class="account-info">
        <div class="font-size-15 font-bold font-color-gray" style="margin-bottom: 16px">联系信息</div>
        <div class="margin-bottom-10 font-size-13">
          <span class="gray-75 item-label">邮箱</span>
          <span class="gray-3">{{ userInfo.email ? userInfo.email : "未填写" }}</span>
        </div>
        <div class="margin-bottom-10 font-size-13">
          <span class="gray-75 item-label">手机</span>
          <span class="gray-3">{{ userInfo.phone ? userInfo.phone : "未填写" }}</span>
        </div>
      </div> -->
    </div>
  </div>
  <UserAccountModal @register="registerModal" @success="getUserDetail"></UserAccountModal>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { CollapseContainer } from '/@/components/Container';
import { Description, DescItem, useDescription } from '/@/components/Description/index';;
import { CropperAvatar } from '/@/components/Cropper';
import { useMessage } from '/@/hooks/web/useMessage';
import headerImg from '/@/assets/images/header.png';
import { defHttp } from '/@/utils/http/axios';
import { useUserStore } from '/@/store/modules/user';
import { Upload as uploadApi } from '/@/api/sys/file';
import { getFileAccessHttpUrl } from '/@/utils/common/compUtils';
import dayjs from 'dayjs';
import { ajaxGetDictItems, getDictItemsByCode, initDictOptions } from '/@/utils/dict';
import { queryNameByCodes } from './UserSetting.api';
import { getUserInfo as getUserData, } from '/@/api/sys/user';
import { updateInfo as  userEdit} from '/@/api/org/personal';
import UserAccountModal from './commponents/UserAccountModal.vue';
import { useModal } from '/@/components/Modal';
import { personalFormSchema } from '/@/views/org/personal/personal.data'
import { cloneDeep, includes } from 'lodash-es';
import { useDesign } from '/@/hooks/web/useDesign';
import { UserLabelLocaleLang, RoleNameLocaleLang } from '/@/enums/appEnum'
import { useLocale } from '/@/locales/useLocale';
const { getLocale } = useLocale();
import { useI18n } from '/@/hooks/web/useI18n';
import { GetPreview } from '/@/api/sys/file'
const { t } = useI18n();
const getNameKey = computed(() => {
  return UserLabelLocaleLang[getLocale.value]
});
const getRoleNameKey = computed(() => {
  return RoleNameLocaleLang[getLocale.value]
});
//TODO 当字典租户隔离时，数据会查不到，默认一个
const sexOption = getDictItemsByCode("sex") || [{text:'男',value:'1'},{text:'女',value:'2'}];
const { createMessage } = useMessage();
const userStore = useUserStore();
  const { prefixCls } = useDesign('j-base-setting-container');
//是否编辑
const isEdit = ref<boolean>(false);
//用户信息
const userInfo = ref<any>({});
//编辑时input触发事件
const accountNameEdit = ref();
const [registerModal, { openModal }] = useModal();
//头像动态计算
const avatar = computed(async () => {
  return userInfo.value?.headPicPreviewUrl
});
const list = [
  'loginName',
  'userCode',
  'userName',
  'userNameEn',
  'nickName',
  'userRoles',
  'birthday',
  'sex',
  'identity',
  'firstName',
  'middleName',
  'lastName',
]
const schema = ref(<DescItem[]>[]);
personalFormSchema.map(item => {
  console.log('item',item)
  if(item?.show !== false){
    console.log('listlist',list,item.field,!includes(list,item.field));
    
    if(includes(list,item.field)){
      schema.value.push({ field: item.field, label: item.label })
    } else {

    }
  }
})
/**
 * 更新用户头像
 */
function updateAvatar({ src, data }) {
  console.log('src',src)
  console.log('data',data)
  const userinfo = userStore.getUserInfo;
  userinfo.headPic = data;
  userStore.setUserInfo(userinfo);
  if (data) {
    updateUserInfo({ headPic: data, id: userinfo.id });
  }
}

/**
 * 更新用户信息
 * @params 参数
 */
function updateUserInfo(params) {
  userEdit(params).then((res) => {
    // if (!res.success) {
    //   createMessage.warn(res.message);
    // }
  });
}

/**
 * 编辑按钮点击事件
 */
function editHandleClick() {
  isEdit.value = true;
  setTimeout(() => {
    accountNameEdit.value.focus();
  }, 100);
}

/**
 * 修改真实姓名
 */
function editRealName() {
  if (userInfo.value.realname) {
    updateUserInfo({ realname: userInfo.value.realname, id: userInfo.value.id });
    userStore.setUserInfo(userInfo.value);
  } else {
    createMessage.warn("请输入姓名");
  }
  isEdit.value = false;
}

/**
 * 获取生日信息
 */
function getBirthDay(val) {
  if (val) {
    return dayjs(val).format("YYYY-MM-DD");
  } else {
    return "未填写";
  }
}

/**
 * 获取性别
 * @param val
 */
function getSex(val) {
  let findOption = sexOption.find(item => parseInt(item.value) === val);
  let sex = "未填写";
  if (findOption) {
    sex = findOption.text;
  }
  return sex;
}

/**
 * 打开编辑弹窗
 */
function openEditModal() {
  let value = cloneDeep(userInfo.value);
  openModal(true, {
    record: value
  });
}

/**
 * 获取用户信息
 */
function getUserDetail() {
  getUserData().then((async res => {
    console.log('getUserDetail',res)
      if (res) {
        res.sexText = getSex(res.sex);
        res.birthday = getBirthDay(res.birthday);
        res.createTimeText = getDiffDay(res.createdAt);
        let headPicPreviewUrl = await GetPreview({
          fileName: res.headPic
        })
        console.log('headPicPreviewUrl',headPicPreviewUrl);
        
        res.headPicPreviewUrl = headPicPreviewUrl
        userInfo.value = res;
      } else {
        userInfo.value = {};
      }
  })).catch(e => {
    userInfo.value = {};
  })
}

/**
 * 获取使用时间
 * @param date
 */
function getDiffDay(date) {
  // 计算两个日期之间的天数差值
  let totalDays, diffDate
  let createDate = Date.parse(date);
  let nowDate = new Date().getTime();
  // 将两个日期都转换为毫秒格式，然后做差
  diffDate = Math.abs(nowDate - createDate) // 取相差毫秒数的绝对值
  totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
  return totalDays+" 天";
}
onMounted(async () => {
  getUserDetail();
});
</script>

<style lang="less">
    // update-begin-author:liusq date:20230625 for: [issues/563]暗色主题部分失效
  @prefix-cls: ~'@{namespace}-j-base-setting-container';

  .@{prefix-cls}{
    .user-setting-top {
      padding-top: 40px;
      width: 100%;
      // border-bottom: 1px solid @border-color-base;
      display: flex;
      padding-bottom: 20px;
    }

    .account-avatar {
      align-items: center;
      display: flex;
      margin-right: 30px;
      flex: 1;
    }

    .change-avatar {
      img {
        display: block;
        margin-bottom: 15px;
        border-radius: 50%;
      }
    }

    .account-right {
      margin-left: 25px !important;
    }

    .font-size-15 {
      font-size: 15px;
    }

    .font-size-17 {
      font-size: 17px;
    }

    .pointer {
      cursor: pointer;
    }

    .account-name {
      white-space: nowrap;
      overflow: hidden;
      width: 200px;
      text-overflow: ellipsis;
      line-height: 32px !important;
      /*begin 兼容暗夜模式*/
      color: @text-color;
      /*end 兼容暗夜模式*/
      font-weight: 500;
    }

    .gray-bd {
      color: #bdbdbd;
    }

    .account-icon {
      margin-left: 4px;
    }

    .account-data {
      width: 100% !important;
      display: flex;
      min-width: 0;
    }

    .account-detail {
      width: 60%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      padding: 40px 0;
      font-family: Inter, -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, noto sans, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;

      .item-label {
        display: inline-block;
        text-align: left;
        width: 100px;
      }
      .text {
        color: #000 !important;
        font-weight: 400;
      }
    }

    .font-bold {
      font-weight: 700 !important;
    }

    .margin-bottom-10 {
      margin-bottom: 10px;
      // display: inline-block;
      // width: 50%;

    }

    .account-info {
      width: 60%;
      display: flex;
      flex-direction: column;
      padding: 40px 0;
      box-sizing: border-box;
      margin-left: 10px;

      .item-label {
        display: inline-block;
        text-align: left;
        width: 80px;
      }
    }

    .nowarp {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .account-padding {
      padding-left: 20px !important;
      padding-right: 40px !important;
    }

    .use-day {
      /*begin 兼容暗夜模式*/
      color: @text-color;
      /*end 兼容暗夜模式*/
      margin-top: 10px;
      font-size: 13px;
      span {
        color: #1e88e5;
        margin-left: 5px;
      }
    }
    .font-size-13 {
      font-size: 13px;
    }
  }
  // update-end-author:liusq date:20230625 for: [issues/563]暗色主题部分失效
</style>
