import { assign, find, head, includes, intersection, isEmpty, isUndefined, map, reduce, union } from "lodash-es";
import { ActivityV1 } from "./activity-v1";
import { isBefore } from "date-fns";

export class CourseUnitV1 {
    label: string;
    name: string;
    sequence: number;
    unitId: number;
    activities?: ActivityV1[];
    compositeActivities?: ActivityV1[][];
    soundTileURL?: string;
    detectorLabel?: string;
    animationState?: string;
    lockedUntil?: number;

    static readonly DETECTOR_POSITION_INITIAL: string = "initial";
    static readonly DETECTOR_POSITION_MEDIAL: string = "medial";
    static readonly DETECTOR_POSITION_FINAL: string = "final";
    static readonly DETECTOR_POSITION_ANY: string = "any";

    static isActivityTypeDialog(compositeActivities: ActivityV1[]): boolean {
        return CourseUnitV1.isActivityType(compositeActivities, [
            ActivityV1.ACTIVITY_TYPE_ID_WATCH,
            ActivityV1.ACTIVITY_TYPE_ID_LEARN,
            ActivityV1.ACTIVITY_TYPE_ID_SPEAK]);
    }

    static isActivityTypeQuiz(compositeActivities: ActivityV1[]): boolean {
        return CourseUnitV1.isActivityType(compositeActivities, [ActivityV1.ACTIVITY_TYPE_ID_COURSE_QUIZ]);
    }

    static isActivityTypeLesson(compositeActivities: ActivityV1[]): boolean {
        return CourseUnitV1.isActivityType(compositeActivities, ActivityV1.LESSON_ACTIVITIES);
    }

    static isActivityTypeLink(compositeActivities: ActivityV1[]): boolean {
        return CourseUnitV1.isActivityType(compositeActivities, [ActivityV1.ACTIVITY_TYPE_ID_LINK]);
    }

    static isActivityTypeCuratedQuiz(compositeActivities: ActivityV1[]): boolean {
        return CourseUnitV1.isActivityType(compositeActivities, [ActivityV1.ACTIVITY_TYPE_ID_COURSE_QUIZ_CURATED]);
    }

    static isActivityTypeVocabularyCourseQuiz(compositeActivities: ActivityV1[]): boolean {
        return CourseUnitV1.isActivityType(compositeActivities, [ActivityV1.ACTIVITY_TYPE_ID_VOCABULARY_COURSE_QUIZ]);
    }

    static isActivityTypeComposite(compositeActivities: ActivityV1[]): boolean {
        return CourseUnitV1.isActivityType(compositeActivities, [ActivityV1.ACTIVITY_TYPE_ID_COMPOSITE]);
    }

    static isActivityTypeSimplePronunciationAnimation(compositeActivities: ActivityV1[]): boolean {
        return CourseUnitV1.isActivityType(compositeActivities, [ActivityV1.ACTIVITY_TYPE_ID_PRONUNCATION_ANIMATION]);
    }

    static isActivityTypeSimplePronunciationProgress(compositeActivities: ActivityV1[]): boolean {
        return CourseUnitV1.isActivityType(compositeActivities, [ActivityV1.ACTIVITY_TYPE_ID_SIMPLE_PRONUNCATION]);
    }

    static isDetectorPositionInitial(activity?: ActivityV1): boolean {
        if (!activity || !activity.detectorPosition) {
            return false;
        }
        return activity.detectorPosition == CourseUnitV1.DETECTOR_POSITION_INITIAL;
    }

    static isDetectorPositionMedial(activity?: ActivityV1): boolean {
        if (!activity || !activity.detectorPosition) {
            return false;
        }
        return activity.detectorPosition == CourseUnitV1.DETECTOR_POSITION_MEDIAL;
    }

    static isDetectorPositionFinal(activity?: ActivityV1): boolean {
        if (!activity || !activity.detectorPosition) {
            return false;
        }
        return activity.detectorPosition == CourseUnitV1.DETECTOR_POSITION_FINAL;
    }

    static isDetectorPositionAny(activity?: ActivityV1): boolean {
        if (!activity || !activity.detectorPosition) {
            return false;
        }
        return activity.detectorPosition == CourseUnitV1.DETECTOR_POSITION_ANY;
    }

    static isSupportedCourseUnitActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return !includes([
            ActivityV1.ACTIVITY_TYPE_ID_CHAT_MODE
        ], activityTypeId);
    }

    static extractActivityDetails(activity: ActivityV1): ActivityV1 | undefined {
        if (!isUndefined(activity.children)) {
            return assign({}, activity, head(activity.children));
        }

        return activity;
    }

    static getSpecialActivities(compositeActivities: ActivityV1[]): ActivityV1 | undefined {
        return find(compositeActivities, (activity) => {
            return !isEmpty(activity.children) || !isEmpty(activity.dialogId);
        });
    }

    static getFirstActivity(compositeActivities: ActivityV1[]): ActivityV1 | undefined {
        return find(compositeActivities, activity => {
            return activity.activityTypeId != ActivityV1.ACTIVITY_TYPE_ID_GOLIVE;
        });
    }

    static extractActivityIds(compositeActivities: ActivityV1[]): number[] | undefined {
        return map(compositeActivities, (activity) => {
            return activity.activityTypeId;
        });
    }

    static isActivityType(compositeActivities: ActivityV1[], activityTypeIds?: number[]): boolean {
        if (!activityTypeIds) {
            return false;
        }
        return intersection(CourseUnitV1.extractActivityIds(compositeActivities), activityTypeIds).length > 0;
    }

    static extractSupportedCourseUnitActivities(activities: ActivityV1[]): ActivityV1[] {
        return reduce(activities, (acc: ActivityV1[], activity) => {
            if (this.isSupportedCourseUnitActivity(activity.activityTypeId)) {
                return union(acc, [activity]);
            }
            return acc;
        }, []);
    }

    static getActivityDetails(activity: ActivityV1[]): ActivityV1 | undefined {
        let activities = activity;
        let specialActivity = CourseUnitV1.getSpecialActivities(activities);

        if (specialActivity) {
            return CourseUnitV1.extractActivityDetails(specialActivity);
        }

        let firstActivity = find(activities, activity => {
            return activity.activityTypeId != ActivityV1.ACTIVITY_TYPE_ID_GOLIVE;
        });

        return firstActivity ? CourseUnitV1.extractActivityDetails(firstActivity) : undefined;
    }

    static isUnitLocked(courseUnit: CourseUnitV1): boolean {
        return courseUnit?.lockedUntil && isBefore(new Date(), new Date(courseUnit?.lockedUntil));
    }
}

export class XCourseUnits {
    xCourseUnits: CourseUnitV1[];
}
