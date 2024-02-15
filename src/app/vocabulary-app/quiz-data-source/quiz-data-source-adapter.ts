import { VocabBuilderModelService } from "../../../model/content/vocab-builder-model.service";
import { VocabularyQuizModelService } from "../../../model/content/vocabulary-quiz-model.service";
import { QuizDataSourceAbstract } from "./quiz-data-source-abstract";
import {
    ADAPTIVE_OVLT2_ACTIVITY,
    COURSE_QUIZ_ACTIVITY,
    COURSE_QUIZ_CURATED_ACTIVITY,
    DEFAULT_ADAPTIVE_TEST_ACTIVITY,
    PRON_QUIZ_ACTIVITY,
    VOCAB_LEVEL_TEST_ACTIVITY,
    VOCABULARY_COURSE_QUIZ_ACTIVITY
} from "../../../model/types/content/activity";
import { WordQuizDataSource } from "./word-quiz-data-source";
import { CourseQuizDataSource } from "./course-quiz-data-source";
import { VocabProgressTestDataSource } from "./vocab-progress-test-data-source";
import { VocabBuilderDataSource } from "./vocab-builder-data-source";
import { MY_WORDS_WORD_LIST_COLLECTION } from "../../../model/types/word-list-reference";
import { PronQuizDataSource } from "./pron-quiz-data-source";
import { ClassVocabLevelTestDataSource } from "./vocab-level-test-data-source/class-vocab-level-test-data-source";
import { AccountVocabLevelTestDataSource } from "./vocab-level-test-data-source/account-vocab-level-test-data-source";
import { OvltClassDataSource } from "./vocab-level-test-data-source/ovlt-class-data-source";
import { OvltAccountDataSource } from "./vocab-level-test-data-source/ovlt-account-data-source";
import { QuizDataSourceAdapterSettings } from "./quiz-data-source-adapter-settings";

export class QuizDataSourceAdapter {
    static getAdapter(settings: QuizDataSourceAdapterSettings,
                      vocabBuilderModelService: VocabBuilderModelService,
                      vocabularyQuizModelService?: VocabularyQuizModelService): QuizDataSourceAbstract {
        if (!settings) {
            return new VocabBuilderDataSource(vocabBuilderModelService, settings);
        }

        if (settings.activityTypeId == PRON_QUIZ_ACTIVITY.activityTypeID
            || settings.isWordPronunciationQuiz
            || settings.isPhonemePronunciationQuiz) {
            return new PronQuizDataSource(vocabBuilderModelService, settings);
        }

        if (settings.isWordsPreSelected
            || QuizDataSourceAdapter.isMyWordList(settings?.wordListTypeId)) {
            return new WordQuizDataSource(vocabBuilderModelService, settings);
        }

        if ([COURSE_QUIZ_ACTIVITY.activityTypeID,
            COURSE_QUIZ_CURATED_ACTIVITY.activityTypeID,
            VOCABULARY_COURSE_QUIZ_ACTIVITY.activityTypeID].includes(settings.activityTypeId)) {
            return new CourseQuizDataSource(vocabularyQuizModelService, settings);
        }

        if (settings.activityTypeId == DEFAULT_ADAPTIVE_TEST_ACTIVITY.activityTypeID
            || !!settings.classTestExamId) {
            return new VocabProgressTestDataSource(vocabBuilderModelService, settings);
        }

        if (settings.activityTypeId == VOCAB_LEVEL_TEST_ACTIVITY.activityTypeID) {
            if (settings.classId) {
                return new ClassVocabLevelTestDataSource(vocabBuilderModelService, settings);
            }
            return new AccountVocabLevelTestDataSource(vocabBuilderModelService, settings);
        }

        if (settings.activityTypeId == ADAPTIVE_OVLT2_ACTIVITY.activityTypeID) {
            if (settings.classId) {
                return new OvltClassDataSource(vocabBuilderModelService, settings);
            }
            return new OvltAccountDataSource(vocabBuilderModelService, settings);
        }

        return new VocabBuilderDataSource(vocabBuilderModelService, settings);
    }

    static isMyWordList(wordListTypeId: number): boolean {
        return Object.values(MY_WORDS_WORD_LIST_COLLECTION).includes(wordListTypeId);
    }
}
