import { Ionicons } from '@expo/vector-icons';

export type MessageWordCategory =
  | 'creatures'
  | 'objects'
  | 'items'
  | 'actions'
  | 'geography'
  | 'directions'
  | 'body'
  | 'landscape'
  | 'times'
  | 'concepts'
  | 'phrases';

export type MessageTemplateId =
  | 'bare'
  | 'bang'
  | 'ask'
  | 'ahead'
  | 'missing'
  | 'useful'
  | 'beware'
  | 'try'
  | 'isIt'
  | 'ifOnly'
  | 'iSee'
  | 'timeFor'
  | 'ohIts'
  | 'ah'
  | 'letItBe'
  | 'admire'
  | 'praise';

export type MessageGestureId = 'wave' | 'sit' | 'point' | 'shrug' | 'cheer' | 'quiet';

export const MESSAGE_TEMPLATES: MessageTemplateId[] = [
  'bare',
  'bang',
  'ask',
  'ahead',
  'missing',
  'useful',
  'beware',
  'try',
  'isIt',
  'ifOnly',
  'iSee',
  'timeFor',
  'ohIts',
  'ah',
  'letItBe',
  'admire',
];

export const MESSAGE_WORD_CATEGORIES: MessageWordCategory[] = [
  'creatures',
  'objects',
  'items',
  'actions',
  'geography',
  'directions',
  'body',
  'landscape',
  'times',
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
    'critter',
    'amphibian',
    'insect',
    'pup',
    'game',
    'bear',
    'woman',
    'man',
    'stranger',
    'sigma',
    'loafer',
    'acquaintance',
    'couple',
  ],
  objects: [
    'bench',
    'fountain',
    'bin',
    'sculpture',
    'sign',
    'tracks',
    'stop',
    'building',
    'shrine',
    'office',
    'shop',
    'school',
    'moloch',
    'academy',
  ],
  items: [
    'coffee',
    'water',
    'boar',
    'donut',
    'sandwich',
    'chips',
    'chocolate',
    'backpack',
    'phone',
    'briefcase',
    'book',
    'painting',
    'flower',
    'stick',
    'mushroom',
    'cigarette',
  ],
  actions: [
    'sitDown',
    'eat',
    'drink',
    'lightUp',
    'work',
    'rest',
    'lieDown',
    'avoid',
    'watch',
    'talk',
    'doVerb',
    'hide',
  ],
  geography: [
    'park',
    'forest',
    'shortcut',
    'hiddenPath',
    'river',
    'lake',
    'sea',
    'hill',
    'valley',
    'hole',
    'mountain',
    'grass',
    'tree',
    'rock',
    'thicket',
    'road',
    'edge',
    'mud',
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
  body: [
    'head',
    'neck',
    'stomach',
    'spine',
    'chest',
    'shoulder',
    'finger',
    'leg',
    'butt',
    'ear',
    'eye',
    'nose',
  ],
  landscape: [
    'beautifulView',
    'concreteSprawl',
    'freshAir',
    'sun',
    'moon',
    'stars',
    'shadow',
    'light',
    'rainbow',
    'horizon',
    'rain',
    'storm',
  ],
  times: [
    'time',
    'day',
    'night',
    'dusk',
    'summer',
    'autumn',
    'winter',
    'spring',
    'midnight',
    'noon',
  ],
  concepts: [
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
    'noise',
    'silence',
    'cold',
    'warmth',
    'safety',
    'love',
    'void',
    'despair',
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
    'praiseTheSun',
    'sitWithMe',
    'forThoseAfter',
    'whatARelief',
    'likeADream',
    'breathtaking',
  ],
};

export const MESSAGE_CONJUNCTIONS = [
  'comma',
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
