/**
 * Expandable Checklist Item Component
 * Shows item title, status, and expands to show keywords and severity selection
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { ChecklistItem as ChecklistItemType, SeverityLevel, SEVERITY_COLORS } from '../types';
import { KeywordSelector } from './KeywordSelector';
import { SeverityPicker } from './SeverityPicker';
import { CommentGenerator } from './CommentGenerator';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  item: ChecklistItemType;
  onUpdate?: (itemId: string, keywords: string[], severity: SeverityLevel | null) => void;
}

export const ChecklistItem: React.FC<Props> = ({ item, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | null>(null);
  const [generatedComment, setGeneratedComment] = useState<string>('');

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleKeywordToggle = (keyword: string) => {
    let newKeywords: string[];
    if (selectedKeywords.includes(keyword)) {
      newKeywords = selectedKeywords.filter(k => k !== keyword);
    } else {
      if (selectedKeywords.length >= 3) {
        // Max 3 keywords
        return;
      }
      newKeywords = [...selectedKeywords, keyword];
    }
    setSelectedKeywords(newKeywords);
    onUpdate?.(item.id, newKeywords, selectedSeverity);
  };

  const handleSeveritySelect = (severity: SeverityLevel) => {
    setSelectedSeverity(severity);
    onUpdate?.(item.id, selectedKeywords, severity);
  };

  const handleCommentGenerated = (comment: string) => {
    setGeneratedComment(comment);
  };

  return (
    <View style={styles.container}>
      {/* Main Item Row */}
      <TouchableOpacity
        style={[
          styles.itemRow,
          isExpanded && styles.itemRowExpanded,
        ]}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.itemTitle}>{item.title}</Text>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          {item.isCompleted && !item.hasIssue && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
          {item.hasIssue && (
            <View style={styles.issueIndicator}>
              <Text style={styles.issueText}>!</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Inspection Point Label */}
          <Text style={styles.sectionLabel}>Inspection Point</Text>
          <Text style={styles.inspectionPoint}>
            Check {item.title.toLowerCase()} for defects, wear, or damage
          </Text>

          {/* Keywords Section */}
          <Text style={styles.sectionLabel}>Select Keywords (max 3)</Text>
          <KeywordSelector
            keywords={item.keywords}
            selectedKeywords={selectedKeywords}
            onToggle={handleKeywordToggle}
          />

          {/* Severity Section */}
          <Text style={styles.sectionLabel}>Severity Level</Text>
          <SeverityPicker
            severityLevels={item.severityLevels}
            selectedSeverity={selectedSeverity}
            onSelect={handleSeveritySelect}
          />

          {/* Comment Generation Section */}
          <CommentGenerator
            itemTitle={item.title}
            selectedKeywords={selectedKeywords}
            selectedSeverity={selectedSeverity}
            onCommentGenerated={handleCommentGenerated}
          />

          {/* Generated Comment Display */}
          {generatedComment && (
            <View style={styles.commentContainer}>
              <Text style={styles.commentLabel}>Generated Comment:</Text>
              <Text style={styles.commentText}>{generatedComment}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  itemRowExpanded: {
    backgroundColor: '#E3F2FD',
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  statusContainer: {
    marginLeft: 12,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 20,
    color: '#757575',
  },
  issueIndicator: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
  },
  expandedContent: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#616161',
    marginTop: 16,
    marginBottom: 8,
  },
  inspectionPoint: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  commentContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  commentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
});
