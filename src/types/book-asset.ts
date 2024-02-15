import { find, isUndefined } from "lodash-es";
import { format } from "date-fns";

export class BookAsset {
  static readonly TYPE_LARGE_VIDEO = 1;
  static readonly TYPE_MEDIUM_VIDEO = 2;
  static readonly TYPE_SMALL_VIDEO = 3;
  static readonly TYPE_LARGE_VIDEO_IMAGE = 4;
  static readonly TYPE_MEDIUM_VIDEO_IMAGE = 5;
  static readonly TYPE_SMALL_VIDEO_IMAGE = 6;
  static readonly TYPE_SLOW_SPEAK_AUDIO = 7;
  static readonly TYPE_AUDIO = 8;
  static readonly TYPE_LINE_VIDEO = 9;
  static readonly TYPE_LINE_IMAGE = 10;

  assetId?: number;
  assetTypeId: number;
  assetUrl: string;
  duration?: number;

  static getAssetS3Folder(assetTypeId: number): string {
    let folder: string;
    switch (assetTypeId) {
      case 1:
      case 2:
      case 3:
      case 9:
        folder = "video";
        break;
      case 4:
      case 5:
      case 6:
      case 10:
        folder = "image";
        break;
      case 7:
      case 8:
        folder = "audio";
        break;
    }

    return folder;
  }

  static getTempAssetName(assetTypeId: number, assetUrl: string): string {
    let folder = BookAsset.getAssetS3Folder(assetTypeId);
    let params = assetUrl.split(".");
    let ext = params[params.length - 1];
    return folder + "/" + assetTypeId + "_" + format(new Date(), "yyyyMMddHHmmss") + "." + ext;
  }

  static getAssetType(assets: BookAsset[], assetTypeId: number): BookAsset {
    return find(assets, assetData => {
      if (!isUndefined(assetData)) {
        return assetData.assetTypeId == assetTypeId;
      }
    });
  }

  static getAssetImageLarge(content: BookAsset[]): BookAsset {
    return BookAsset.getAssetType(content, BookAsset.TYPE_LARGE_VIDEO_IMAGE);
  }

  static getAssetImageMedium(content: BookAsset[]): BookAsset {
    return BookAsset.getAssetType(content, BookAsset.TYPE_MEDIUM_VIDEO_IMAGE);
  }

  static getAssetImageSmall(content: BookAsset[]): BookAsset {
    return BookAsset.getAssetType(content, BookAsset.TYPE_SMALL_VIDEO_IMAGE);
  }

  static getAssetVideoLarge(content: BookAsset[]): BookAsset {
    return BookAsset.getAssetType(content, BookAsset.TYPE_LARGE_VIDEO);
  }

  static getAssetVideoMedium(content: BookAsset[]): BookAsset {
    return BookAsset.getAssetType(content, BookAsset.TYPE_MEDIUM_VIDEO);
  }

  static getAssetVideoSmall(content: BookAsset[]): BookAsset {
    return BookAsset.getAssetType(content, BookAsset.TYPE_SMALL_VIDEO);
  }

  static getAssetSlowSpeak(content: BookAsset[]): BookAsset {
    return BookAsset.getAssetType(content, BookAsset.TYPE_SLOW_SPEAK_AUDIO);
  }

  static getAssetAudio(content: BookAsset[]): BookAsset {
    return BookAsset.getAssetType(content, BookAsset.TYPE_AUDIO);
  }
}
