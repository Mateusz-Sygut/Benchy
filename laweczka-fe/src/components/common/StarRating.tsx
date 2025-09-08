import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { componentStyles } from '../../styles/components';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  showHalfStars?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 24,
  onRatingChange,
  readonly = false,
  showHalfStars = false,
}) => {
  const handleStarPress = (starNumber: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starNumber);
    }
  };

  const renderStar = (starNumber: number) => {
    const isFilled = starNumber <= rating;
    const isHalfFilled = showHalfStars && starNumber - 0.5 <= rating && starNumber > rating;
    
    let iconName: keyof typeof Ionicons.glyphMap;
    if (isFilled) {
      iconName = 'star';
    } else if (isHalfFilled) {
      iconName = 'star-half';
    } else {
      iconName = 'star-outline';
    }

    const StarComponent = readonly ? View : TouchableOpacity;

    return (
      <StarComponent
        key={starNumber}
        onPress={() => handleStarPress(starNumber)}
        style={componentStyles.starRatingStar}
        disabled={readonly}
      >
        <Ionicons
          name={iconName}
          size={size}
          color="#ffd700"
        />
      </StarComponent>
    );
  };

  return (
    <View style={componentStyles.starRatingContainer}>
      {Array.from({ length: maxRating }, (_, index) => renderStar(index + 1))}
    </View>
  );
};
