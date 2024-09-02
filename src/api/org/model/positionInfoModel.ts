import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
import {PositionSeqInfo} from "/@/api/org/model/positionSeqModel";

export type PositionInfoParams = {
  keyword?: string;
};

export type PositionInfoPageParams = BasicPageParams & PositionInfoParams;

export type PositionInfo = {
  positionCode?: string;
  positionName?: string;
  positionNameEn?: string;
  name?: string;
  orderNo?: number;
  status?: number;
  updator?: string;
  updateTime?: any;

};
export type BatchPositionInfoVo = {
  positionSeq: PositionSeqInfo;
  positionInfos: PositionInfo[];
};

/**
 * @description: Request list return value
 */
export type PositionInfoPageListGetResultModel = BasicFetchResult<PositionInfo>;
