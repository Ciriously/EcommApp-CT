import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Easing,
} from 'react-native';
import CleverTap from 'clevertap-react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  Register: undefined;
  MainTabs: {
    screen: string;
    params: {name: string; email: string; phone: string};
  };
};

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const formPosition = useRef(new Animated.Value(30)).current;
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // Animation for form entry
  React.useEffect(() => {
    Animated.timing(formPosition, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  }, []);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.96,
        duration: 80,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(1.5),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please fill all details',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password mismatch',
        text2: 'Passwords do not match',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    setIsLoading(true);
    animateButton();

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const userProfile = {
        Name: name,
        Identity: email,
        Email: email,
        Phone: formattedPhone,
        'Account Created': new Date().toISOString(),
      };

      // Send user profile to CleverTap
      await CleverTap.onUserLogin(userProfile);
      await CleverTap.profileSet({Password: password});

      Toast.show({
        type: 'success',
        text1: 'Registration successful!',
        text2: `Welcome ${name.split(' ')[0]}`,
        position: 'top',
        topOffset: 60,
      });

      navigation.navigate('MainTabs', {
        screen: 'Dashboard',
        params: {name, email, phone: formattedPhone},
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: 'Please try again',
        position: 'top',
        topOffset: 60,
      });
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to get started</Text>
        </View>

        <Animated.View
          style={[
            styles.formContainer,
            {transform: [{translateY: formPosition}]},
          ]}>
          <Text style={styles.inputLabel}>FULL NAME</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.inputLabel}>EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>PHONE NUMBER</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter with country code"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Animated.View style={{transform: [{scale: buttonScale}]}}>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              activeOpacity={0.9}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 48,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#8E8E93',
    letterSpacing: 0.3,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#8E8E93',
    marginBottom: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    height: 56,
    backgroundColor: '#1E1E2D',
    borderRadius: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2D2D3A',
  },
  button: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#6C5CE7',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
});

export default RegisterScreen;
