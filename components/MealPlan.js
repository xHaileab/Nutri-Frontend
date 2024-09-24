import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MealPlan = ({ navigation }) => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    checkSubmissionStatus();
  }, []);

  const checkSubmissionStatus = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      Alert.alert("Assessment Required", "Please complete the assessment to receive your meal plan.");
      return;
    }
    fetchMealPlan(userId);
  };

  const fetchMealPlan = async (userId) => {
    try {
      const response = await axios.get(`http://10.0.2.2:3000/api/responses/user/${userId}`);
      if (response.data) {
        const formattedData = formatMealPlanData(response.data);
        setMealPlan(formattedData);
        setHasSubmitted(true);
      } else {
        setHasSubmitted(true);
        Alert.alert("Hang Tight!", "Doctors are working on your custom meal plan.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch meal plan.");
    } finally {
      setLoading(false);
    }
  };

  const formatMealPlanData = (data) => {
    let formattedData = {};
    // Assuming data contains a 'meals' object keyed by dates
    if (data.meals) {
      Object.keys(data.meals).forEach(date => {
        formattedData[date] = { marked: true, dotColor: 'blue', activeOpacity: 0.5 };
      });
    }
    return formattedData;
  };

  const onDayPress = (day) => {
    if (mealPlan && mealPlan[day.dateString]) {
      navigation.navigate('MealDetails', { date: day.dateString, mealPlan: mealPlan[day.dateString] });
    } else {
      Alert.alert("No Meal Plan Available", "No meal plan available for this date.");
    }
  };

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {hasSubmitted ? (
        <Calendar
          onDayPress={onDayPress}
          markedDates={mealPlan}
        />
      ) : (
        <Text>Please complete the assessment to receive your meal plan.</Text>
      )}
    </View>
  );
};

export default MealPlan;
