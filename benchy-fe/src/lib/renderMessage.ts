import { TFunction } from 'i18next';
import { MESSAGE_GESTURES } from './messageCatalog';

export type StoredBenchMessage = {
  template_id: string;
  word_id: string | null;
  conjunction_id: string | null;
  template2_id: string | null;
  word2_id: string | null;
  gesture_id: string | null;
};

function renderLine(templateId: string, wordId: string | null, t: TFunction): string {
  const word = wordId ? t(`messages.words.${wordId}`) : '';
  return t(`messages.templates.${templateId}`, { word });
}

export function renderBenchMessage(message: StoredBenchMessage, t: TFunction): string {
  const line = renderLine(message.template_id, message.word_id, t);
  if (!message.conjunction_id || !message.template2_id) return line;
  const conj = t(`messages.conjunctions.${message.conjunction_id}`);
  const line2 = renderLine(message.template2_id, message.word2_id, t);
  if (message.conjunction_id === 'comma') return `${line}, ${line2}`;
  return `${line} ${conj} ${line2}`;
}

export function gestureIcon(gestureId: string | null) {
  return MESSAGE_GESTURES.find((gesture) => gesture.id === gestureId)?.icon ?? null;
}
