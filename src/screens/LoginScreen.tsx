import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CleverTap from 'clevertap-react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

// Define your root stack param list
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: {
    screen: string;
    params: {name: string; email: string; phone: string};
  };
};

// Create navigation prop type
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const formPosition = useRef(new Animated.Value(30)).current;
  const navigation = useNavigation<LoginScreenNavigationProp>();

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

  const handleLogin = async () => {
    if (!name || !email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please fill all details',
        position: 'top',
        topOffset: 60,
      });
      return;
    }

    setIsLoading(true);
    animateButton();

    try {
      await CleverTap.onUserLogin({
        Name: name,
        Identity: email,
        Email: email,
        'Last Login': new Date().toISOString(),
      });

      Toast.show({
        type: 'success',
        text1: `Welcome ${name.split(' ')[0]}!`,
        text2: 'Login successful',
        position: 'top',
        topOffset: 60,
      });

      (navigation as any).navigate('MainTabs', {
        screen: 'Dashboard',
        params: {name, email, phone: ''},
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Please try again',
        position: 'top',
        topOffset: 60,
      });
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
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
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

          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Animated.View style={{transform: [{scale: buttonScale}]}}>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.9}
              disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.secondaryButtonText}>
              Don't have an account?{' '}
              <Text style={styles.registerText}>Register</Text>
            </Text>
          </TouchableOpacity>
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
  secondaryButton: {
    marginTop: 28,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  registerText: {
    color: '#6C5CE7',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default LoginScreen;
