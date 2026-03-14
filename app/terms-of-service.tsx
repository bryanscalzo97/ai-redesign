import { useAccentColor } from '@/hooks/useAccentColor';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function TermsOfServiceScreen() {
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior='automatic'
    >
      <View style={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using AI Redesign ("the Service"), you accept and
            agree to be bound by the terms and provision of this agreement. If
            you do not agree to abide by the above, please do not use this
            service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            AI Redesign is a room redesign application that uses artificial
            intelligence to generate redesigned versions of your rooms. The
            service includes:
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} AI-powered room redesign technology
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Multiple design styles and room types
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Photo capture and upload functionality
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Image saving and sharing capabilities
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
          <Text style={styles.paragraph}>
            When using our service, you agree to:
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Provide accurate information when creating an account
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Use the service only for lawful purposes
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Not upload inappropriate or offensive content
          </Text>
          <Text style={styles.bulletPoint}>
            {'\u2022'} Respect intellectual property rights
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. AI Processing</Text>
          <Text style={styles.paragraph}>
            Our service utilizes Google Gemini AI technology. By using our
            service, you acknowledge that your images may be processed by Google
            AI services. AI-generated redesigns are simulations and may not be
            perfectly accurate.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            5. Content and Intellectual Property
          </Text>
          <Text style={styles.paragraph}>
            You retain ownership of photos you upload. You grant us permission
            to process your images for room redesign. Generated previews are for
            personal use only.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            The service is provided "as is" without warranties of any kind. We
            do not guarantee the accuracy of redesigns. Actual renovation
            results may vary significantly from AI-generated previews. We
            recommend consulting with professional interior designers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the fullest extent permitted by law, we are not liable for any
            indirect, incidental, or consequential damages. Our total liability
            shall not exceed the amount paid for the service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these terms at any time. Users will
            be notified of significant changes, and continued use of the service
            constitutes acceptance of modified terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms of Service, please
            contact us at:
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
