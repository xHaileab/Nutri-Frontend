import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Questions = ({ navigation }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentGoal, setCurrentGoal] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentGoal) {
            fetchQuestions(currentGoal);
        }
    }, [currentGoal]);

    const fetchQuestions = async (goal) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://10.0.2.2:3000/questions/${goal}`);
            setQuestions(response.data);
            // Initialize answers based on the question type
            setAnswers(response.data.reduce((acc, question) => ({
                ...acc,
                [question._id]: question.type === 'multiple-choice' ? '' : ''
            }), {}));
            setCurrentQuestionIndex(0);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch questions");
        }
        setLoading(false);
    };

    const handleAnswerChange = (text, questionId) => {
        setAnswers({ ...answers, [questionId]: text });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmitAnswers();
        }
    };

    const handleSubmitAnswers = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        if (!userId || !token) {
            Alert.alert("Error", "Authentication required.");
            return;
        }
    
        const answersData = {
            userId,
            goal: currentGoal,
            answers: Object.keys(answers)
              .filter(questionId => answers[questionId] !== '')  // Filter out unanswered questions
              .map(questionId => ({
                questionId,
                answer: answers[questionId]
            }))
        };
    
        console.log("Submitting answers for User ID:", userId); // Debugging
    
        try {
            const response = await axios.post('http://10.0.2.2:3000/api/answers/submit', answersData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Submission response:", response.data); // Debugging
            Alert.alert("Success", "Answers submitted successfully");
            navigation.navigate('MealPlan'); // Adjust as needed
        } catch (error) {
            console.error("Error during submission:", error.response ? error.response.data : error.message); // More detailed error
            Alert.alert("Error", "Failed to submit answers");
        }
    };
    

    const handleGoalSelect = (goal) => {
        setCurrentGoal(goal);
    };

    if (!currentGoal) {
        return (
            <View style={styles.container}>
                <Button title="Weight Loss" onPress={() => handleGoalSelect('weight_loss')} />
                <Button title="Weight Gain" onPress={() => handleGoalSelect('weight_gain')} />
                <Button title="Maintenance" onPress={() => handleGoalSelect('maintenance')} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {questions.length > 0 ? (
                <>
                    <Text style={styles.questionText}>{questions[currentQuestionIndex].questionText}</Text>
                    {questions[currentQuestionIndex].type === 'multiple-choice' ? (
                        questions[currentQuestionIndex].options.map(option => (
                            <TouchableOpacity
                                key={option._id}
                                style={styles.optionButton}
                                onPress={() => handleAnswerChange(option.value, questions[currentQuestionIndex]._id)}
                            >
                                <Text style={styles.optionText}>{option.text}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleAnswerChange(text, questions[currentQuestionIndex]._id)}
                            value={answers[questions[currentQuestionIndex]._id]}
                            placeholder="Your answer"
                        />
                    )}
                    <Button title="Next" onPress={handleNextQuestion} />
                </>
            ) : (
                <Text>No questions available for the selected goal.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    questionText: {
        fontSize: 18,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        width: '100%',
    },
    optionButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
    }
});

export default Questions;
