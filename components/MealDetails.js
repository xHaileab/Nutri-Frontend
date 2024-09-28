import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const MealDetails = ({ route }) => {
  const { mealPlan } = route.params; // Assume mealPlan is passed as a navigation parameter

  return (
    <ScrollView style={styles.container}>
      {mealPlan.breakfast ? (
        <View style={styles.mealSection}>
          <Text style={styles.mealHeader}>Breakfast</Text>
          <Text style={styles.mealContent}>{mealPlan.breakfast}</Text>
        </View>
      ) : null}

      {mealPlan.lunch ? (
        <View style={styles.mealSection}>
          <Text style={styles.mealHeader}>Lunch</Text>
          <Text style={styles.mealContent}>{mealPlan.lunch}</Text>
        </View>
      ) : null}

      {mealPlan.dinner ? (
        <View style={styles.mealSection}>
          <Text style={styles.mealHeader}>Dinner</Text>
          <Text style={styles.mealContent}>{mealPlan.dinner}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mealSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  mealHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mealContent: {
    fontSize: 16,
  }
});

export default MealDetails;
