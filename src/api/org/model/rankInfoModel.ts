import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
import {RankSeqInfo} from "/@/api/org/model/positionSeqModel";

export type RankInfoParams = {
  keyword?: string;
};

export type RankInfoPageParams = BasicPageParams & RankInfoParams;

export type RankInfo = {
  positionCode?: string;
  positionName?: string;
  positionNameEn?: string;
  name?: string;
  orderNo?: number;
  status?: number;
  updator?: string;
  updateTime?: any;

};
export type BatchRankInfoVo = {
  positionSeq: RankSeqInfo;
  positionInfos: RankInfo[];
};

/**
 * @description: Request list return value
 */
export type RankInfoPageListGetResultModel = BasicFetchResult<RankInfo>;
