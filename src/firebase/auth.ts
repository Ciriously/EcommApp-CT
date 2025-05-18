import auth from '@react-native-firebase/auth';

export const registerUser = (email: string, password: string) => {
  return auth().createUserWithEmailAndPassword(email, password);
};

export const loginUser = (email: string, password: string) => {
  return auth().signInWithEmailAndPassword(email, password);
};

export const logoutUser = () => {
  return auth().signOut();
};

export const getCurrentUser = () => {
  return auth().currentUser;
};