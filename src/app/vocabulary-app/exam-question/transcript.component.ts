import { Component, Input, OnChanges, Renderer2 } from "@angular/core";

@Component({
    selector: "ec-transcript",
    template: "<div class='transcript' [innerHTML]='mutatedTranscript'></div>",
    styleUrls: ["transcript.component.css"]
})
export class TranscriptComponent implements OnChanges {
    @Input() transcript: string;
    @Input() orthography: string;

    mutatedTranscript: string;
    protected match: string;

    constructor(protected renderer: Renderer2) {

    }

    ngOnChanges(changes) {
        this.mutatedTranscript = this.getTranscript();
    }

    getTranscript(): string {
        if (!this.transcript) {
            return "";
        }

        if (!this.orthography) {
            return this.transcript;
        }

        let matches = this.transcript.match(
            new RegExp("(\\W|^)(" + this.orthography + ")(\\W|$)","ig")
        );

        if (!matches || !matches.length) {
            return this.transcript;
        }

        this.match = matches[0];

        return this.transcript.replace(
            this.match,
            " <span class='transcript-word'>" + this.match.trim() + "</span> "
        );
    }
}
