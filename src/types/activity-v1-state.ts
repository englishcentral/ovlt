import { ActivityV1 } from "./activity-v1";

export class ActivityV1State extends ActivityV1 {
    activityId: number | undefined;
    activityMetadataId?: number;
    expanded?: boolean = false;
    activityIds?: number[];
    completion?: number[];
    description?: string;
    dialogTitle?: string;
    url?: string;
    vocabBuilderModeId?: number;
    id?: number;
    showWords?: boolean = false;
}

export class ActivityUnitMatchPayload {
    activityMatchCourseUnits?: ActivityUnitMatchList[];
    courseUnitEditList?: ActivityUnitMatchList[];
}

export class ActivityUnitMatchList {
    courseUnitId?: number;
    activityId?: number;
    sequence?: number;
}

export class CmsActivity {
    body?: ActivityV1State;
}
