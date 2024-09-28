import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MealPlan = ({ navigation }) => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waitingForPlan, setWaitingForPlan] = useState(true); // Assume waiting by default

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
      
      // If the meal plan exists, format and set the meal plan data
      const formattedData = formatMealPlanData(response.data);
      setMealPlan(formattedData);
      setWaitingForPlan(false); // Meal plan is now available

    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle 404 specifically as "Meal plan not ready yet"
        console.log("Meal plan not ready yet");
        setWaitingForPlan(true); // Show waiting message
      } else {
        // For other errors, show a general error message
        console.error('Error fetching meal plan:', error);
        Alert.alert("Error", "There was an issue fetching your meal plan. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatMealPlanData = (data) => {
    let formattedData = {};

    // Ensure the data contains a 'meals' object with dates as keys
    if (data.meals) {
      Object.keys(data.meals).forEach(date => {
        // Format the date in YYYY-MM-DD format, in case there are timezone issues
        const formattedDate = new Date(date).toISOString().split('T')[0];

        formattedData[formattedDate] = {
          marked: true,
          dotColor: 'blue', // You can change this to any color you'd like
          activeOpacity: 0.5,
          meals: data.meals[date] // Store the meal details for this date
        };
      });
    }

    return formattedData;
  };

  const onDayPress = (day) => {
    const selectedMealPlan = mealPlan && mealPlan[day.dateString];

    if (selectedMealPlan) {
      navigation.navigate('MealDetails', { date: day.dateString, mealPlan: selectedMealPlan.meals });
    } else {
      Alert.alert("No Meal Plan Available", "No meal plan available for this date.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {waitingForPlan ? (
        // Show the waiting message when the meal plan is pending
        <Text>Your answers have been submitted! Please wait while we prepare your meal plan.</Text>
      ) : (
        // Show the calendar when the meal plan is ready
        <Calendar
          onDayPress={onDayPress}
          markedDates={mealPlan}
        />
      )}
    </View>
  );
};

export default MealPlan;
