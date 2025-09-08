import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { componentStyles } from '../../styles/components';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

interface SearchResult {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
}

const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useTranslation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert(t('common.error'), t('search.enterLocation'));
      return;
    }

    setIsSearching(true);
    
    try {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          name: 'Central Park Bench',
          description: 'Comfortable bench in the shade',
          latitude: 52.2297,
          longitude: 21.0122,
        },
        {
          id: '2',
          name: 'Riverside Bench',
          description: 'Beautiful view of the river',
          latitude: 52.2300,
          longitude: 21.0130,
        },
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      Alert.alert(t('common.error'), t('search.error'));
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultPress = (result: SearchResult) => {
    onSearch(`${result.name}, ${result.latitude}, ${result.longitude}`);
    onClose();
  };

  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={componentStyles.searchModalResultItem}
      onPress={() => handleResultPress(item)}
    >
      <View style={componentStyles.searchModalResultIcon}>
        <Ionicons name="location" size={20} color="#22c55e" />
      </View>
      <View style={componentStyles.searchModalResultContent}>
        <Text style={componentStyles.searchModalResultTitle}>{item.name}</Text>
        {item.description && (
          <Text style={componentStyles.searchModalResultDescription}>{item.description}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={componentStyles.searchModalContainer}>
        {/* Header */}
        <View style={componentStyles.searchModalHeader}>
          <TouchableOpacity onPress={onClose} style={componentStyles.searchModalCloseButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={componentStyles.searchModalHeaderTitle}>{t('search.title')}</Text>
          <View style={componentStyles.searchModalPlaceholder} />
        </View>

        {/* Search Input */}
        <View style={componentStyles.searchModalSearchContainer}>
          <View style={componentStyles.searchModalSearchInputContainer}>
            <Ionicons name="search" size={20} color="#666" style={componentStyles.searchModalSearchIcon} />
            <TextInput
              style={componentStyles.searchModalSearchInput}
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={componentStyles.searchModalClearButton}
              >
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={componentStyles.searchModalSearchButton}
            onPress={handleSearch}
            disabled={isSearching}
          >
            <Text style={componentStyles.searchModalSearchButtonText}>
              {isSearching ? t('search.searching') : t('search.search')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          style={componentStyles.searchModalResultsList}
          ListEmptyComponent={
            searchQuery.length > 0 && !isSearching ? (
              <View style={componentStyles.searchModalEmptyContainer}>
                <Ionicons name="search-outline" size={48} color="#ccc" />
                <Text style={componentStyles.searchModalEmptyText}>{t('search.noResults')}</Text>
              </View>
            ) : null
          }
        />
      </View>
    </Modal>
  );
};


export default SearchModal;
