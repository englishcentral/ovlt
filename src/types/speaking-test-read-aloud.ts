import { filter, findIndex, includes, isUndefined } from "lodash-es";
import { RatingCandidate } from "./rating-candidate";
import { TranscriptionWord } from "./transcription";
import { DialogLineToken } from "./activity-progress";
import { WordV1 } from "./word-v1";
import { TranscriptionValue } from "./transcription-value";

export class SpeakingTestReadAloud {
    accountID: number;
    activityID: number;
    overallScore: number;
    pronScore: number;
    rhythmScore: number;
    transcripts: ReadAloudTranscript[];
    transcriptDetails: ReadAloudTranscript[];
}

export class ReadAloudTranscript extends RatingCandidate {
    activityID?: number;
    activityId?: number;
    audioURL?: string;
    bucketRatingWords?: TranscriptionWord;
    dialogLineId?: number;
    transcript?: string;
    sequence?: number;
    transcriptID?: number;
    audioRecordingURL?: string;
    words?: TranscriptionWord[];
    transcriptionValueID?: number;
    state?: string;
    hint?: string;
    firstRating?: number;
    transcriptWords?: TranscriptionWord[];
    comment?: string;
    ratingShown?: boolean;
    played?: boolean;
    wordPronounceDetails?: WordV1[];
    isLineRated?: boolean;
    isSaving?: boolean;
    insertions?: number[];
    ratingId?: number;
    selected?: boolean;
    showMoreRatings?: boolean = false;
    removedInsertions?: number[];
    ratingValueId?: number;
    ratingCandidateId?: number;
    recordingUrl?: string;
    activityTypeId?: number;
    videoURL?: string;
    token?: DialogLineToken;

    pronunciationScore?: number;

    static readonly RATING_TYPE_LINE_TRANSCRIPTION: string = "line-transcription";

    static getRating(line: ReadAloudTranscript, ratingType: string): number {
        if (isUndefined(line[ratingType])) {
            line[ratingType] = {score: 0};
        }

        return line[ratingType].score;
    }

    static getField(rating: string): string {
        let currentIndex = findIndex(ReadAloudTranscript.fields, field => {
            return rating == field.name;
        });

        if (currentIndex == -1) {
            return undefined;
        }

        return ReadAloudTranscript.fields[currentIndex].field;
    }

    static isRatingIncomplete(line: ReadAloudTranscript): boolean {
        return line.audioRecordingURL &&
            ReadAloudTranscript.getRating(line, "firstPass") &&
            !ReadAloudTranscript.isRatingComplete(line)
        ;
    }

    static isRatingComplete(line: ReadAloudTranscript): boolean {
        if (line.ratingShown) {
            return true;
        }

        if (line.played && isUndefined(line.firstPass)) {
            return false;
        }

        if (line.played && line.firstPass.score <= 0) {
            return false;
        }

        if (
            ReadAloudTranscript.isAudioPlayed(line) &&
            (
                isUndefined(line.firstPass) ||
                isUndefined(line.intonation) ||
                isUndefined(line.rhythm) ||
                isUndefined(line.finalRating)
            )
        ) {
            return false;
        }

        return this.allScoreEntered(line);
    }

    static isAudioPlayed(line: ReadAloudTranscript): boolean {
        return isUndefined(line.played) ? false : line.played;
    }

    static allScoreEntered(line: ReadAloudTranscript): boolean {
        return (
            line.firstPass &&
            line.firstPass.score > 0 &&
            line.intonation &&
            line.intonation.score > 0 &&
            line.rhythm &&
            line.rhythm.score > 0 &&
            line.finalRating &&
            line.finalRating.score > 0
        ) || includes([
            TranscriptionValue.KIRIHARA_NOISE,
            TranscriptionValue.KIRIHARA_NOISE_QUIET,
            TranscriptionValue.KIRIHARA_NOISE_LOUD
        ], line.transcriptionValueID);
    }

    static areAllLinesCompleted(lines: ReadAloudTranscript[]): boolean {
        let inComplete = filter(lines, line => {
            return !ReadAloudTranscript.allScoreEntered(line);
        });

        return inComplete.length == 0;
    }

    static areAllLinesRated(lines: ReadAloudTranscript[]): boolean {
        let inComplete = filter(lines, line => {
            return !((
                line.firstPass &&
                line.firstPass.score > 0
            ) || includes([
                TranscriptionValue.KIRIHARA_NOISE,
                TranscriptionValue.KIRIHARA_NOISE_QUIET,
                TranscriptionValue.KIRIHARA_NOISE_LOUD
            ], line.transcriptionValueID));
        });

        return inComplete.length == 0;
    }
}

export class RatingComment {
    transcriptID: number;
    comment: string;
    transcriptionValueID?: number;

    ratingCandidateId?: number;
    accountId?: number;
    activityId?: number;
    activityTypeId?: number;
    ratingValueId?: number;

    transcript?: string;
    sequence?: number;
    audioRecordingURL?: string;
    words?: WordV1[];
}
