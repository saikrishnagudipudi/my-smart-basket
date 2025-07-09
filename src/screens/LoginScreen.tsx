import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/type';



type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Products'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '708145780993-s4mce5inocuj3rlk12402v4f8gkuak6g.apps.googleusercontent.com',
    });

    const checkStoredUser = async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        dispatch(setUser(JSON.parse(userString)));
        navigation.replace('Products');
      }
    };
    checkStoredUser();
  }, []);

  const signIn = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      dispatch(setUser(userInfo));
      await AsyncStorage.setItem('user', JSON.stringify(userInfo));
      Toast.show({ type: 'success', text1: 'You have successfully logged in.' });
      navigation.replace('Products');
    } catch (error) {
      console.warn('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/5968/5968732.png' }}
        style={styles.logo}
      />
      <Text style={styles.heading}>Welcome to Smart Mart</Text>
      <Text style={styles.subheading}>Sign in to continue</Text>

      <TouchableOpacity style={styles.googleButton} onPress={signIn}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Icon name="google" size={20} color="#fff" />
            <Text style={styles.googleButtonText}> Sign in with Google</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});
