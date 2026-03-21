import { useAccentColor } from '@/hooks/useAccentColor';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function PrivacyPolicyScreen() {
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            When you use AI Redesign, we may collect the following information:
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Photos you upload for room redesign
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Device information and usage analytics
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Account information if you create an account
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Preferences and settings
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            2. How We Use Your Information
          </Text>
          <Text style={styles.paragraph}>We use your information to:</Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Provide AI-powered room redesign services
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Improve our app functionality and user experience
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Process and analyze uploaded images for room redesign
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Send important updates about our services
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            3. AI Processing and Third-Party Services
          </Text>
          <Text style={styles.paragraph}>
            Our service uses Google Gemini AI to process your images and create
            room redesigns. Your images may be processed by Google AI services
            in accordance with Google privacy policies. AI processing occurs on
            secure servers with encryption.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            4. Image Processing and Storage
          </Text>
          <Text style={styles.paragraph}>
            Your uploaded photos are processed using AI technology to create
            room redesigns. We take your privacy seriously:
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Images are processed securely and encrypted
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} We do not share your personal photos with unauthorized
            third parties
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} You can delete your images at any time
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your
            information, including end-to-end encryption for image uploads,
            secure servers with regular security updates, and access controls.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.paragraph}>You have the right to:</Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Access your personal information
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Correct or update your information
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Delete your account and associated data
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Opt-out of communications
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </Text>
          <Text style={styles.contactInfo}>Email: </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: width > 768 ? 36 : 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 24,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 24,
    marginBottom: 4,
    marginLeft: 16,
  },
  contactInfo: {
    fontSize: 16,
    color: '#007AFF',
    lineHeight: 24,
  },
});
