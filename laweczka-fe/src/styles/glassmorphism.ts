import { StyleSheet, Dimensions } from 'react-native';
import { colors } from './colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const glassmorphismStyles = StyleSheet.create({
  // Base glassmorphism container
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Dark glassmorphism variant
  glassContainerDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },

  // Glassmorphism card
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: colors.text.secondary,
    fontSize: 14,
  },

  // Glassmorphism button
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // Glassmorphism input
  glassInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
  },

  // Glassmorphism modal
  glassModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },

  // Glassmorphism header
  glassHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  // Glassmorphism navigation
  glassNavigation: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  // Glassmorphism overlay
  glassOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Glassmorphism sidebar
  glassSidebar: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Glassmorphism rarity colors
  rarityCommon: {
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    borderColor: 'rgba(128, 128, 128, 0.5)',
  },
  rarityNormal: {
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
    borderColor: 'rgba(0, 255, 0, 0.5)',
  },
  rarityRare: {
    backgroundColor: 'rgba(0, 128, 255, 0.3)',
    borderColor: 'rgba(0, 128, 255, 0.5)',
  },
  rarityUnique: {
    backgroundColor: 'rgba(255, 128, 0, 0.3)',
    borderColor: 'rgba(255, 128, 0, 0.5)',
  },
  rarityAnomalous: {
    backgroundColor: 'rgba(255, 0, 128, 0.3)',
    borderColor: 'rgba(255, 0, 128, 0.5)',
  },

  // Edge indicators
  edgeIndicator: {
    position: 'absolute',
    width: 2,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  edgeIndicatorLeft: {
    left: 8,
    top: '50%',
    marginTop: -20,
  },
  edgeIndicatorRight: {
    right: 8,
    top: '50%',
    marginTop: -20,
  },
  edgeIndicatorTop: {
    top: 8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 2,
  },


});

// Helper function to get rarity color
export const getRarityColor = (rarityLevel: number): string => {
  switch (rarityLevel) {
    case 1: return '#808080'; // Common - Gray
    case 2: return '#00FF00'; // Normal - Green
    case 3: return '#0080FF'; // Rare - Blue
    case 4: return '#FF8000'; // Unique - Orange
    case 5: return '#FF0080'; // Anomalous - Pink
    default: return '#808080';
  }
};


// Panel Navigator Styles
export const panelNavigatorStyles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  sidePanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: screenWidth,
    zIndex: 1000,
  },
  leftPanelBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 30, 50, 0.95)',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
  },
  rightPanelBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(50, 30, 30, 0.95)',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1000,
  },
  bottomPanelBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 50, 30, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50, // Dodaj padding dla status bar
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  panelTitle: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
  // Bouncy drag handles
  dragHandle: {
    position: 'absolute',
    backgroundColor: 'rgba(124, 179, 66, 0.65)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(124, 179, 66, 0.65)',
  },
  dragHandleLeft: {
    left: 20,
    top: screenHeight * 0.4,
    width: 60,
    height: 60,
  },
  dragHandleRight: {
    right: 20,
    top: screenHeight * 0.4,
    width: 60,
    height: 60,
  },
  dragHandleBottom: {
    bottom: screenHeight * 0.05,
    left: screenWidth * 0.5 - 30,
    width: 60,
    height: 60,
  },
});

// Panel-specific styles
export const panelStyles = StyleSheet.create({
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.text.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  achievementCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementCardLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementName: {
    color: colors.text.white,
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  achievementBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskText: {
    color: colors.text.white,
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  benchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 179, 66, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124, 179, 66, 0.5)',
  },
  benchName: {
    color: colors.text.white,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
  },
  benchDescription: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: 2,
    lineHeight: 18,
  },
  benchRating: {
    color: colors.text.white,
    fontSize: 14,
    marginLeft: 4,
  },
  benchDistance: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  benchCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  benchCardTitle: {
    fontSize: 24,
    fontWeight: '900',
    flex: 1,
  },
  benchCardChevron: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  benchCardRarityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  benchCardRarityBadge: {
    backgroundColor: 'rgba(124, 179, 66, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  benchCardRarityText: {
    color: colors.primary[400],
    fontSize: 12,
    fontWeight: '500',
  },
  benchCardRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benchCardRatingIcon: {
    fontSize: 14,
    color: colors.warning[500],
  },
  benchCardRatingText: {
    fontSize: 12,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateText: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  // NearbyBenchesPanel specific styles
  nearbyBenchesContainer: {
    flex: 1,
  },
  nearbyBenchesScrollView: {
    flex: 1,
  },
  nearbyBenchesContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
});
