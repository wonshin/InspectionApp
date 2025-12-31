/**
 * Comment Generator Component
 * Provides Quick Mode and Voice Mode for generating inspection comments
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SeverityLevel } from '../types';
import { COMMENT_TEMPLATES } from '../data/mockData';

interface Props {
  itemTitle: string;
  selectedKeywords: string[];
  selectedSeverity: SeverityLevel | null;
  onCommentGenerated: (comment: string) => void;
}

export const CommentGenerator: React.FC<Props> = ({
  itemTitle,
  selectedKeywords,
  selectedSeverity,
  onCommentGenerated,
}) => {
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleQuickGenerate = () => {
    if (selectedKeywords.length === 0 || !selectedSeverity) {
      Alert.alert(
        'Missing Selection',
        'Please select at least one keyword and a severity level to generate a comment.',
      );
      return;
    }

    // Simulate comment generation
    const primaryKeyword = selectedKeywords[0];
    const templateKey = `${primaryKeyword}_${selectedSeverity}`;
    let comment = COMMENT_TEMPLATES[templateKey];

    if (!comment) {
      // Generate a basic comment if no template matches
      comment = `${itemTitle} inspection: ${selectedKeywords.join(', ')} observed. Severity: ${selectedSeverity}.`;
    }

    onCommentGenerated(comment);
  };

  const handleVoiceInput = () => {
    setShowVoiceModal(true);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setVoiceTranscript('Housing shows visible cracks on the outer surface near the mounting flange');
    }, 2000);
  };

  const handleConvertToFullComment = () => {
    if (!voiceTranscript) {
      Alert.alert('No Voice Input', 'Please record your observation first.');
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const enhancedComment = `Gearbox housing inspection reveals ${voiceTranscript.toLowerCase()}. Visual assessment indicates structural concerns requiring attention. Detailed examination shows surface discontinuities consistent with stress-induced cracking patterns. ${selectedSeverity ? `Severity classification: ${selectedSeverity}.` : ''} Recommended action: Further investigation and monitoring required to assess crack propagation risk.`;

      onCommentGenerated(enhancedComment);
      setIsGenerating(false);
      setShowVoiceModal(false);
      setVoiceTranscript('');
    }, 1500);
  };

  const canGenerateQuick = selectedKeywords.length > 0 && selectedSeverity !== null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>Generate Comment</Text>

      <View style={styles.buttonRow}>
        {/* Quick Mode Button */}
        <TouchableOpacity
          style={[
            styles.modeButton,
            styles.quickModeButton,
            !canGenerateQuick && styles.buttonDisabled,
          ]}
          onPress={handleQuickGenerate}
          disabled={!canGenerateQuick}
          activeOpacity={0.7}
        >
          <Text style={styles.modeButtonIcon}>⚡</Text>
          <Text style={styles.modeButtonText}>Quick Mode</Text>
        </TouchableOpacity>

        {/* Voice Mode Button */}
        <TouchableOpacity
          style={[styles.modeButton, styles.voiceModeButton]}
          onPress={handleVoiceInput}
          activeOpacity={0.7}
        >
          <Text style={styles.modeButtonIcon}>🎤</Text>
          <Text style={styles.modeButtonText}>Voice Mode</Text>
        </TouchableOpacity>
      </View>

      {/* Voice Input Modal */}
      <Modal
        visible={showVoiceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVoiceModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Voice Input</Text>

            {/* Recording Status */}
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording...</Text>
              </View>
            )}

            {/* Voice Transcript */}
            {!isRecording && voiceTranscript && (
              <View style={styles.transcriptContainer}>
                <Text style={styles.transcriptLabel}>Transcript:</Text>
                <TextInput
                  style={styles.transcriptInput}
                  value={voiceTranscript}
                  onChangeText={setVoiceTranscript}
                  multiline
                  placeholder="Your voice transcript will appear here..."
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              {!voiceTranscript && !isRecording && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.recordButton]}
                  onPress={startRecording}
                >
                  <Text style={styles.modalButtonText}>🎤 Start Recording</Text>
                </TouchableOpacity>
              )}

              {voiceTranscript && !isRecording && (
                <>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.convertButton]}
                    onPress={handleConvertToFullComment}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.modalButtonText}>Convert to Full Comment</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.rerecordButton]}
                    onPress={() => {
                      setVoiceTranscript('');
                      startRecording();
                    }}
                  >
                    <Text style={styles.modalButtonTextDark}>Re-record</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowVoiceModal(false);
                  setVoiceTranscript('');
                  setIsRecording(false);
                }}
              >
                <Text style={styles.modalButtonTextDark}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickModeButton: {
    backgroundColor: '#2196F3',
  },
  voiceModeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
    opacity: 0.6,
  },
  modeButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F44336',
    marginRight: 8,
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  transcriptContainer: {
    marginBottom: 20,
  },
  transcriptLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 8,
  },
  transcriptInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#212121',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    backgroundColor: '#4CAF50',
  },
  convertButton: {
    backgroundColor: '#2196F3',
  },
  rerecordButton: {
    backgroundColor: '#EEEEEE',
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalButtonTextDark: {
    fontSize: 16,
    fontWeight: '600',
    color: '#616161',
  },
});
