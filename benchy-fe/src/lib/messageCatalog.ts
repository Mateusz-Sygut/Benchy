import { Ionicons } from '@expo/vector-icons';

export type MessageWordCategory =
  | 'creatures'
  | 'objects'
  | 'items'
  | 'geography'
  | 'directions'
  | 'body'
  | 'concepts'
  | 'phrases';

export type MessageTemplateId =
  | 'ahead'
  | 'missing'
  | 'useful'
  | 'beware'
  | 'try'
  | 'isIt'
  | 'ifOnly'
  | 'iSee'
  | 'timeFor'
  | 'bare'
  | 'bang'
  | 'ask'
  | 'ohIts'
  | 'praise'
  | 'letItBe'
  | 'ah';

export type MessageGestureId = 'wave' | 'sit' | 'point' | 'shrug' | 'cheer' | 'quiet';

export const MESSAGE_TEMPLATES: MessageTemplateId[] = [
  'ahead',
  'missing',
  'useful',
  'beware',
  'try',
  'isIt',
  'ifOnly',
  'iSee',
  'timeFor',
  'bare',
  'bang',
  'ask',
  'ohIts',
  'praise',
  'letItBe',
  'ah',
];

export const MESSAGE_WORD_CATEGORIES: MessageWordCategory[] = [
  'creatures',
  'objects',
  'items',
  'geography',
  'directions',
  'body',
  'concepts',
  'phrases',
];

export const MESSAGE_WORDS: Record<MessageWordCategory, string[]> = {
  creatures: [
    'fish',
    'rodent',
    'dog',
    'cat',
    'bird',
    'woman',
    'man',
    'child',
    'critter',
    'sigma',
    'insect',
    'loafer',
  ],
  objects: ['bench', 'fountain', 'building', 'shrine'],
  items: ['coffee', 'cigarette', 'water'],
  geography: [
    'park',
    'forest',
    'shortcut',
    'hiddenPath',
    'river',
    'lake',
    'hill',
    'valley',
    'hole',
    'mountain',
    'sun',
    'moon',
    'stars',
    'shadow',
    'light',
  ],
  directions: [
    'front',
    'behind',
    'left',
    'right',
    'above',
    'below',
    'underneath',
    'beyond',
    'between',
  ],
  body: ['head', 'neck', 'stomach', 'spine', 'shoulder', 'finger', 'leg', 'butt'],
  concepts: [
    'concreteSprawl',
    'freshAir',
    'solitude',
    'chance',
    'trouble',
    'hint',
    'secret',
    'visions',
    'fortune',
    'misfortune',
    'life',
    'death',
    'downfall',
    'aura',
  ],
  phrases: [
    'goodLuck',
    'wellDone',
    'itWorked',
    'iFailed',
    'here',
    'notHere',
    'cantBear',
    'dontYouDare',
    'doIt',
  ],
};

export const MESSAGE_CONJUNCTIONS = [
  'then',
  'but',
  'therefore',
  'inShort',
  'or',
  'only',
  'byTheWay',
  'inOtherWords',
  'allTheMore',
  'and',
  'so',
] as const;

export type MessageConjunctionId = (typeof MESSAGE_CONJUNCTIONS)[number];

export const MESSAGE_GESTURES: {
  id: MessageGestureId;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: 'wave', icon: 'hand-left-outline' },
  { id: 'sit', icon: 'cafe-outline' },
  { id: 'point', icon: 'arrow-forward-outline' },
  { id: 'shrug', icon: 'help-outline' },
  { id: 'cheer', icon: 'happy-outline' },
  { id: 'quiet', icon: 'volume-mute-outline' },
];

export type MessageDraft = {
  templateId: MessageTemplateId | null;
  wordId: string | null;
  conjunctionId: MessageConjunctionId | null;
  template2Id: MessageTemplateId | null;
  word2Id: string | null;
  gestureId: MessageGestureId | null;
};

export const EMPTY_MESSAGE_DRAFT: MessageDraft = {
  templateId: null,
  wordId: null,
  conjunctionId: null,
  template2Id: null,
  word2Id: null,
  gestureId: null,
};

export function isWordId(id: string): boolean {
  return Object.values(MESSAGE_WORDS).some((words) => words.includes(id));
}

export function isLineComplete(
  templateId: string | null,
  wordId: string | null
): boolean {
  return Boolean(templateId && wordId && isWordId(wordId));
}

export function isDraftComplete(draft: MessageDraft): boolean {
  if (!isLineComplete(draft.templateId, draft.wordId)) return false;
  if (!draft.conjunctionId) return true;
  return isLineComplete(draft.template2Id, draft.word2Id);
}
