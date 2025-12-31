/**
 * Comment Generator Component - Minimalistic Voice Icon
 * Simple voice icon that opens recording modal and auto-generates comments
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SeverityLevel } from '../types';

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

  const handleVoiceIconPress = () => {
    setShowVoiceModal(true);
    // Auto-start recording when modal opens
    setTimeout(() => {
      startRecording();
    }, 300);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false);
      setVoiceTranscript('Housing shows visible cracks on the outer surface near the mounting flange');
      // Auto-generate comment after recording
      autoGenerateFromVoice('Housing shows visible cracks on the outer surface near the mounting flange');
    }, 2000);
  };

  const autoGenerateFromVoice = (transcript: string) => {
    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      const enhancedComment = `Gearbox housing inspection reveals ${transcript.toLowerCase()}. Visual assessment indicates structural concerns requiring attention. Detailed examination shows surface discontinuities consistent with stress-induced cracking patterns. ${selectedSeverity ? `Severity classification: ${selectedSeverity}.` : ''} Recommended action: Further investigation and monitoring required to assess crack propagation risk.`;

      onCommentGenerated(enhancedComment);
      setIsGenerating(false);
      // Close modal after generation
      setTimeout(() => {
        setShowVoiceModal(false);
        setVoiceTranscript('');
      }, 500);
    }, 1500);
  };

  return (
    <>
      {/* Voice Icon - Minimalistic */}
      <TouchableOpacity
        style={styles.voiceIcon}
        onPress={handleVoiceIconPress}
        activeOpacity={0.7}
      >
        <Text style={styles.voiceIconText}>🎤</Text>
      </TouchableOpacity>

      {/* Voice Input Modal */}
      <Modal
        visible={showVoiceModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          if (!isRecording && !isGenerating) {
            setShowVoiceModal(false);
            setVoiceTranscript('');
          }
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Recording Status */}
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording...</Text>
              </View>
            )}

            {/* Generating Status */}
            {isGenerating && (
              <View style={styles.generatingIndicator}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.generatingText}>Generating comment...</Text>
              </View>
            )}

            {/* Voice Transcript (editable while waiting) */}
            {!isRecording && !isGenerating && voiceTranscript && (
              <View style={styles.transcriptContainer}>
                <TextInput
                  style={styles.transcriptInput}
                  value={voiceTranscript}
                  onChangeText={setVoiceTranscript}
                  multiline
                  placeholder="Your voice transcript..."
                  editable={false}
                />
              </View>
            )}

            {/* Cancel button */}
            {!isRecording && !isGenerating && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowVoiceModal(false);
                  setVoiceTranscript('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  voiceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  voiceIconText: {
    fontSize: 22,
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
    padding: 32,
    width: '100%',
    maxWidth: 400,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginRight: 12,
  },
  recordingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F44336',
  },
  generatingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  generatingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2196F3',
    marginTop: 16,
  },
  transcriptContainer: {
    width: '100%',
    marginBottom: 20,
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
    backgroundColor: '#F5F5F5',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#616161',
  },
});
