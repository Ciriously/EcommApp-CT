import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import clevertap from 'clevertap-react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Profile: {email?: string};
  MainTabs: undefined;
};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

const ProfileScreen = ({route}: {route: ProfileScreenRouteProp}) => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const initialEmail = route.params?.email || '';

  // User profile state
  const [profile, setProfile] = useState({
    Email: initialEmail,
    Name: '',
    Phone: '',
    Gender: '',
    DOB: '',
  });

  // Communication preferences
  const [commsPrefs, setCommsPrefs] = useState({
    MSG_email: true,
    MSG_push: true,
    MSG_sms: false,
    MSG_whatsapp: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const props = {
        Name: profile.Name,
        Email: profile.Email,
        Phone: profile.Phone,
        Gender: profile.Gender,
        DOB: profile.DOB ? new Date(profile.DOB) : null,
        'MSG-email': commsPrefs.MSG_email,
        'MSG-push': commsPrefs.MSG_push,
        'MSG-sms': commsPrefs.MSG_sms,
        'MSG-whatsapp': commsPrefs.MSG_whatsapp,
      };

      Object.keys(props).forEach(key => {
        if (
          props[key as keyof typeof props] === null ||
          props[key as keyof typeof props] === ''
        ) {
          delete props[key as keyof typeof props];
        }
      });

      await clevertap.profileSet(props);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Profile update failed:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clevertap.recordEvent('User Logged Out', {});
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Profile Settings</Text>
          <Text style={styles.subtitle}>Update your information</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>EMAIL</Text>
          <View style={styles.lockedInput}>
            <Text style={styles.lockedText}>{profile.Email}</Text>
          </View>

          <Text style={styles.inputLabel}>FULL NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            value={profile.Name}
            onChangeText={text => setProfile({...profile, Name: text})}
          />

          <Text style={styles.inputLabel}>PHONE NUMBER</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter with country code"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={profile.Phone}
            onChangeText={text => setProfile({...profile, Phone: text})}
          />

          <Text style={styles.inputLabel}>GENDER (M/F)</Text>
          <TextInput
            style={styles.input}
            placeholder="M or F"
            placeholderTextColor="#999"
            value={profile.Gender}
            onChangeText={text =>
              setProfile({...profile, Gender: text.toUpperCase()})
            }
            maxLength={1}
          />

          <Text style={styles.inputLabel}>DATE OF BIRTH (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            placeholder="1990-01-01"
            placeholderTextColor="#999"
            value={profile.DOB}
            onChangeText={text => setProfile({...profile, DOB: text})}
          />

          <Text style={styles.sectionTitle}>COMMUNICATION PREFERENCES</Text>

          <View style={styles.prefItem}>
            <Text style={styles.prefText}>Email Notifications</Text>
            <Switch
              value={commsPrefs.MSG_email}
              onValueChange={value =>
                setCommsPrefs({...commsPrefs, MSG_email: value})
              }
              trackColor={{false: '#E0E0E0', true: '#4CAF50'}}
              thumbColor={'#fff'}
            />
          </View>

          <View style={styles.prefItem}>
            <Text style={styles.prefText}>Push Notifications</Text>
            <Switch
              value={commsPrefs.MSG_push}
              onValueChange={value =>
                setCommsPrefs({...commsPrefs, MSG_push: value})
              }
              trackColor={{false: '#E0E0E0', true: '#4CAF50'}}
              thumbColor={'#fff'}
            />
          </View>

          <View style={styles.prefItem}>
            <Text style={styles.prefText}>SMS Notifications</Text>
            <Switch
              value={commsPrefs.MSG_sms}
              onValueChange={value =>
                setCommsPrefs({...commsPrefs, MSG_sms: value})
              }
              trackColor={{false: '#E0E0E0', true: '#4CAF50'}}
              thumbColor={'#fff'}
            />
          </View>

          <View style={styles.prefItem}>
            <Text style={styles.prefText}>WhatsApp Notifications</Text>
            <Switch
              value={commsPrefs.MSG_whatsapp}
              onValueChange={value =>
                setCommsPrefs({...commsPrefs, MSG_whatsapp: value})
              }
              trackColor={{false: '#E0E0E0', true: '#4CAF50'}}
              thumbColor={'#fff'}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'SAVING...' : 'SAVE PROFILE'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleLogout}>
            <Text style={styles.secondaryButtonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#333333', // Dark text
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666666', // Medium gray text
    letterSpacing: 0.3,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#666666', // Medium gray text
    marginBottom: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    height: 56,
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#333333', // Dark text
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light border
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedInput: {
    height: 56,
    backgroundColor: '#F5F5F5', // Light gray background
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light border
  },
  lockedText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#666666', // Medium gray text
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#666666', // Medium gray text
    marginTop: 16,
    marginBottom: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  prefItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE', // Very light border
  },
  prefText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333333', // Dark text
  },
  button: {
    backgroundColor: '#4CAF50', // Green button
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#F44336', // Red border
  },
  secondaryButtonText: {
    color: '#F44336', // Red text
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
});

export default ProfileScreen;
