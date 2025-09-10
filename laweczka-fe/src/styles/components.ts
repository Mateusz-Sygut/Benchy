import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const componentStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonPrimary: {
    backgroundColor: colors.primary[600],
  },
  buttonDanger: {
    backgroundColor: colors.error,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary[600],
  },
  buttonDisabled: {
    backgroundColor: colors.background.disabled,
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextOutline: {
    color: colors.primary[600],
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
    minHeight: 50,
  },
  inputIconContainer: {
    paddingLeft: 16,
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: 'transparent',
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#fff5f5',
  },
  inputErrorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 16,
  },
  
  
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary[600],
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  
  scrollingHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollingHeaderIconContainer: {
    marginRight: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 6,
  },
  scrollingHeaderTextContainer: {
    flex: 1,
  },
  scrollingHeaderMainText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.85,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scrollingHeaderBenchText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollingHeaderTimeText: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.75,
    marginTop: 2,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  
  starRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starRatingStar: {
    marginHorizontal: 2,
  },
});
