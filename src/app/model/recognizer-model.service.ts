import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable, timer } from "rxjs";
import { compact, filter, isUndefined, join, padStart } from "lodash-es";
import { Logger } from "../common/logger";
import { RecognizerSettingService } from "../microphone-widget/recognizer-setting.service";
import { RecognizerResult } from "../../types/recognizer-result";
import { RecordingMediaBlob } from "../../types/encoder";


export const MODE_LINE = "line";
export const MODE_WORD = "word";
export const MODE_UPLOAD = "upload";
export const MODE_SPEECH_TO_TEXT = "speech-to-text";

export const HTTP_REQUEST_HANDLER = "http";
export const WEBSOCKET_REQUEST_HANDLER = "websocket";

export class RecognizerModelOptions {
    solution: string;
    audioStreamObservable: Observable<RecordingMediaBlob>;
    additionalOptions: Record<any, any>;
    recognizerType?: number;
    recognizerMode?: "line" | "word" | "upload" | "speech-to-text";
    serviceVersion?: string;
    fileTransferMode?: "http" | "websocket" | string;
    endOfSpeechDetectionEnabled?: boolean;
}

@Injectable({providedIn: "root"})
export class RecognizerModelService {
    private logger = new Logger();

    constructor(private recognizerSettingService: RecognizerSettingService) {
    }

    recognizeAudio(recognizerModelOptions: RecognizerModelOptions, trackingContext?: Record<string, string>): Observable<RecognizerResult> {
        return this.postAudioRecording(recognizerModelOptions)
            .pipe(
                map((recognizerResponse) => {
                    if (recognizerResponse) {
                        let [[xmlString, statusCode = 0], recognizerType] = recognizerResponse;
                        return new RecognizerResult(xmlString);
                    }
                    return undefined;
                })
            );
    }

    private postAudioRecording(recognizerModelOptions: RecognizerModelOptions): Observable<[[string, number], number] | undefined> {
        let recognizerTypeParam = this.recognizerSettingService.getRecognizerType(recognizerModelOptions.recognizerType);
        return timer(1000).pipe(
            map(() => {
                return `<?xml version="1.0" encoding="US_ASCII" standalone="yes"?><session><meta><xmlURL>https://recordings.englishcentral.com/042/2024/01/19/20240119025010640_341240_10.xml</xmlURL><dateCreated>2024-02-19T02:50:13.807Z</dateCreated><recognizerType>1</recognizerType><modelVersion>prod-model-20231121</modelVersion><modelType>0</modelType><languageVersion>202311211024</languageVersion><fileTransferMode>websocket</fileTransferMode><useOnnxClassifier>false</useOnnxClassifier></meta><request><streamName>042/2024/01/19/20240119025010640_341240_10</streamName><sessionLineTimeKey>20240219025010640</sessionLineTimeKey><accountID>341240</accountID><partnerID>82</partnerID><organizationID>102102</organizationID><classID>144870</classID><activityTypeID>50</activityTypeID><sessionTypeID>10</sessionTypeID><dialogID>0</dialogID><dialogLineID>0</dialogLineID><dialogLineText>MR</dialogLineText><accountSentenceID>0</accountSentenceID><siteLanguage>en</siteLanguage><geolocation>PH</geolocation><userAgent>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36</userAgent><gain>75</gain><previousAudioLevelCount>0</previousAudioLevelCount><previousAverageVoiceLevel>0</previousAverageVoiceLevel></request><server/><queue><dateQueued>2024-02-19T02:50:13.807Z</dateQueued></queue><result><score><status>GOOD</status><warningCode>0</warningCode><errorCode>0</errorCode><rejectionCode>0</rejectionCode><dialogLineID>0</dialogLineID><fluencyScore>1.0</fluencyScore><lineScore>0.0</lineScore><nativeness><nativenessClass>4</nativenessClass><status>0</status><message>SUCCESS</message><probability>0.503</probability></nativeness><message></message><nonSilWordCount>1</nonSilWordCount><deduction><deletionWords>0.0</deletionWords><substitutionWords>1.0</substitutionWords><insertionWords>0.0</insertionWords><unintelligibleWords>0.0</unintelligibleWords></deduction></score><eofDetected>false</eofDetected><nbestIndex>0</nbestIndex><nbestText>my</nbestText><audio><audioURL>https://recordings.englishcentral.com/042/2024/01/19/20240119025010640_341240_10.mp4</audioURL><sourceURL>https://recordings.englishcentral.com/042/2024/01/19/20240119025010640_341240_10.webm</sourceURL><isClipping>false</isClipping><minLevel>11</minLevel><maxLevel>53</maxLevel><averageLevel>26</averageLevel><voiceFrameCount>4</voiceFrameCount><newGain>84</newGain><audioLevelCount>1</audioLevelCount><averageVoiceLevel>53</averageVoiceLevel><startTime>480</startTime><endTime>1020</endTime><averageSnr>101</averageSnr><isNarrowBand>false</isNarrowBand><averageDB>26</averageDB><averageVoiceDB>51</averageVoiceDB></audio><words><word><label>mr</label><status>BAD</status><classifierStatus>BAD</classifierStatus><evaluation>SUBSTITUTION</evaluation><score>0.0</score><startTime>480</startTime><endTime>1020</endTime><wordID>0</wordID><wordRootID>0</wordRootID><wordInstanceID>395893</wordInstanceID><pronunciationID>0</pronunciationID><children/><phonemes/></word></words></result></session>`;
            }),
            map(rawResponse => {
                return [[rawResponse, recognizerTypeParam], 2];
            })
        );
    }

}

// streamName (608/2016/11/28/437806/20161128193923258_437806_1_12802_56461)
// (invert last 3 accountID / YYYY / MM / DD / YYYYMMDDHHNNSSmmm _ AccountID _ SessionTypeID _ DialogID _ DialogLineID)
export const createStreamName = (accountId: number = 0,
                                 sessionTypeId = "SESSION_TYPE_DIALOG_VIDEO",
                                 dialogId?: number,
                                 dialogLineId?: number): string => {
    let currentTime = new Date();
    let inverted = accountId.toString()
        .split("")
        .reverse()
        .join("")
        .substr(0, 3);

    let currentYear = currentTime.getUTCFullYear();
    let currentMonth = padStart(currentTime.getUTCMonth().toString(), 2, "0");
    let currentDay = padStart(currentTime.getUTCDate().toString(), 2, "0");
    let currentHour = padStart(currentTime.getUTCHours().toString(), 2, "0");
    let currentMinutes = padStart(currentTime.getUTCMinutes().toString(), 2, "0");
    let currentSeconds = padStart(currentTime.getUTCSeconds().toString(), 2, "0");
    let currentMs = padStart(currentTime.getUTCMilliseconds().toString(), 3, "0");

    let required = join(compact([
        inverted,
        currentYear,
        currentMonth,
        currentDay,
        `${currentYear}${currentMonth}${currentDay}${currentHour}${currentMinutes}${currentSeconds}${currentMs}`
    ]), "/");

    return join(filter([
        required,
        accountId,
        sessionTypeId,
        dialogId,
        dialogLineId
    ], (value) => !isUndefined(value)), "_");
};
