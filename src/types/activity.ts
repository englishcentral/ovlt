import { Word } from "./word";
import { filter, includes, intersection, isArray, isEmpty, last, sortBy } from "lodash-es";
import { ActivityV1 } from "./activity-v1";
import { Asset } from "./asset";
import { CanDo } from "./can-do";

export class Activity {
    activityID: number;
    activityTypeID: number;
    activityPoints?: number;
    started?: boolean;
    completed?: boolean;
    words?: Word[];
    wordCount?: number;
    sequence?: number;
    dialogDemoThumbnailURL?: string;
    dialogThumbnailURL?: string;
    thumbnailURL?: string;
    dialogID?: number;
    dialogTitle?: string;
    unitID?: number;
    children?: Activity[];
    wordLabel?: string;
    title?: string;
    metadataTitle?: string;
    detectorPosition?: string;
    detectorLabel?: string;
    assets?: Asset[];
    canDos?: CanDo;
    name?: string;

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
    static readonly ACTIVITY_TYPE_ID_GOLIVE: number = 32;

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
    static readonly ACTIVITY_TYPE_ID_ADAPTIVE_OVLT_ACTIVITY = 62;

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
     * Chat RolePlay
     */
    static readonly ACTIVITY_ID_CHAT_ROLE_PLAY = 32112;
    static readonly ACTIVITY_TYPE_ID_CHAT_ROLE_PLAY = 61;

    /*
     * Speaking Test
     */
    static readonly ACTIVITY_TYPE_ID_READ_ALOUD: number = 44;
    static readonly ACTIVITY_TYPE_ID_DESCRIPTION: number = 45;
    static readonly ACTIVITY_TYPE_ID_OPINION: number = 46;
    static readonly ACTIVITY_TYPE_ID_SPEAKING: number = 47;
    static readonly ACTIVITY_TYPE_ID_WRITING: number = 48;

    // Lesson Activity
    static readonly ACTIVITY_TYPE_ID_LESSON = 63;
    static readonly ACTIVITY_TYPE_ID_LINK = 64;

    static readonly ACTIVITY_POINTS_PERCENTAGE_THRESHOLD: number = 100;

    static readonly MY_WORDS_QUIZ_ACTIVITY_ID = 20489; // BC-52298/BC-52208

    static readonly DIALOG_ACTIVITIES: number[] = [
        Activity.ACTIVITY_TYPE_ID_WATCH,
        Activity.ACTIVITY_TYPE_ID_LEARN,
        Activity.ACTIVITY_TYPE_ID_SPEAK,
        Activity.ACTIVITY_TYPE_ID_COMPREHENSION_QUIZ
    ];

    static readonly CLIPLIST_ACTIVITIES: number[] = [
        Activity.ACTIVITY_CLIPLIST_NAMED_WATCH,
        Activity.ACTIVITY_CLIPLIST_NAMED_LEARN,
        Activity.ACTIVITY_CLIPLIST_NAMED_SPEAK,
        Activity.ACTIVITY_CLIPLIST_PRON_WATCH,
        Activity.ACTIVITY_CLIPLIST_PRON_SPEAK,
        Activity.ACTIVITY_CLIPLIST_VOCAB_LEARN,
        Activity.ACTIVITY_CLIPLIST_VOCAB_SPEAK,
        Activity.ACTIVITY_CLIPLIST_VOCAB_WATCH,
        Activity.ACTIVITY_CLIPLIST_DYNAMIC,
        Activity.ACTIVITY_TYPE_ID_COMPOSITE
    ];

    static readonly WATCH_ACTIVITIES: number[] = [
        Activity.ACTIVITY_TYPE_ID_WATCH,
        Activity.ACTIVITY_CLIPLIST_NAMED_WATCH,
        Activity.ACTIVITY_CLIPLIST_PRON_WATCH,
        Activity.ACTIVITY_CLIPLIST_VOCAB_WATCH
    ];

    static readonly LEARN_ACTIVITIES: number[] = [
        Activity.ACTIVITY_TYPE_ID_LEARN,
        Activity.ACTIVITY_CLIPLIST_NAMED_LEARN,
        Activity.ACTIVITY_CLIPLIST_VOCAB_LEARN
    ];

    static readonly SPEAK_ACTIVITIES: number[] = [
        Activity.ACTIVITY_TYPE_ID_SPEAK,
        Activity.ACTIVITY_CLIPLIST_NAMED_SPEAK,
        Activity.ACTIVITY_CLIPLIST_PRON_SPEAK,
        Activity.ACTIVITY_CLIPLIST_VOCAB_SPEAK,
        Activity.ACTIVITY_CLIPLIST_DYNAMIC
    ];

    /*
     * Activity points
     */
    static readonly POINTS_PER_QUIZZED_WORD = 10;
    static readonly ACTIVITY_POINTS_TEN = 10;
    static readonly ACTIVITY_POINTS_TWENTY = 20;
    static readonly ACTIVITY_POINTS_THIRTY = 30;

    static getModeName(activityTypeId?: number): string {
        if (Activity.isWatchActivity(activityTypeId)) {
            return "watch";
        }

        if (Activity.isLearnActivity(activityTypeId)) {
            return "learn";
        }

        if (Activity.isSpeakActivity(activityTypeId)) {
            return "speak";
        }

        if (Activity.isGoLiveActivity(activityTypeId)) {
            return "go-live";
        }

        if (Activity.isQuizActivity(activityTypeId)) {
            return "quiz";
        }

        return "";
    }

    static isWatchActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return includes([
            Activity.ACTIVITY_TYPE_ID_WATCH,
            Activity.ACTIVITY_CLIPLIST_NAMED_WATCH,
            Activity.ACTIVITY_CLIPLIST_VOCAB_WATCH,
            Activity.ACTIVITY_CLIPLIST_PRON_WATCH,
            Activity.ACTIVITY_TYPE_ID_COMPREHENSION_QUIZ
        ], activityTypeId);
    }

    static isLearnActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return includes([
            Activity.ACTIVITY_TYPE_ID_LEARN,
            Activity.ACTIVITY_CLIPLIST_NAMED_LEARN,
            Activity.ACTIVITY_CLIPLIST_VOCAB_LEARN
        ], activityTypeId);
    }

    static isSpeakActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return includes([
            Activity.ACTIVITY_TYPE_ID_SPEAK,
            Activity.ACTIVITY_CLIPLIST_NAMED_SPEAK,
            Activity.ACTIVITY_CLIPLIST_VOCAB_SPEAK,
            Activity.ACTIVITY_CLIPLIST_PRON_SPEAK,
            Activity.ACTIVITY_CLIPLIST_DYNAMIC
        ], activityTypeId);
    }

    static isQuizActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return includes([
            Activity.ACTIVITY_TYPE_ID_QUIZ,
            Activity.ACTIVITY_TYPE_ID_COURSE_QUIZ,
            Activity.ACTIVITY_TYPE_ID_COURSE_QUIZ_CURATED,
            Activity.ACTIVITY_TYPE_ID_VOCABULARY_COURSE_QUIZ
        ], activityTypeId);
    }

    static isCourseQuizActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }

        return includes([
            Activity.ACTIVITY_TYPE_ID_COURSE_QUIZ,
            Activity.ACTIVITY_TYPE_ID_COURSE_QUIZ_CURATED,
            Activity.ACTIVITY_TYPE_ID_VOCABULARY_COURSE_QUIZ
        ], activityTypeId);
    }

    static isComprehensionQuizActivity(activityTypeId: number): boolean {
        return activityTypeId === Activity.ACTIVITY_TYPE_ID_COMPREHENSION_QUIZ;
    }

    static isChatModeActivity(activityTypeId: number): boolean {
        return activityTypeId === Activity.ACTIVITY_TYPE_ID_CHAT_MODE;
    }

    static isGoLiveActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return activityTypeId == Activity.ACTIVITY_TYPE_ID_GOLIVE;
    }

    static isPronuncitationAnimationActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return activityTypeId == Activity.ACTIVITY_TYPE_ID_PRONUNCATION_ANIMATION;
    }

    static isDialogActivity(activityTypeId?: number | number[]): boolean {
        if (!activityTypeId) {
            return false;
        }
        if (isArray(activityTypeId)) {
            return intersection(activityTypeId, Activity.DIALOG_ACTIVITIES).length > 0;
        }
        return includes(Activity.DIALOG_ACTIVITIES, activityTypeId);
    }

    static isCliplistActivity(activityTypeId?: number | number[]) {
        if (!activityTypeId) {
            return false;
        }
        if (isArray(activityTypeId)) {
            return intersection(activityTypeId, Activity.CLIPLIST_ACTIVITIES).length > 0;
        }
        return includes(Activity.CLIPLIST_ACTIVITIES, activityTypeId);
    }

    static isDynamicCliplistActivity(activityTypeId?: number | number[]) {
        if (!activityTypeId) {
            return false;
        }
        if (isArray(activityTypeId)) {
            return intersection(activityTypeId, [Activity.ACTIVITY_CLIPLIST_DYNAMIC]).length > 0;
        }

        return includes([Activity.ACTIVITY_CLIPLIST_DYNAMIC], activityTypeId);
    }

    static isCompositeActivity(activityTypeId?: number): boolean {
        if (!activityTypeId) {
            return false;
        }
        return activityTypeId == Activity.ACTIVITY_TYPE_ID_COMPOSITE;
    }

    static getActivityTypeName(activityTypeId?: number): string {
        if (Activity.isWatchActivity(activityTypeId)) {
            return "watch";
        }

        if (Activity.isLearnActivity(activityTypeId)) {
            return "learn";
        }

        if (Activity.isSpeakActivity(activityTypeId)) {
            return "speak";
        }

        if (Activity.isQuizActivity(activityTypeId)) {
            return "quiz";
        }

        if (Activity.isGoLiveActivity(activityTypeId)) {
            return "go-live";
        }

        return "";
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
            || this.isChatModeActivity(activityTypeId);
    }

    static getDisplayOrder(activityTypeId?: number): number {
        if (this.isGoLiveActivity(activityTypeId)) {
            return 999; //always move GoLive at end of stack;
        }
        return activityTypeId;
    }

    static isActivitySubjectToPaywall(activityTypeId?: number): boolean {
        return Activity.isLearnActivity(activityTypeId)
            || Activity.isSpeakActivity(activityTypeId)
            || Activity.isChatModeActivity(activityTypeId);
    }

    static activityV1ToActivityLegacy(activities?: ActivityV1[]): Activity[] {
        if (!activities) {
            return undefined;
        }
        return activities.map(activity => {
            return {
                activityID: activity.activityId,
                activityTypeID: activity.activityTypeId,
                children: Activity.activityV1ToActivityLegacy(activity.children),
                ...activity
            } as Activity;
        });
    }
}

export class VocabAssessmentActivity extends Activity {
    static getUrl(activityId: number): string {
        return "/standalone-levelquiz/" + activityId;
    }

    static pickVocabularySet(activity: VocabAssessmentActivity, attempt: number) {
        let sortedActivities = filter(sortBy(activity.children, "sequence"), activity => !isEmpty(activity.children));
        return attempt > sortedActivities.length ? last(sortedActivities) : sortedActivities[attempt - 1];
    }
}

export const DEFAULT_ADAPTIVE_QUIZ_ACTIVITY = {
    activityID: 20488,
    activityTypeID: Activity.ACTIVITY_TYPE_ID_ADAPTIVE_VOCAB_QUIZ
};

export const DEFAULT_ADAPTIVE_TEST_ACTIVITY = {
    activityID: 20487,
    activityTypeID: Activity.ACTIVITY_TYPE_ID_ADAPTIVE_VOCAB_TEST
};

export const DEFAULT_VOCAB_BUILDER_ACTIVITY = {
    activityID: 18335,
    activityTypeID: Activity.ACTIVITY_TYPE_ID_VOCAB_BUILDER
};

export const VOCAB_LEVEL_TEST_ACTIVITY = {
    activityID: 18336,
    activityTypeID: Activity.ACTIVITY_TYPE_ID_VOCAB_LEVEL_TEST_ACTIVITY
};

export const OPEN_VOCAB_LEVEL_TEST_ACTIVITY = {
    activityID: 725001,
    activityTypeID: Activity.ACTIVITY_TYPE_ID_VOCAB_LEVEL_TEST_ACTIVITY
};

export const ADAPTIVE_OVLT2_ACTIVITY = {
    activityID: 50364,
    activityTypeID: Activity.ACTIVITY_TYPE_ID_ADAPTIVE_OVLT_ACTIVITY
};

export const DEFAULT_QUIZ_WORD_ACTIVITY = {
    activityID: 20489,
    activityTypeID: Activity.ACTIVITY_TYPE_ID_QUIZ_WORD
};

export const COURSE_QUIZ_ACTIVITY = {
    activityTypeID: Activity.ACTIVITY_TYPE_ID_COURSE_QUIZ
};

export const COURSE_QUIZ_CURATED_ACTIVITY = {
    activityTypeID: Activity.ACTIVITY_TYPE_ID_COURSE_QUIZ_CURATED
};

export const VOCABULARY_COURSE_QUIZ_ACTIVITY = {
    activityTypeID: Activity.ACTIVITY_TYPE_ID_VOCABULARY_COURSE_QUIZ
};

export const VIDEO_QUIZ_ACTIVITY = {
    activityTypeID: Activity.ACTIVITY_TYPE_ID_QUIZ
};

export const PRON_QUIZ_ACTIVITY = {
    activityID: 355643,
    activityTypeID: Activity.ACTIVITY_TYPE_ID_PRON_QUIZ
};

export const POINTS_PER_DYNAMIC_MODE_ITEM = 10;
