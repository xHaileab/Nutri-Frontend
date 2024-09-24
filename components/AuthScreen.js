import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:3000/api/users/login', {
        phoneNumber,
        password,
      });
      if (response.data.token && response.data.userId) {
        // Save the token and userId to AsyncStorage
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('userId', response.data.userId.toString());
  
        // Properly reset navigation and navigate
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Home', // 'Home' is assumed to be the name of the Tab Navigator
              state: {
                routes: [
                  { name: 'Questions' },
                ],
              },
            },
          ],
        });
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      Alert.alert("Login Error", error.response?.data?.message || "Unable to login");
    }
  };
  

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:3000/api/users/register', {
        name,
        phoneNumber,
        password,
      });
      if (response.data.message) {
        Alert.alert("Registration Successful", "You can now login.");
        setIsLogin(true);  // Switch to login after registration
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      Alert.alert("Registration Error", error.response?.data?.message || "Unable to register");
    }
  };

  return (
    <View style={styles.container}>
      {!isLogin && (
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      )}
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
      />
      <TextInput
        secureTextEntry
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {isLogin ? (
        <>
          <Button title="Login" onPress={handleLogin} />
          <Text onPress={() => setIsLogin(false)} style={styles.switchText}>
            Don't have an account? Register
          </Text>
        </>
      ) : (
        <>
          <Button title="Register" onPress={handleRegister} />
          <Text onPress={() => setIsLogin(true)} style={styles.switchText}>
            Have an account? Login
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
  },
  switchText: {
    marginTop: 10,
    color: 'blue',
    textAlign: 'center',
  },
});

export default AuthScreen;
