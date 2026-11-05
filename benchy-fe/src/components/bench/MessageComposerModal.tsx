import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../common/Button';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import {
  EMPTY_MESSAGE_DRAFT,
  MESSAGE_CONJUNCTIONS,
  MESSAGE_GESTURES,
  MESSAGE_TEMPLATES,
  MESSAGE_WORD_CATEGORIES,
  MESSAGE_WORDS,
  MessageConjunctionId,
  MessageDraft,
  MessageGestureId,
  MessageTemplateId,
  isDraftComplete,
} from '../../lib/messageCatalog';
import { renderBenchMessage } from '../../lib/renderMessage';

type RowKey = 'template' | 'word' | 'conjunction' | 'template2' | 'word2' | 'gesture';

type MessageComposerModalProps = {
  visible: boolean;
  initialDraft: MessageDraft;
  saving: boolean;
  onClose: () => void;
  onSubmit: (draft: MessageDraft) => void;
};

export const MessageComposerModal = ({
  visible,
  initialDraft,
  saving,
  onClose,
  onSubmit,
}: MessageComposerModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = useThemedStyles();
  const [draft, setDraft] = useState<MessageDraft>(initialDraft);
  const [openRow, setOpenRow] = useState<RowKey | null>('template');

  React.useEffect(() => {
    if (visible) {
      setDraft(initialDraft);
      setOpenRow('template');
    }
    // Snapshot the draft only when the composer opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const preview = useMemo(() => {
    if (!draft.templateId || !draft.wordId) return t('messages.previewEmpty');
    return renderBenchMessage(
      {
        template_id: draft.templateId,
        word_id: draft.wordId,
        conjunction_id: draft.conjunctionId,
        template2_id: draft.template2Id,
        word2_id: draft.word2Id,
        gesture_id: draft.gestureId,
      },
      t
    );
  }, [draft, t]);

  const setTemplate = (id: MessageTemplateId, second: boolean) => {
    setDraft((current) =>
      second ? { ...current, template2Id: id } : { ...current, templateId: id }
    );
  };

  const setWord = (id: string, second: boolean) => {
    setDraft((current) => (second ? { ...current, word2Id: id } : { ...current, wordId: id }));
  };

  const toggle = (row: RowKey) => {
    setOpenRow((current) => (current === row ? null : row));
  };

  const chip = (label: string, selected: boolean, onPress: () => void) => (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: selected ? theme.primary[600] : theme.gray[300],
          backgroundColor: selected ? theme.gradient.light : theme.background.primary,
        },
      ]}
    >
      <Text style={{ color: selected ? theme.primary[700] : theme.text.primary, fontWeight: '600' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const templateChoices = (second: boolean) => (
    <View style={styles.choiceWrap}>
      {MESSAGE_TEMPLATES.map((id) =>
        chip(
          t(`messages.templates.${id}`, { word: '…' }),
          (second ? draft.template2Id : draft.templateId) === id,
          () => setTemplate(id, second)
        )
      )}
    </View>
  );

  const wordChoices = (second: boolean) => (
    <View>
      {MESSAGE_WORD_CATEGORIES.map((category) => (
        <View key={category} style={styles.categoryBlock}>
          <Text style={[styles.categoryTitle, { color: theme.text.secondary }]}>
            {t(`messages.categories.${category}`)}
          </Text>
          <View style={styles.choiceWrap}>
            {MESSAGE_WORDS[category].map((id) =>
              chip(
                t(`messages.words.${id}`),
                (second ? draft.word2Id : draft.wordId) === id,
                () => setWord(id, second)
              )
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const rowValue = (row: RowKey): string => {
    switch (row) {
      case 'template':
        return draft.templateId
          ? t(`messages.templates.${draft.templateId}`, { word: '…' })
          : '—';
      case 'word':
        return draft.wordId ? t(`messages.words.${draft.wordId}`) : '—';
      case 'conjunction':
        return draft.conjunctionId ? t(`messages.conjunctions.${draft.conjunctionId}`) : '—';
      case 'template2':
        return draft.template2Id
          ? t(`messages.templates.${draft.template2Id}`, { word: '…' })
          : '—';
      case 'word2':
        return draft.word2Id ? t(`messages.words.${draft.word2Id}`) : '—';
      case 'gesture':
        return draft.gestureId ? t(`messages.gestures.${draft.gestureId}`) : '—';
      default:
        return '—';
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.screen, { backgroundColor: theme.background.primary, paddingTop: insets.top }]}>
        <Text style={[styles.preview, { color: theme.primary[800] }]}>{preview}</Text>
        <ScrollView contentContainerStyle={styles.scroll}>
          {(['template', 'word', 'conjunction', 'template2', 'word2', 'gesture'] as RowKey[]).map(
            (row) => (
              <View key={row} style={[styles.row, { borderColor: theme.gray[200] }]}>
                <TouchableOpacity onPress={() => toggle(row)} style={styles.rowHeader}>
                  <Text style={[styles.rowLabel, { color: theme.text.secondary }]}>
                    {t(`messages.rows.${row}`)}
                  </Text>
                  <Text style={[styles.rowValue, { color: theme.text.primary }]} numberOfLines={1}>
                    {rowValue(row)}
                  </Text>
                </TouchableOpacity>
                {openRow === row && row === 'template' && templateChoices(false)}
                {openRow === row && row === 'word' && wordChoices(false)}
                {openRow === row && row === 'conjunction' && (
                  <View style={styles.choiceWrap}>
                    {MESSAGE_CONJUNCTIONS.map((id) =>
                      chip(t(`messages.conjunctions.${id}`), draft.conjunctionId === id, () =>
                        setDraft((current) => ({
                          ...current,
                          conjunctionId:
                            current.conjunctionId === id ? null : (id as MessageConjunctionId),
                        }))
                      )
                    )}
                  </View>
                )}
                {openRow === row && row === 'template2' && templateChoices(true)}
                {openRow === row && row === 'word2' && wordChoices(true)}
                {openRow === row && row === 'gesture' && (
                  <View style={styles.choiceWrap}>
                    {MESSAGE_GESTURES.map((gesture) =>
                      chip(
                        t(`messages.gestures.${gesture.id}`),
                        draft.gestureId === gesture.id,
                        () =>
                          setDraft((current) => ({
                            ...current,
                            gestureId:
                              current.gestureId === gesture.id
                                ? null
                                : (gesture.id as MessageGestureId),
                          }))
                      )
                    )}
                  </View>
                )}
                {openRow === row && (row === 'conjunction' || row === 'gesture') && (
                  <TouchableOpacity
                    onPress={() =>
                      setDraft((current) =>
                        row === 'gesture'
                          ? { ...current, gestureId: null }
                          : {
                              ...current,
                              conjunctionId: null,
                              template2Id: null,
                              word2Id: null,
                            }
                      )
                    }
                  >
                    <Text style={{ color: theme.text.secondary, marginTop: 8 }}>{t('messages.clear')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          )}
          {!draft.conjunctionId && (
            <Text style={[styles.hint, { color: theme.text.secondary }]}>{t('messages.line2Hint')}</Text>
          )}
        </ScrollView>
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Button
            title={t('messages.finish')}
            onPress={() => onSubmit(draft)}
            loading={saving}
            disabled={!isDraftComplete(draft) || saving}
          />
          <Button title={t('common.cancel')} variant="outline" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export function draftFromMessage(message: {
  template_id: string;
  word_id: string | null;
  conjunction_id: string | null;
  template2_id: string | null;
  word2_id: string | null;
  gesture_id: string | null;
} | null): MessageDraft {
  if (!message) return EMPTY_MESSAGE_DRAFT;
  return {
    templateId: message.template_id as MessageDraft['templateId'],
    wordId: message.word_id,
    conjunctionId: message.conjunction_id as MessageDraft['conjunctionId'],
    template2Id: message.template2_id as MessageDraft['template2Id'],
    word2Id: message.word2_id,
    gestureId: message.gesture_id as MessageDraft['gestureId'],
  };
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  preview: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  scroll: { paddingHorizontal: 16, paddingBottom: 24 },
  row: {
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  rowHeader: { gap: 4 },
  rowLabel: { fontSize: 13, fontWeight: '600' },
  rowValue: { fontSize: 16 },
  choiceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: { borderWidth: 2, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12 },
  categoryBlock: { marginTop: 12 },
  categoryTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  hint: { marginTop: 12, fontSize: 13 },
  footer: { paddingHorizontal: 16, gap: 8 },
});
