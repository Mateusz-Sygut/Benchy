import React, { useRef, useState } from 'react';
import {
  View,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { glassmorphismStyles, panelNavigatorStyles } from '../../styles/glassmorphism';
import { colors } from '../../styles/colors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PanelNavigatorProps {
  children: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  bottomPanel?: React.ReactNode;
}

export const PanelNavigator: React.FC<PanelNavigatorProps> = ({
  children,
  leftPanel,
  rightPanel,
  bottomPanel,
}) => {
  const { t } = useTranslation();
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState(false);

  // Animation values
  const leftPanelTranslateX = useRef(new Animated.Value(-screenWidth)).current;
  const rightPanelTranslateX = useRef(new Animated.Value(screenWidth)).current;
  const bottomPanelTranslateY = useRef(new Animated.Value(screenHeight)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  

  const animateLeftPanel = (show: boolean) => {
    // Don't animate if already in the desired state
    if (show === showLeftPanel) {
      return;
    }

    setShowLeftPanel(show);
    
    Animated.parallel([
      Animated.timing(leftPanelTranslateX, {
        toValue: show ? 0 : -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: show ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateRightPanel = (show: boolean) => {
    // Don't animate if already in the desired state
    if (show === showRightPanel) {
      return;
    }

    setShowRightPanel(show);
    
    Animated.parallel([
      Animated.timing(rightPanelTranslateX, {
        toValue: show ? 0 : screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: show ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateBottomPanel = (show: boolean) => {
    // Don't animate if already in the desired state
    if (show === showBottomPanel) {
      return;
    }

    setShowBottomPanel(show);
    
    Animated.parallel([
      Animated.timing(bottomPanelTranslateY, {
        toValue: show ? 0 : screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: show ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeAllPanels = () => {
    setShowLeftPanel(false);
    setShowRightPanel(false);
    setShowBottomPanel(false);
    
    Animated.parallel([
      Animated.timing(leftPanelTranslateX, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rightPanelTranslateX, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bottomPanelTranslateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Main content */}
      <View style={{ flex: 1 }}>
        {children}
      </View>

      {/* Drag handles */}
      <TouchableOpacity 
        style={[panelNavigatorStyles.dragHandle, panelNavigatorStyles.dragHandleLeft]}
        onPress={() => animateLeftPanel(true)}
      >
        <Ionicons name="chevron-back" size={24} color={colors.text.white} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[panelNavigatorStyles.dragHandle, panelNavigatorStyles.dragHandleRight]}
        onPress={() => animateRightPanel(true)}
      >
        <Ionicons name="chevron-forward" size={24} color={colors.text.white} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[panelNavigatorStyles.dragHandle, panelNavigatorStyles.dragHandleBottom]}
        onPress={() => animateBottomPanel(true)}
      >
        <Ionicons name="chevron-up" size={24} color={colors.text.white} />
      </TouchableOpacity>

      {/* Overlay */}
      {(showLeftPanel || showRightPanel || showBottomPanel) && (
        <Animated.View 
          style={[
            panelNavigatorStyles.overlay,
            { opacity: overlayOpacity }
          ]}
        >
          <TouchableOpacity 
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeAllPanels}
          />
        </Animated.View>
      )}

      {/* Left Panel */}
      {leftPanel && showLeftPanel && (
        <Animated.View 
          style={[
            panelNavigatorStyles.sidePanel,
            { 
              left: 0,
              transform: [{ translateX: leftPanelTranslateX }]
            }
          ]}
        >
          <View style={panelNavigatorStyles.leftPanelBackground} />
          <View style={panelNavigatorStyles.panelHeader}>
            <Text style={panelNavigatorStyles.panelTitle}>{t('swipe.achievements')}</Text>
            <TouchableOpacity 
              onPress={() => animateLeftPanel(false)}
              style={{ padding: 10 }}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {leftPanel}
        </Animated.View>
      )}

      {/* Right Panel */}
      {rightPanel && showRightPanel && (
        <Animated.View 
          style={[
            panelNavigatorStyles.sidePanel,
            { 
              right: 0,
              transform: [{ translateX: rightPanelTranslateX }]
            }
          ]}
        >
          <View style={panelNavigatorStyles.rightPanelBackground} />
          <View style={panelNavigatorStyles.panelHeader}>
            <Text style={panelNavigatorStyles.panelTitle}>{t('swipe.addBench')}</Text>
            <TouchableOpacity 
              onPress={() => animateRightPanel(false)}
              style={{ padding: 10 }}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {rightPanel}
        </Animated.View>
      )}

      {/* Bottom Panel */}
      {bottomPanel && showBottomPanel && (
        <Animated.View 
          style={[
            panelNavigatorStyles.bottomPanel,
            { 
              transform: [{ translateY: bottomPanelTranslateY }]
            }
          ]}
        >
          <View style={panelNavigatorStyles.bottomPanelBackground} />
          <View style={panelNavigatorStyles.panelHeader}>
            <Text style={panelNavigatorStyles.panelTitle}>{t('swipe.favorites')}</Text>
            <TouchableOpacity 
              onPress={() => animateBottomPanel(false)}
              style={{ padding: 10 }}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {bottomPanel}
        </Animated.View>
      )}
    </View>
  );
};