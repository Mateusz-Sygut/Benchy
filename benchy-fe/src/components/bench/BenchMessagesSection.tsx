import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/Button';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import supabase from '../../lib/supabase';
import { SIT_MIN_DURATION_SEC } from '../../lib/sitSession';
import {
  MessageDraft,
  isDraftComplete,
} from '../../lib/messageCatalog';
import { gestureIcon, renderBenchMessage } from '../../lib/renderMessage';
import { Database } from '../../types/database';
import { MessageComposerModal, draftFromMessage } from './MessageComposerModal';

type BenchMessage = Database['public']['Tables']['bench_messages']['Row'];

type BenchMessagesSectionProps = {
  benchId: string;
  userId: string | null;
  onMessagesChanged: () => void;
};

export const BenchMessagesSection = ({
  benchId,
  userId,
  onMessagesChanged,
}: BenchMessagesSectionProps) => {
  const { t } = useTranslation();
  const { screen: screenStyles, theme } = useThemedStyles();
  const [messages, setMessages] = useState<BenchMessage[]>([]);
  const [ownMessage, setOwnMessage] = useState<BenchMessage | null>(null);
  const [praisedIds, setPraisedIds] = useState<Set<string>>(new Set());
  const [canWrite, setCanWrite] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('bench_messages')
      .select('*')
      .eq('bench_id', benchId)
      .order('praise_count', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error loading bench messages:', error);
      return;
    }

    const top = (data ?? []) as BenchMessage[];
    let mine: BenchMessage | null = null;
    if (userId) {
      const { data: own } = await supabase
        .from('bench_messages')
        .select('*')
        .eq('bench_id', benchId)
        .eq('user_id', userId)
        .maybeSingle();
      mine = (own as BenchMessage | null) ?? null;

      const { count } = await supabase
        .from('sit_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('bench_id', benchId)
        .eq('user_id', userId)
        .gte('duration_seconds', SIT_MIN_DURATION_SEC);
      setCanWrite((count ?? 0) > 0);
    } else {
      setCanWrite(false);
    }

    const merged = [...top];
    if (mine && !merged.some((message) => message.id === mine.id)) {
      merged.push(mine);
    }
    setMessages(merged);
    setOwnMessage(mine);

    if (userId && merged.length > 0) {
      const { data: praises } = (await supabase
        .from('bench_message_praises')
        .select('message_id')
        .eq('user_id', userId)
        .in(
          'message_id',
          merged.map((message) => message.id)
        )) as { data: { message_id: string }[] | null };
      setPraisedIds(new Set((praises ?? []).map((row) => row.message_id)));
    } else {
      setPraisedIds(new Set());
    }
  }, [benchId, userId]);

  useEffect(() => {
    load();
  }, [load]);

  const explainLock = () => {
    Alert.alert(t('messages.title'), userId ? t('messages.locked') : t('messages.login'));
  };

  const save = async (draft: MessageDraft) => {
    if (!userId || !isDraftComplete(draft)) return;
    setSaving(true);
    const payload = {
      bench_id: benchId,
      user_id: userId,
      template_id: draft.templateId,
      word_id: draft.wordId,
      conjunction_id: draft.conjunctionId,
      template2_id: draft.conjunctionId ? draft.template2Id : null,
      word2_id: draft.conjunctionId ? draft.word2Id : null,
      gesture_id: draft.gestureId,
    };
    const { error } = await supabase
      .from('bench_messages')
      .upsert(payload as never, { onConflict: 'bench_id,user_id' });
    setSaving(false);
    if (error) {
      console.error('Error saving bench message:', error);
      Alert.alert(t('common.error'), t('messages.saveError'));
      return;
    }
    setComposerOpen(false);
    await load();
    onMessagesChanged();
    Alert.alert(t('common.success'), t('messages.saved'));
  };

  const togglePraise = async (message: BenchMessage) => {
    if (!userId) {
      explainLock();
      return;
    }
    if (message.user_id === userId) return;
    const praised = praisedIds.has(message.id);
    const query = praised
      ? supabase
          .from('bench_message_praises')
          .delete()
          .eq('message_id', message.id)
          .eq('user_id', userId)
      : supabase.from('bench_message_praises').insert({
          message_id: message.id,
          user_id: userId,
        } as never);
    const { error } = await query;
    if (error) {
      console.error('Error praising message:', error);
      Alert.alert(t('common.error'), t('messages.praiseError'));
      return;
    }
    await load();
  };

  return (
    <View style={screenStyles.benchDetailsSection}>
      <Text style={screenStyles.benchDetailsSectionTitle}>{t('messages.title')}</Text>
      {messages.length === 0 ? (
        <Text style={[screenStyles.benchDetailsDescription, { marginBottom: 12 }]}>
          {t('messages.empty')}
          {'\n'}
          {t('messages.example')}
        </Text>
      ) : (
        messages.map((message) => {
          const icon = gestureIcon(message.gesture_id);
          const mine = message.user_id === userId;
          const praised = praisedIds.has(message.id);
          return (
            <View
              key={message.id}
              style={{
                paddingVertical: 10,
                borderTopWidth: 1,
                borderTopColor: theme.gray[200],
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {icon && <Ionicons name={icon} size={18} color={theme.primary[700]} />}
                <Text style={{ flex: 1, color: theme.text.primary, fontSize: 16 }}>
                  {renderBenchMessage(message, t)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => togglePraise(message)}
                disabled={mine}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}
              >
                <Ionicons
                  name={praised ? 'heart' : 'heart-outline'}
                  size={16}
                  color={praised ? theme.error : theme.text.secondary}
                />
                <Text style={{ color: theme.text.secondary }}>
                  {t('messages.praise')} {message.praise_count}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}

      {!canWrite && (
        <Text style={[screenStyles.sitHint, { marginTop: 12 }]}>
          {userId ? t('messages.locked') : t('messages.login')}
        </Text>
      )}
      <View style={screenStyles.benchDetailsSubmitButton}>
        <Button
          title={ownMessage ? t('messages.edit') : t('messages.leave')}
          icon={canWrite ? 'chatbubble-ellipses-outline' : 'lock-closed-outline'}
          variant={canWrite ? 'primary' : 'outline'}
          onPress={() => (canWrite ? setComposerOpen(true) : explainLock())}
        />
      </View>

      <MessageComposerModal
        visible={composerOpen}
        initialDraft={draftFromMessage(ownMessage)}
        saving={saving}
        onClose={() => setComposerOpen(false)}
        onSubmit={save}
      />
    </View>
  );
};
