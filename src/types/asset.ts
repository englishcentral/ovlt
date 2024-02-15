import { findLast, reduce } from "lodash-es";

export class Asset {
  assetTypeId: number;
  assetUrl: string;
  description: string;
  id: number;
  activityId?: number;
}

export const enum AssetType {
  WORD_AUDIO = 14,
  DIALOG_THUMB_SIZE_720P = 105,
  DIALOG_THUMB_SIZE_360P = 57,
  DIALOG_THUMB_SIZE_180P = 82,
  DIALOG_THUMB_MEDIUM_THUMBNAIL = 106,
  ROLEPLAY_THUMBNAIL = 107,
  LESSON_MATERIAL_STUDENT = 108,
  LESSON_MATERIAL_TEACHER = 109,
  TUTOR_THUMB = 90,
  TUTOR_PROFILE_PICTURE = 91,
  COURSE_THUMBNAIL = 101,
  COURSE_BANNER = 66,
  ASSET_TYPE_SUMMARY_ID = 9
}

export class AssetSearchParam {
  term?: string;
  limit?: number;
  start?: number;
  assetTypeIds?: number[];
}

export class AssetSearchResult {
  score?: number;
  value?: Asset;
}

export class AssetSearchResults {
  count?: number;
  results: AssetSearchResult[];
}

// @FIXME change any[] to Asset[] once fields naming are updated
export const getAssetByType = (assets: any[], assetType: string): any => {
  return findLast(assets, (asset) => asset?.assetType == assetType);
};

export const generateAssetLookup = (assets: Asset[]): Record<number, Asset> => {
  return reduce(assets, (acc, asset) => {
    acc[asset.assetTypeId] = asset;
    return acc;
  }, {});
};

export class CmsAsset {
  body?: Asset;
}
