import { StyleSheet } from 'react-native';
import { colors, shadows } from './colors';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...shadows.medium,
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold' as 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold' as 'bold',
    color: colors.primary[600],
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: colors.text.primary,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  
  marginBottom: {
    marginBottom: 16,
  },
  marginTop: {
    marginTop: 16,
  },
  
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  backgroundPrimary: {
    backgroundColor: colors.background.primary,
  },
  backgroundSecondary: {
    backgroundColor: colors.background.secondary,
  },
  
  authHeaderContainer: {
    backgroundColor: colors.primary[600],
    paddingTop: 40,
    paddingBottom: 8,
  },
  authHeaderStyle: {
    backgroundColor: colors.primary[600],
  },
  authHeaderTitleStyle: {
    fontWeight: 'bold' as const,
  },
  mainHeaderStyle: {
    backgroundColor: colors.primary[800],
  },
  tabHeaderStyle: {
    backgroundColor: colors.primary[800],
  },
  tabHeaderTitleStyle: {
    fontWeight: 'bold' as const,
  },
});
