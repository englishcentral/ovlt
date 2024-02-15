import { MyWordStateV1 } from "./my-word-state-v1";
import { MyWordCourse } from "./my-word-course";

export class MyWordStateV2 {
    overall: MyWordStateV1;
    courses: MyWordCourse[];
    fallback?: boolean;
}

export class MyWordState {
    overall: MyWordStateV1;
    fallback?: boolean;
    retryAfterSeconds?: number;
}
