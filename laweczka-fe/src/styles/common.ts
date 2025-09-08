import { StyleSheet } from 'react-native';
import { colors } from './colors';

// Common styles used across multiple components
export const commonStyles = StyleSheet.create({
  // Layout
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
  
  // Cards
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Typography
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[900],
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
  
  // Spacing
  marginBottom: {
    marginBottom: 16,
  },
  marginTop: {
    marginTop: 16,
  },
  
  // Flex
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
  
  // Background
  backgroundPrimary: {
    backgroundColor: colors.background.primary,
  },
  backgroundSecondary: {
    backgroundColor: colors.background.secondary,
  },
});
