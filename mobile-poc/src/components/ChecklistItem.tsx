/**
 * Expandable Checklist Item Component - Minimalistic Design
 * Auto-generates comments when keywords + severity are selected
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { ChecklistItem as ChecklistItemType, SeverityLevel } from '../types';
import { KeywordSelector } from './KeywordSelector';
import { SeverityPicker } from './SeverityPicker';
import { CommentGenerator } from './CommentGenerator';
import { COMMENT_TEMPLATES } from '../data/mockData';

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

  const generateQuickComment = (keywords: string[], severity: SeverityLevel) => {
    const primaryKeyword = keywords[0];
    const templateKey = `${primaryKeyword}_${severity}`;
    let comment = COMMENT_TEMPLATES[templateKey];

    if (!comment) {
      // Generate a basic comment if no template matches
      comment = `${item.title} inspection: ${keywords.join(', ')} observed. Severity: ${severity}.`;
    }

    setGeneratedComment(comment);
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

    // Auto-generate comment if both keywords and severity are selected
    if (newKeywords.length > 0 && selectedSeverity) {
      generateQuickComment(newKeywords, selectedSeverity);
    } else if (newKeywords.length === 0) {
      // Clear comment if no keywords selected
      setGeneratedComment('');
    }
  };

  const handleSeveritySelect = (severity: SeverityLevel) => {
    setSelectedSeverity(severity);
    onUpdate?.(item.id, selectedKeywords, severity);

    // Auto-generate comment if both keywords and severity are selected
    if (selectedKeywords.length > 0) {
      generateQuickComment(selectedKeywords, severity);
    }
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

      {/* Expanded Content - Minimalistic */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Voice Mode Icon - Top Right */}
          <View style={styles.voiceIconContainer}>
            <CommentGenerator
              itemTitle={item.title}
              selectedKeywords={selectedKeywords}
              selectedSeverity={selectedSeverity}
              onCommentGenerated={handleCommentGenerated}
            />
          </View>

          {/* Keywords - No label */}
          <KeywordSelector
            keywords={item.keywords}
            selectedKeywords={selectedKeywords}
            onToggle={handleKeywordToggle}
          />

          {/* Severity - No label */}
          <SeverityPicker
            severityLevels={item.severityLevels}
            selectedSeverity={selectedSeverity}
            onSelect={handleSeveritySelect}
          />

          {/* Generated Comment - No label */}
          {generatedComment && (
            <View style={styles.commentContainer}>
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
    position: 'relative',
  },
  voiceIconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  commentContainer: {
    marginTop: 16,
    padding: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  commentText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
});
