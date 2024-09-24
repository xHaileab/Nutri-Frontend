import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const UserProfile = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken'); // Assuming token is stored with this key
    navigation.replace('Auth'); // Use replace to avoid going back to profile after logout
  };

  const handleLoginScreen = () => {
    navigation.navigate('Auth'); // Navigate to Auth screen
  };

  return (
    <View style={styles.container}>
      <Button title="Go to Login Screen" onPress={handleLoginScreen} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfile;
