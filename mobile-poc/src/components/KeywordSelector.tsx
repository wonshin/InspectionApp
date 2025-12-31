/**
 * Keyword Selector Component
 * Displays keywords as selectable chips (max 3 can be selected)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  keywords: string[];
  selectedKeywords: string[];
  onToggle: (keyword: string) => void;
}

export const KeywordSelector: React.FC<Props> = ({
  keywords,
  selectedKeywords,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      {keywords.map((keyword, index) => {
        const isSelected = selectedKeywords.includes(keyword);
        const canSelect = selectedKeywords.length < 3 || isSelected;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.keywordChip,
              isSelected && styles.keywordChipSelected,
              !canSelect && styles.keywordChipDisabled,
            ]}
            onPress={() => onToggle(keyword)}
            activeOpacity={0.7}
            disabled={!canSelect && !isSelected}
          >
            <Text
              style={[
                styles.keywordText,
                isSelected && styles.keywordTextSelected,
                !canSelect && styles.keywordTextDisabled,
              ]}
            >
              {keyword}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  keywordChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#BDBDBD',
    marginRight: 8,
    marginBottom: 8,
  },
  keywordChipSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  keywordChipDisabled: {
    opacity: 0.4,
  },
  keywordText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#616161',
  },
  keywordTextSelected: {
    color: '#FFFFFF',
  },
  keywordTextDisabled: {
    color: '#BDBDBD',
  },
});
