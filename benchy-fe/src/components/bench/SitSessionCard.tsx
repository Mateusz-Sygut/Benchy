import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../common/Button';
import { SitModelViewer } from './SitModelViewer';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useSitSession } from '../../hooks/useSitSession';
import { formatSitDuration, SIT_RADIUS_M } from '../../lib/sitSession';

type SitSessionCardProps = {
  benchId: string;
  benchName: string;
  latitude: number;
  longitude: number;
};

export const SitSessionCard: React.FC<SitSessionCardProps> = ({
  benchId,
  benchName,
  latitude,
  longitude,
}) => {
  const { t } = useTranslation();
  const { screen: screenStyles } = useThemedStyles();
  const { activeSit, starting, ending, isSittingOn, startSit, endSit } = useSitSession();

  const sittingHere = isSittingOn(benchId);
  const sittingElsewhere = Boolean(activeSit && !sittingHere);

  return (
    <View style={screenStyles.benchDetailsSection}>
      <Text style={screenStyles.benchDetailsSectionTitle}>{t('sit.title')}</Text>
      <Text style={screenStyles.sitHint}>{t('sit.hint', { meters: SIT_RADIUS_M })}</Text>

      {sittingHere && activeSit ? (
        <View style={screenStyles.sitActiveCard}>
          <SitModelViewer size={160} />
          <Text style={screenStyles.sitActiveLabel}>{t('sit.sittingNow')}</Text>
          <Text style={screenStyles.sitTimer}>{formatSitDuration(activeSit.elapsedSeconds)}</Text>
          <Text style={screenStyles.sitBenchName} numberOfLines={1}>
            {activeSit.benchName}
          </Text>
          {!activeSit.withinRange && (
            <Text style={screenStyles.sitWarning}>{t('sit.leavingRange')}</Text>
          )}
          <Button
            title={t('sit.end')}
            variant="outline"
            icon="stop-circle-outline"
            loading={ending}
            onPress={() => endSit('manual')}
            style={{ marginTop: 16 }}
          />
        </View>
      ) : (
        <>
          {sittingElsewhere && (
            <Text style={screenStyles.sitWarning}>
              {t('sit.sittingElsewhere', { name: activeSit?.benchName })}
            </Text>
          )}
          <Button
            title={t('sit.start')}
            icon="cafe-outline"
            loading={starting}
            disabled={sittingElsewhere || ending}
            onPress={() =>
              startSit({
                id: benchId,
                name: benchName || t('bench.unnamedBench'),
                latitude,
                longitude,
              })
            }
          />
        </>
      )}
    </View>
  );
};