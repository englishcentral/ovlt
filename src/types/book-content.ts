import { BookAsset } from "./book-asset";
import { filter, find, isUndefined } from "lodash-es";

export class BookContent {
  static readonly TYPE_TEXT = 1;
  static readonly TYPE_INSTRUCTION = 2;
  static readonly TYPE_QUESTION = 3;
  static readonly TYPE_TITLE = 4;
  static readonly TYPE_DISPLAYNAME = 5;
  static readonly TYPE_HTML_TEXT = 6;
  static readonly TYPE_DESCRIPTION = 7;
  static readonly TYPE_FACE_UP = 8;
  static readonly TYPE_FACE_DOWN = 9;
  static readonly TYPE_MORE_INFO_CONTENT = 10;
  static readonly TYPE_EXAMPLE_ANSWER = 11;
  static readonly TYPE_CARD = 12;
  static readonly TYPE_DIALOG = 13;
  static readonly TYPE_VIDEO = 14;
  static readonly TYPE_VIDEO_LINE = 15;
  static readonly TYPE_WORD = 16;
  static readonly TYPE_CHOICE = 17;
  static readonly TYPE_CHOICES = 18;
  static readonly TYPE_TILE = 19;
  static readonly TYPE_TILE_CONTAINER = 20;
  static readonly TYPE_IMAGE = 21;
  static readonly TYPE_AUDIO = 22;
  static readonly TYPE_LETTER_SPOTTER_TEXT = 23;
  static readonly TYPE_LETTER_SPOTTER_TEXT_CONTAINER = 24;
  static readonly TYPE_EMAIL = 25;
  static readonly TYPE_BUSINESS_WRITING_TEXT = 26;
  static readonly TYPE_BUSINESS_WRITING_TEXT_CONTAINER = 27;
  static readonly TYPE_CLICKABLE_WORDS = 29;
  static readonly TYPE_WORD_CARD_FORM = 31;
  static readonly TYPE_CUSTOM_WORD_DEFINITION = 32;
  static readonly TYPE_CHARACTER = 33;

  static readonly TYPE_CHILD_CONTENT = "childContent";
  static readonly TYPE_ACTIVITY_CONTENT = "activityContent";

  static readonly LANGUAGE_JA = 1;
  static readonly LANGUAGE_EN = 2;
  static readonly LANGUAGE_JA_TEXT = "ja";
  static readonly LANGUAGE_EN_TEXT = "en";

  static readonly types: { type: string, description: string, id: number }[] = [
    {type: "text", description: "Text", id: BookContent.TYPE_TEXT},
    {type: "instruction", description: "Instruction", id: BookContent.TYPE_INSTRUCTION},
    {type: "question", description: "Question", id: BookContent.TYPE_QUESTION},
    {type: "title", description: "Title", id: BookContent.TYPE_TITLE},
    {type: "displayname", description: "Display Name", id: BookContent.TYPE_DISPLAYNAME}
  ];

  activityId?: number;
  activityTypeId?: number;
  bucketSize?: number;
  characterId?: number;
  children?: BookContent[];
  content?: any[];
  contentId?: number;
  contentTypeId?: number;
  correct?: boolean;
  displayText?: string;
  duration?: number;
  ecDialogLineId?: number;
  sequence?: number;
  timeLimit?: number;
  isEditing?: boolean = false;
  isEditingDistractor?: boolean = false;
  isWord?: boolean;
  itemNumber?: number;
  imageUrl?: string;
  instructions?: string;
  line?: string;
  name?: string;
  selected?: boolean = false;
  statement?: string;
  value?: any;
  hint?: string;
  familyBucketSize?: number;
  points?: number;
  enText?: string;
  jaText?: string;
  defaultLocaleId?: number;
  ecDialogId?: number;
  assets?: BookAsset[];
  text?: string;
  provided?: boolean;
  faceUpText?: string;
  faceDownText?: string;
  wordId?: number;
  bookTitle?: string;
  word?: BookContentWord;
  wordInstanceId?: number;
  hideDialogLine?: boolean;
  hideTranscript?: boolean;
  books?: BookContent;
  published?: boolean;
  lessonType?: string;
  hidden?: boolean;

  static getContentType(content: BookContent[], contentTypeId: number): BookContent {
    return find(content, contentData => {
      if (!isUndefined(contentData)) {
        return contentData.contentTypeId == contentTypeId;
      }
    });
  }

  static getContentsType(content: BookContent[], contentTypeId: number): BookContent[] {
    return filter(content, contentData => {
      return contentData.contentTypeId == contentTypeId;
    });
  }

  static getContentTitle(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_TITLE);
  }

  static getContentDialog(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_DIALOG);
  }

  static getContentDialogLineVideo(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_VIDEO);
  }

  static getContentDialogLines(content: BookContent[]): BookContent[] {
    return BookContent.getContentsType(content, BookContent.TYPE_VIDEO_LINE);
  }

  static getContentCharacter(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_CHARACTER);
  }

  static getContentDisplayName(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_DISPLAYNAME);
  }

  static getContentDescription(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_DESCRIPTION);
  }

  static getContentInstruction(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_INSTRUCTION);
  }

  static getContentQuestion(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_QUESTION);
  }

  static getContentHtml(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_HTML_TEXT);
  }

  static getContentAssetThumbnail(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_IMAGE);
  }

  static getContentMoreInfo(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_MORE_INFO_CONTENT);
  }

  static getContentText(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_TEXT);
  }

  static getContentHint(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_EXAMPLE_ANSWER);
  }

  static getContentAudio(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_AUDIO);
  }

  static getContentImage(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_IMAGE);
  }

  static getContentVideo(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_VIDEO);
  }

  static getContentContainer(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_TILE_CONTAINER);
  }

  static getContentClickableWords(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_CLICKABLE_WORDS);
  }

  static getContentWord(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_WORD);
  }

  static getContentWords(content: BookContent[]): BookContent[] {
    let words = filter(content, contentData => {
      return contentData.contentTypeId == BookContent.TYPE_WORD;
    });

    return words.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1);
  }

  static getContentCustomWordDefinition(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_CUSTOM_WORD_DEFINITION);
  }

  static getContentWordCardForm(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_WORD_CARD_FORM);
  }

  static getContentTypeEmail(content: BookContent[]): string {
    let contentData = BookContent.getContentHtml(content);

    if (isUndefined(contentData)) {
      return undefined;
    }

    return contentData.enText;
  }

  static getDialogLines(contents: BookContent[]): BookContent[] {
    let contentDialog = BookContent.getContentDialog(contents);

    if (isUndefined(contentDialog)) {
      return undefined;
    }

    let contentLines = BookContent.getContentDialogLines(contentDialog.children);

    if (isUndefined(contentLines)) {
      return undefined;
    }

    return contentLines;
  }

  static getEnText(contents: BookContent[]): string {
    if (!contents) {
      return undefined;
    }

    let contentData = BookContent.getContentText(contents);

    if (isUndefined(contentData)) {
      return undefined;
    }

    return contentData.enText;
  }

  static getJaText(contents: BookContent[]): string {
    if (!contents) {
      return undefined;
    }

    let contentData = BookContent.getContentText(contents);

    if (isUndefined(contentData)) {
      return undefined;
    }

    return contentData.jaText;
  }

  static getContentTypeInfo(content: BookContent[]): string {
    if (!content) {
      return undefined;
    }

    let contentData = BookContent.getContentMoreInfo(content);

    if (!contentData) {
      return undefined;
    }

    return contentData.jaText;
  }

  static getContentTypeInstructions(content: BookContent[]): string {
    if (!content) {
      return undefined;
    }

    let contentData = BookContent.getContentInstruction(content);

    if (!contentData) {
      return undefined;
    }

    return contentData.enText;
  }

  static getContentCards(content: BookContent[]): BookContent[] {
    return filter(content, contentData => {
      return contentData.contentTypeId == BookContent.TYPE_CARD;
    });
  }

  static getContentTiles(content: BookContent[]): BookContent[] {
    let contentData = find(content, content => {
      return content.contentTypeId == BookContent.TYPE_TILE_CONTAINER;
    });

    if (!contentData) {
      return undefined;
    }

    return contentData.children;
  }

  static getContentChoicesContainer(contents: BookContent[]): BookContent {
    return find(contents, content => {
      return content.contentTypeId == BookContent.TYPE_CHOICES;
    });
  }

  static getContentChoices(contents: BookContent[]): BookContent[] {
    let contentData = this.getContentChoicesContainer(contents);

    if (!contentData) {
      return undefined;
    }

    return contentData.children;
  }

  static addEnText(content: BookContent[], contentTypeId: number, input: string): BookContent[] {
    if (isUndefined(input)) {
      return content;
    }

    content.push({
      contentTypeId: contentTypeId,
      enText: input
    });

    return content;
  }

  static addContentInstruction(content: BookContent[], input: string): BookContent[] {
    return BookContent.addEnText(content, BookContent.TYPE_INSTRUCTION, input);
  }

  static addContentDisplayName(content: BookContent[], input: string): BookContent[] {
    return BookContent.addEnText(content, BookContent.TYPE_DISPLAYNAME, input);
  }

  static addContentExampleAnswer(content: BookContent[], input: string): BookContent[] {
    return BookContent.addEnText(content, BookContent.TYPE_EXAMPLE_ANSWER, input);
  }

  static addContentAudio(content: BookContent[], input: string): BookContent[] {
    if (isUndefined(input)) {
      return content;
    }

    content.push({
      contentTypeId: BookContent.TYPE_AUDIO,
      assets: [{
        assetTypeId: BookAsset.TYPE_AUDIO,
        assetUrl: input
      }]
    });

    return content;
  }

  static addContentTiles(content: BookContent[], input: BookContent[]): BookContent[] {
    if (isUndefined(input)) {
      return content;
    }

    content.push({
      contentTypeId: BookContent.TYPE_TILE_CONTAINER,
      children: input
    });

    return content;
  }

  static createContentDialog(dialog) {
    return {
      contentTypeId: BookContent.TYPE_DIALOG,
      ecDialogId: dialog.dialogID,
      children: [
        {
          contentTypeId: BookContent.TYPE_TITLE,
          enText: dialog.title,
          defaultLocaleId: 2
        },
        {
          contentTypeId: BookContent.TYPE_VIDEO,
          assets: [{
            assetTypeId: BookAsset.TYPE_SMALL_VIDEO,
            assetUrl: dialog.smallVideoURL
          }, {
            assetTypeId: BookAsset.TYPE_MEDIUM_VIDEO,
            assetUrl: dialog.mediumVideoURL
          }, {
            assetTypeId: BookAsset.TYPE_LARGE_VIDEO,
            assetUrl: dialog.largeVideoURL
          }]
        },
        {
          contentTypeId: BookContent.TYPE_IMAGE,
          assets: [{
            assetTypeId: BookAsset.TYPE_SMALL_VIDEO_IMAGE,
            assetUrl: dialog.seriesThumbnailURL
          }, {
            assetTypeId: BookAsset.TYPE_MEDIUM_VIDEO_IMAGE,
            assetUrl: dialog.thumbnailURL
          }, {
            assetTypeId: BookAsset.TYPE_LARGE_VIDEO_IMAGE,
            assetUrl: dialog.demoPictureURL
          }]
        },
        {
          contentTypeId: BookContent.TYPE_AUDIO,
          assets: [{
            assetTypeId: BookAsset.TYPE_AUDIO,
            assetUrl: dialog.dialogM4aAudioURL
          }, {
            assetTypeId: BookAsset.TYPE_SLOW_SPEAK_AUDIO,
            assetUrl: dialog.slowSpeakAudioURL
          }]
        }
      ]
    };
  }

  static getContentTypeId(type: string): number {
    let contentType = find(BookContent.types, contentType => {
      return contentType.type == type;
    });

    return contentType.id;
  }

  static getContentTypeDescription(id: number): string {
    let contentType = find(BookContent.types, contentType => {
      return contentType.id == id;
    });

    if (isUndefined(contentType)) {
      return undefined;
    }

    return contentType.description;
  }

  static getContentTypeLetterSpotterContainer(content: BookContent[]): BookContent {
    return BookContent.getContentType(content, BookContent.TYPE_LETTER_SPOTTER_TEXT_CONTAINER);
  }
}

export class ContentLineOptions {
  id: number;
  value: string;

  static readonly LINE_OPTION_0 = 0;
  static readonly LINE_OPTION_1 = 1;
  static readonly LINE_OPTION_2 = 2;
  static readonly LINE_OPTION_3 = 3;

  static readonly contentLineOptions: ContentLineOptions[] = [
    {id: ContentLineOptions.LINE_OPTION_0, value: "(none)"},
    {id: ContentLineOptions.LINE_OPTION_1, value: "Hide Line Indicator Speak"},
    {id: ContentLineOptions.LINE_OPTION_2, value: "Hide Transcript Watch"},
    {id: ContentLineOptions.LINE_OPTION_3, value: "Hide Indicator Watch/Speak"}
  ];

  static getContentLineOptions(): ContentLineOptions[] {
    return ContentLineOptions.contentLineOptions;
  }

  static getContentLineValue(optionId: number): ContentLineOptions {
    return find(ContentLineOptions.getContentLineOptions(), option => {
      return option.id == optionId;
    });
  }
}

export class BookContentChoice {
  contentTypeId: number;
  contentId?: number;
  sequence: number;
  correct?: boolean;
  phrase?: string;
  letter?: string;
  imageUrl?: string;
  enText?: string;
  jaText?: string;
  children?: BookContent[];
  content?: BookContent[];
  text?: string;
}

export class BookContentEmail {
  static formatEmail(to: string, from: string, subject: string, body: string): string {
    if (isUndefined(to) && isUndefined(from) && isUndefined(subject) && isUndefined(body)) {
      return undefined;
    }

    body = "<p>" + body
        .replace(/\n/g, "</p><p>")
        .replace(/<p><\/p>/g, "")
      + "</p>"
    ;

    return "" +
      "<div class='email-info py-4'>" +
      "<p>To: <span class='email-to'>" + to + "</span></p>" +
      "<p>From: <span class='email-from'>" + from + "</span></p>" +
      "<p>Subject: <span class='email-subject'>" + subject + "</span></p>" +
      "</div>" +
      "" +
      "<div class='text-body'>" +
      body +
      "</div>"
      ;
  }
}

export class BookContentWordDefinition {
  wordDefinitionId: number;
  active?: boolean;
  enDefinitionLongForm?: string;
  enDefinitionShortForm?: string;
  jaDefinitionLongForm?: string;
  jaDefinitionShortForm?: string;
}

export class BookContentWordSearch {
  ecWordInstanceIds?: string;
  ecWordRootIds?: string;
  pageSize?: number;
  wordDefinitionIds?: string;
  wordInstanceIds?: string;
  wordRootIds?: string;
}

export class BookContentWord {
  assets?: BookAsset[];
  wordDefinitionId?: number;
  enDefinitionShort?: string;
  wordRootId?: number;
  partOfSpeech?: number;
  partOfSpeechId?: number;
  content?: BookContent;
  contentId?: number;
  displayText?: string;
  children?: BookContentWord[];
  enExample?: string;
  enText?: string;
  wordRootLabel?: string;
  wordInstanceLabel?: string;
  contentTypeId?: number;
  phonemes?: string;
  sequence?: number;
  studiable?: boolean;
  idiom?: boolean;
  wordId?: number;
  word?: BookContentWord;
  wordInstanceId?: number;
  jaDefinitionLong?: string;
  enDefinitionShortForm?: string;
  enDefinitionLongForm?: string;
  jaDefinitionLongForm?: string;
  enDefinitionLong?: string;

  isEditing?: boolean = false;
  isEditingPhoneme?: boolean = false;

  static getContentWord(content: BookContent[]): BookContentWord {
    let contentData = find(content, contentData => {
      if (!isUndefined(contentData)) {
        return contentData.contentTypeId == BookContent.TYPE_WORD;
      }
    });

    if (!contentData) {
      return undefined;
    }

    return contentData.word;
  }
}

export class ContentCharacter {
  contentId: number;
  contentTypeId: number;
  characterId: number;
  name: string;

  static readonly characters: ContentCharacter[] = [
    {contentId: 1526853, characterId: 1, name: "Role Play - Person A", contentTypeId: BookContent.TYPE_CHARACTER},
    {contentId: 1526854, characterId: 2, name: "Role Play - Person B", contentTypeId: BookContent.TYPE_CHARACTER}
  ];

  static getCharacters(): ContentCharacter[] {
    return this.characters;
  }
}
export class DialogLineOptions {
  contentId?: number;
  startCue?: number;
  endCue?: number;
  slowStartCue?: number;
  slowEndCue?: number;
  ecDialogLineId?: number;
  ecTitle?: string;
  pointsMax?: number;
  speakRequired?: boolean;
  sequence?: number;
  hideDialogLine?: boolean;
  hideTranscript?: boolean;
  characterId?: number;
  children?: BookContent[];
}

export class ContentPartOfSpeech {
  partOfSpeechId: number;
  label: string;
  contentId?: number;
}
