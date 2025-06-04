import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Modal,
} from 'react-native';
import CleverTap from 'clevertap-react-native';

interface NativeDisplayCardProps {
  visible: boolean;
  onClose: () => void;
  displayUnit: any;
}

export const NativeDisplayCard: React.FC<NativeDisplayCardProps> = ({
  visible,
  onClose,
  displayUnit,
}) => {
  const content = displayUnit?.contents?.[0];

  const handleView = () => {
    if (displayUnit.unit_id) {
      CleverTap.pushDisplayUnitViewedEventForID(displayUnit.unit_id);
      CleverTap.pushDisplayUnitClickedEventForID(displayUnit.unit_id);
    }
    if (content?.action_url) {
      Linking.openURL(content.action_url);
    }
    onClose();
  };

  const handleDismiss = () => {
    // Optionally track custom event if needed
    CleverTap.recordEvent('NativeDisplayDismissed', {
      unitId: displayUnit.unit_id,
      title: content?.title,
    });
    onClose();
  };

  if (!content) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {content.media && (
            <Image source={{uri: content.media}} style={styles.image} />
          )}
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.message}>{content.message}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={handleView}>
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={handleDismiss}>
              <Text style={[styles.buttonText, {color: '#333'}]}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 16,
    color: '#444',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonPrimary: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonSecondary: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
});
