/**
 * Severity Level Picker Component
 * Displays severity levels with color coding: Normal (Green), Warning (Yellow), Progressed (Orange), Critical (Red)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SeverityLevel, SEVERITY_COLORS } from '../types';

interface Props {
  severityLevels: SeverityLevel[];
  selectedSeverity: SeverityLevel | null;
  onSelect: (severity: SeverityLevel) => void;
}

export const SeverityPicker: React.FC<Props> = ({
  severityLevels,
  selectedSeverity,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {severityLevels.map((severity, index) => {
        const isSelected = selectedSeverity === severity;
        const color = SEVERITY_COLORS[severity];

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.severityButton,
              isSelected && styles.severityButtonSelected,
              isSelected && { borderColor: color },
            ]}
            onPress={() => onSelect(severity)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.colorIndicator,
                { backgroundColor: color },
              ]}
            />
            <Text
              style={[
                styles.severityText,
                isSelected && styles.severityTextSelected,
              ]}
            >
              {severity}
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
  severityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
    minWidth: 100,
  },
  severityButtonSelected: {
    backgroundColor: '#F5F5F5',
    borderWidth: 3,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#616161',
  },
  severityTextSelected: {
    fontWeight: '700',
    color: '#212121',
  },
});
