/**
 * Main App Component - Gearbox Inspection Checklist PoC
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChecklistItem } from './components/ChecklistItem';
import { MOCK_CHECKLIST } from './data/mockData';

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GEARBOX</Text>
        <Text style={styles.headerSubtitle}>Inspection Checklist</Text>
      </View>

      {/* Tab Navigation (Mock) */}
      <View style={styles.tabContainer}>
        <View style={styles.tab}>
          <Text style={styles.tabText}>GENERATOR</Text>
        </View>
        <View style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>GEARBOX</Text>
        </View>
        <View style={styles.tab}>
          <Text style={styles.tabText}>MAIN BEARING</Text>
        </View>
      </View>

      {/* Checklist Items */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {MOCK_CHECKLIST.map((item) => (
          <ChecklistItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BBDEFB',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#5D6D7E',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 3,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: '#212121',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 12,
    paddingBottom: 24,
  },
});

export default App;
