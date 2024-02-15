import { CourseUnitV1 } from "./course-unit-v1";
import { Word } from "./word";
import { groupBy, head, includes, intersection, isArray, isUndefined, map, reduce, sortBy, uniq } from "lodash-es";
import { DialogLineV1 } from "./dialog-line-v1";
import { Asset } from "./asset";
import { CanDo } from "./can-do";
import { ActivityV1State } from "./activity-v1-state";

export class ActivityV1 {
    activityId: number;
    activityTypeId: number;
    activityPoints?: number;
    started?: boolean;
    completed?: boolean;
    words?: Word[];
    wordCount?: number;
    sequence?: number;
    dialogDemoThumbnailURL?: string;
    dialogThumbnailURL?: string;
    thumbnailURL?: string;
    dialogId?: number;
    dialogTitle?: string;
    dialogLines?: DialogLineV1[];
    unitId?: number;
    children?: ActivityV1[];
    assets?: Asset[];
    canDos?: CanDo;
    wordLabel?: string;
    title?: string;
    name?: string;
    metadataTitle?: string;
    detectorPosition?: string;
    detectorLabel?: string;
    description?: string;
    url?: string;

    /*
     * Cliplist - Named
     */
    static readonly ACTIVITY_CLIPLIST_NAMED_WATCH: number = 1;
    static readonly ACTIVITY_CLIPLIST_NAMED_LEARN: number = 2;
    static readonly ACTIVITY_CLIPLIST_NAMED_SPEAK: number = 3;

    /*
     * Cliplist - Pron
     */
    static readonly ACTIVITY_CLIPLIST_PRON_WATCH: number = 4;
    static readonly ACTIVITY_CLIPLIST_PRON_SPEAK: number = 5;

    /*
     * Cliplist - Vocab
     */
    static readonly ACTIVITY_CLIPLIST_VOCAB_WATCH: number = 6;
    static readonly ACTIVITY_CLIPLIST_VOCAB_LEARN: number = 7;
    static readonly ACTIVITY_CLIPLIST_VOCAB_SPEAK: number = 8;
    /*
     * Dialog
     */
    static readonly ACTIVITY_TYPE_ID_WATCH: number = 9;
    static readonly ACTIVITY_TYPE_ID_LEARN: number = 10;
    static readonly ACTIVITY_TYPE_ID_SPEAK: number = 11;
    static readonly ACTIVITY_TYPE_ID_PRONUNCATION_ANIMATION: number = 12;
    static readonly ACTIVITY_TYPE_ID_SIMPLE_PRONUNCATION: number = 13;
    static readonly ACTIVITY_TYPE_ID_QUIZ: number = 15;
    static readonly ACTIVITY_TYPE_ID_COURSE_QUIZ: number = 17;
    static readonly ACTIVITY_TYPE_ID_COURSE_QUIZ_CURATED: number = 37;
    static readonly ACTIVITY_TYPE_ID_COMPOSITE: number = 18;
    static readonly ACTIVITY_TYPE_ID_VOCABULARY_COURSE_QUIZ: number = 53;
    static readonly ACTIVITY_TYPE_ID_PRON_QUIZ: number = 54;
    static readonly ACTIVITY_TYPE_ID_CHAT_MODE: number = 55;
    static readonly ACTIVITY_TYPE_ID_CHAT_STANDALONE = 56;

    /*
     * Cliplist - Dynamic ??? it's in the DB
     */
    static readonly ACTIVITY_CLIPLIST_DYNAMIC: number = 20;
    static readonly ACTIVITY_TYPE_ID_TEST: number = 24;
    static readonly ACTIVITY_TYPE_ID_TEST_HTML: number = 31;

    /*
     * Quiz
     */
    static readonly ACTIVITY_TYPE_ID_QUIZ_WORD: number = 34;
    static readonly ACTIVITY_TYPE_ID_WORDQUIZ_CURATED: number = 37;
    static readonly ACTIVITY_TYPE_ID_VOCABULARY_ASSESSMENT: number = 38;
    static readonly ACTIVITY_TYPE_ID_VOCABULARY_ASSESSMENT_SET: number = 39;
    static readonly ACTIVITY_TYPE_ID_COMPREHENSION_QUIZ: number = 40;
    static readonly ACTIVITY_TYPE_ID_ADAPTIVE_VOCAB_QUIZ: number = 41;
    static readonly ACTIVITY_TYPE_ID_ADAPTIVE_VOCAB_TEST: number = 42;
    static readonly ACTIVITY_TYPE_ID_VOCAB_BUILDER: number = 50;
    static readonly ACTIVITY_TYPE_ID_VOCAB_LEVEL_TEST_ACTIVITY: number = 51;

    /*
     * Sentence Quiz
     */
    static readonly ACTIVITY_ID_SENTENCE_QUIZ = 91797;
    static readonly ACTIVITY_TYPE_ID_SENTENCE_SCRAMBLE: number = 57;
    static readonly ACTIVITY_TYPE_ID_SENTENCE_FILL_IN_BLANKS: number = 58;
    static readonly ACTIVITY_TYPE_ID_SENTENCE_TRANSLATION: number = 59;

    /*
     * Chat
     */
    static readonly ACTIVITY_ID_CHAT_WIZARD = 18337;
    static readonly ACTIVITY_TYPE_ID_CHAT_WIZARD = 60;

    /*
     * Speaking Test
     */
    static readonly ACTIVITY_TYPE_ID_READ_ALOUD: number = 44;
    static readonly ACTIVITY_TYPE_ID_DESCRIPTION: number = 45;
    static readonly ACTIVITY_TYPE_ID_OPINION: number = 46;
    static readonly ACTIVITY_TYPE_ID_SPEAKING: number = 47;
    static readonly ACTIVITY_TYPE_ID_WRITING: number = 48;

    // Lesson Activity
    static readonly ACTIVITY_TYPE_ID_GOLIVE: number = 32;
    static readonly ACTIVITY_TYPE_ID_LT: number = 33;
    static readonly ACTIVITY_TYPE_ID_OT: number = 35;
    static readonly ACTIVITY_TYPE_ID_LUT: number = 36;
    static readonly ACTIVITY_TYPE_ID_MATERIAL_LESSON = 63;
    static readonly ACTIVITY_TYPE_ID_LINK = 64;

    static readonly ACTIVITY_POINTS_PERCENTAGE_THRESHOLD: number = 100;

    static readonly MY_WORDS_QUIZ_ACTIVITY_ID = 20489; // BC-52298/BC-52208

    static readonly DIALOG_ACTIVITIES: number[] = [
        ActivityV1.ACTIVITY_TYPE_ID_WATCH,
        ActivityV1.ACTIVITY_TYPE_ID_LEARN,
        ActivityV1.ACTIVITY_TYPE_ID_SPEAK,
        ActivityV1.ACTIVITY_TYPE_ID_COMPREHENSION_QUIZ
    ];

    static readonly CLIPLIST_ACTIVITIES: number[] = [
        ActivityV1.ACTIVITY_CLIPLIST_NAMED_WATCH,
        ActivityV1.ACTIVITY_CLIPLIST_NAMED_LEARN,
        ActivityV1.ACTIVITY_CLIPLIST_NAMED_SPEAK,
        ActivityV1.ACTIVITY_CLIPLIST_PRON_WATCH,
        ActivityV1.ACTIVITY_CLIPLIST_PRON_SPEAK,
        ActivityV1.ACTIVITY_CLIPLIST_VOCAB_LEARN,
        ActivityV1.ACTIVITY_CLIPLIST_VOCAB_SPEAK,
        ActivityV1.ACTIVITY_CLIPLIST_VOCAB_WATCH,
        ActivityV1.ACTIVITY_CLIPLIST_DYNAMIC,
        ActivityV1.ACTIVITY_TYPE_ID_COMPOSITE
    ];

    static readonly WATCH_ACTIVITIES: number[] = [
        ActivityV1.ACTIVITY_TYPE_ID_WATCH,
        ActivityV1.ACTIVITY_CLIPLIST_NAMED_WATCH,
        ActivityV1.ACTIVITY_CLIPLIST_PRON_WATCH,
        ActivityV1.ACTIVITY_CLIPLIST_VOCAB_WATCH
    ];

    static readonly LEARN_ACTIVITIES: number[] = [
        ActivityV1.ACTIVITY_TYPE_ID_LEARN,
        ActivityV1.ACTIVITY_CLIPLIST_NAMED_LEARN,
        ActivityV1.ACTIVITY_CLIPLIST_VOCAB_LEARN
    ];

    static readonly SPEAK_ACTIVITIES: number[] = [
        ActivityV1.ACTIVITY_TYPE_ID_SPEAK,
        ActivityV1.ACTIVITY_CLIPLIST_NAMED_SPEAK,
        ActivityV1.ACTIVITY_CLIPLIST_PRON_SPEAK,
        ActivityV1.ACTIVITY_CLIPLIST_VOCAB_SPEAK,
        ActivityV1.ACTIVITY_CLIPLIST_DYNAMIC
    ];

    static readonly LESSON_ACTIVITIES = [
        ActivityV1.ACTIVITY_TYPE_ID_LT,
        ActivityV1.ACTIVITY_TYPE_ID_OT,
        ActivityV1.ACTIVITY_TYPE_ID_LUT,
        ActivityV1.ACTIVITY_TYPE_ID_MATERIAL_LESSON
    ];

    /*
     * Activity points
     */
    static readonly POINTS_PER_QUIZZED_WORD = 10;
    static readonly ACTIVITY_POINTS_TEN = 10;
    static readonly ACTIVITY_POINTS_TWENTY = 20;
    static readonly ACTIVITY_POINTS_THIRTY = 30;

    static isWatchActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return includes([
            ActivityV1.ACTIVITY_TYPE_ID_WATCH,
            ActivityV1.ACTIVITY_CLIPLIST_NAMED_WATCH,
            ActivityV1.ACTIVITY_CLIPLIST_VOCAB_WATCH,
            ActivityV1.ACTIVITY_CLIPLIST_PRON_WATCH,
            ActivityV1.ACTIVITY_TYPE_ID_COMPREHENSION_QUIZ
        ], activityTypeId);
    }

    static isLearnActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return includes([
            ActivityV1.ACTIVITY_TYPE_ID_LEARN,
            ActivityV1.ACTIVITY_CLIPLIST_NAMED_LEARN,
            ActivityV1.ACTIVITY_CLIPLIST_VOCAB_LEARN
        ], activityTypeId);
    }

    static isSpeakActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return includes([
            ActivityV1.ACTIVITY_TYPE_ID_SPEAK,
            ActivityV1.ACTIVITY_CLIPLIST_NAMED_SPEAK,
            ActivityV1.ACTIVITY_CLIPLIST_VOCAB_SPEAK,
            ActivityV1.ACTIVITY_CLIPLIST_PRON_SPEAK,
            ActivityV1.ACTIVITY_CLIPLIST_DYNAMIC
        ], activityTypeId);
    }

    static isQuizActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return includes([
            ActivityV1.ACTIVITY_TYPE_ID_QUIZ,
            ActivityV1.ACTIVITY_TYPE_ID_COURSE_QUIZ,
            ActivityV1.ACTIVITY_TYPE_ID_COURSE_QUIZ_CURATED,
            ActivityV1.ACTIVITY_TYPE_ID_VOCABULARY_COURSE_QUIZ
        ], activityTypeId);
    }

    static isCourseQuizActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }

        return includes([
            ActivityV1.ACTIVITY_TYPE_ID_COURSE_QUIZ,
            ActivityV1.ACTIVITY_TYPE_ID_COURSE_QUIZ_CURATED,
            ActivityV1.ACTIVITY_TYPE_ID_VOCABULARY_COURSE_QUIZ
        ], activityTypeId);
    }

    static isComprehensionQuizActivity(activityTypeId: number): boolean {
        return activityTypeId === ActivityV1.ACTIVITY_TYPE_ID_COMPREHENSION_QUIZ;
    }

    static isChatModeActivity(activityTypeId: number): boolean {
        return activityTypeId === ActivityV1.ACTIVITY_TYPE_ID_CHAT_MODE;
    }

    static isGoLiveActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return activityTypeId == ActivityV1.ACTIVITY_TYPE_ID_GOLIVE;
    }

    static isPronuncitationAnimationActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return activityTypeId == ActivityV1.ACTIVITY_TYPE_ID_PRONUNCATION_ANIMATION;
    }

    static isDialogActivity(activityTypeId?: number | number[]): boolean {
        if (!activityTypeId) {
            return false;
        }
        if (isArray(activityTypeId)) {
            return intersection(activityTypeId, ActivityV1.DIALOG_ACTIVITIES).length > 0;
        }
        return includes(ActivityV1.DIALOG_ACTIVITIES, activityTypeId);
    }

    static isCliplistActivity(activityTypeId?: number | number[]) {
        if (!activityTypeId) {
            return false;
        }
        if (isArray(activityTypeId)) {
            return intersection(activityTypeId, ActivityV1.CLIPLIST_ACTIVITIES).length > 0;
        }
        return includes(ActivityV1.CLIPLIST_ACTIVITIES, activityTypeId);
    }

    static isDynamicCliplistActivity(activityTypeId?: number | number[]) {
        if (!activityTypeId) {
            return false;
        }
        if (isArray(activityTypeId)) {
            return intersection(activityTypeId, [ActivityV1.ACTIVITY_CLIPLIST_DYNAMIC]).length > 0;
        }

        return includes([ActivityV1.ACTIVITY_CLIPLIST_DYNAMIC], activityTypeId);
    }

    static isCompositeActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return activityTypeId == ActivityV1.ACTIVITY_TYPE_ID_COMPOSITE;
    }

    static isLinkActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return activityTypeId == ActivityV1.ACTIVITY_TYPE_ID_LINK;
    }

    static getActivityTypeName(activityTypeId?: number): string {
        if (ActivityV1.isWatchActivity(activityTypeId)) {
            return "watch";
        }
        if (ActivityV1.isLearnActivity(activityTypeId)) {
            return "learn";
        }
        if (ActivityV1.isSpeakActivity(activityTypeId)) {
            return "speak";
        }
        if (ActivityV1.isQuizActivity(activityTypeId)) {
            return "quiz";
        }
        if (ActivityV1.isGoLiveActivity(activityTypeId)) {
            return "go-live";
        }
        if (ActivityV1.isChatModeActivity(activityTypeId)) {
            return "LT";
        }
        if (ActivityV1.isChatModeActivity(activityTypeId)) {
            return "OT";
        }
        if (ActivityV1.isChatModeActivity(activityTypeId)) {
            return "LUT";
        }
        if (ActivityV1.isChatModeActivity(activityTypeId)) {
            return "material lesson";
        }
    }

    static isValidActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }

        return this.isWatchActivity(activityTypeId)
            || this.isLearnActivity(activityTypeId)
            || this.isSpeakActivity(activityTypeId)
            || this.isQuizActivity(activityTypeId)
            || this.isGoLiveActivity(activityTypeId)
            || this.isCompositeActivity(activityTypeId)
            || this.isPronuncitationAnimationActivity(activityTypeId)
            || this.isDynamicCliplistActivity(activityTypeId)
            || this.isChatModeActivity(activityTypeId)
            || this.isLessonActivity(activityTypeId);
    }

    static isLessonActivity(activityTypeId?: number): boolean {
        return this.LESSON_ACTIVITIES.includes(activityTypeId);
    }

    static buildActivityComposite(unit: CourseUnitV1): ActivityV1[][] {
        return sortBy(
            groupBy(
                CourseUnitV1.extractSupportedCourseUnitActivities(unit?.activities),
                "sequence"
            ), (activities: ActivityV1[]) => {
                let firstActivity = head(activities);
                if (!firstActivity || !firstActivity.sequence) {
                    return 0;
                }
                return firstActivity.sequence;
            }
        );
    }

    static getActivityFromComposite(compositeActivity: ActivityV1State[]): ActivityV1State {
        if (!compositeActivity) {
            return {
                activityId: undefined,
                activityTypeId: undefined,
                dialogId: undefined,
                activityIds: []
            };
        }

        return reduce(compositeActivity, (acc: ActivityV1State, activity) => {
            if (!activity) {
                return acc;
            }

            if (activity.children) {
                acc.activityIds = map(activity.children, (subActivity) => {
                    return subActivity.activityId;
                });
            } else {
                acc = isUndefined(acc?.activityId) ? activity : acc;
                if (activity.activityId) {
                    acc.activityIds = uniq(!acc.activityIds ? [activity.activityId] : [...acc.activityIds, ...[activity.activityId]]);
                    acc.completion = uniq(!acc.completion ? [activity.activityTypeId] : [...acc.completion, ...[activity.activityTypeId]]);
                }
            }

            return acc;
        }, {
            activityId: undefined,
            activityTypeId: undefined,
            dialogId: undefined,
            activityIds: []
        });
    }
}

