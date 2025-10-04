"use client";

import { useState, useEffect, useCallback } from "react";
import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import AuthPage from "./auth/page";
import { exerciseDatabase, calculateCalories, getExerciseById } from "../utils/exerciseDatabase";
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface User {
  id: number;
  email: string;
  createdAt: string;
}

interface ProfileData {
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  bodyGoal: "lean_muscle" | "bulk_muscle";
}

interface ExerciseEntry {
  id: string;
  exercise: string;
  exerciseType?: string; // 運動タイプID
  amount: number; // 回数/時間/距離
  unit: string; // 単位
  caloriesBurned: number;
  timestamp: Date;
}

interface Results {
  dailyCalories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface FoodEntry {
  id: string;
  food: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  quantity: number;
  unitCalories: number;
  unitProtein: number;
  unitFat: number;
  unitCarbs: number;
  timestamp: Date;
}

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1rem;
`;

const MainContent = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 2rem;
`;

const FormContainer = styled.form`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const inputStyles = css`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  transition: all 0.15s ease-in-out;

  &:focus {
    outline: 2px solid #3b82f6;
    border-color: #3b82f6;
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const Select = styled.select`
  ${inputStyles}
`;

const Button = styled.button`
  width: 100%;
  margin-top: 1.5rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: 2px solid #3b82f6;
  }
`;

const ResultsContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const ResultsTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ResultCard = styled.div<{ variant: 'calories' | 'protein' }>`
  text-align: center;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: ${props => props.variant === 'calories' ? '#eff6ff' : '#f0fdf4'};
`;

const ResultCardTitle = styled.h3<{ variant: 'calories' | 'protein' }>`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${props => props.variant === 'calories' ? '#1e40af' : '#166534'};
`;

const ResultValue = styled.p<{ variant: 'calories' | 'protein' }>`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${props => props.variant === 'calories' ? '#2563eb' : '#16a34a'};

  span {
    font-size: 1.125rem;
  }
`;

const Notice = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fffbeb;
  border-radius: 0.5rem;

  p {
    font-size: 0.875rem;
    color: #92400e;
  }
`;

const FoodInputForm = styled.form`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
`;

const FoodInputGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

const FoodEntryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
`;

const FoodEntryItem = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-left: 4px solid #3b82f6;
`;

const FoodEntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const FoodName = styled.h4`
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const FoodTime = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const FoodNutrients = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  flex-wrap: wrap;
  align-items: center;
`;

const DeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;


const CircularProgress = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
`;

const CircularProgressSvg = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const CircularProgressBackground = styled.circle`
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 8;
`;

const CircularProgressForeground = styled.circle<{ percentage: number; isOverLimit?: boolean }>`
  fill: none;
  stroke: ${props => props.isOverLimit ? '#ef4444' : '#10b981'};
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: ${props => {
    const circumference = 2 * Math.PI * 50;
    const strokeDasharray = Math.min(props.percentage, 100) * circumference / 100;
    return `${strokeDasharray} ${circumference}`;
  }};
  transition: stroke-dasharray 0.3s ease;
`;

const CircularProgressLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const CircularProgressValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  line-height: 1;
`;

const CircularProgressUnit = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

// 小さなPFC円グラフ用
const SmallCircularProgress = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 0.5rem;
`;

const SmallCircularProgressSvg = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const SmallCircularProgressBackground = styled.circle`
  fill: none;
  stroke: #e5e7eb;
  stroke-width: 4;
`;

const SmallCircularProgressSegment = styled.circle<{
  percentage: number;
  offset: number;
  color: string;
}>`
  fill: none;
  stroke: ${props => props.color};
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: ${props => {
    const circumference = 2 * Math.PI * 25;
    const strokeDasharray = props.percentage * circumference / 100;
    return `${strokeDasharray} ${circumference}`;
  }};
  stroke-dashoffset: ${props => {
    const circumference = 2 * Math.PI * 25;
    return -props.offset * circumference / 100;
  }};
  transition: stroke-dasharray 0.3s ease, stroke-dashoffset 0.3s ease;
`;

const SmallCircularProgressLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const SmallCircularProgressValue = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
  color: #1f2937;
`;

const PFCBreakdown = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const PFCItem = styled.div`
  text-align: center;
`;

const PFCLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const PFCValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const PFCUnit = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: normal;
`;

// 状態表示用コンポーネント
const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
`;

const StatusIconWrapper = styled.div<{ status: 'success' | 'warning' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  color: ${props => {
    switch (props.status) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

const StatusText = styled.span<{ status: 'success' | 'warning' | 'error' | 'info' }>`
  color: ${props => {
    switch (props.status) {
      case 'success': return '#065f46';
      case 'warning': return '#92400e';
      case 'error': return '#991b1b';
      case 'info': return '#1e40af';
      default: return '#374151';
    }
  }};
`;

const StatusBackground = styled(StatusContainer)<{ status: 'success' | 'warning' | 'error' | 'info' }>`
  background-color: ${props => {
    switch (props.status) {
      case 'success': return '#ecfdf5';
      case 'warning': return '#fffbeb';
      case 'error': return '#fef2f2';
      case 'info': return '#eff6ff';
      default: return '#f9fafb';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'success': return '#d1fae5';
      case 'warning': return '#fde68a';
      case 'error': return '#fecaca';
      case 'info': return '#dbeafe';
      default: return '#e5e7eb';
    }
  }};
`;

const NutritionCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
`;

const NutritionCardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;


const LogoutButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }
`;

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    age: 0,
    gender: "male",
    height: 0,
    weight: 0,
    bodyGoal: "lean_muscle"
  });
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([]);
  const [results, setResults] = useState<Results | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [currentFood, setCurrentFood] = useState({
    food: "",
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
    quantity: "1"
  });
  const [currentExercise, setCurrentExercise] = useState({
    exerciseType: "",
    amount: "",
    calculatedCalories: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing user session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsAuthChecked(true);
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setProfile({
      age: 0,
      gender: "male",
      height: 0,
      weight: 0,
      bodyGoal: "lean_muscle"
    });
    setResults(null);
    setFoodEntries([]);
    setExerciseEntries([]);
  };

  // Load data on component mount
  const loadUserData = useCallback(async () => {
    try {
      // Load user profile
      const userResponse = await fetch('/api/users');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData) {
          setProfile(userData);
          // Auto-calculate nutrition if profile exists
          calculateNutritionFromData(userData);
        }
      }

      // Load food entries
      const foodResponse = await fetch('/api/food-entries');
      if (foodResponse.ok) {
        const foodData = await foodResponse.json();
        const transformedEntries = foodData.map((entry: {
          id: number;
          food: string;
          calories: number;
          protein: string;
          fat?: string;
          carbs?: string;
          quantity: number;
          unitCalories: number;
          unitProtein: string;
          unitFat?: string;
          unitCarbs?: string;
          createdAt: string;
        }) => ({
          ...entry,
          protein: parseFloat(entry.protein),
          fat: parseFloat(entry.fat || '0'),
          carbs: parseFloat(entry.carbs || '0'),
          unitProtein: parseFloat(entry.unitProtein),
          unitFat: parseFloat(entry.unitFat || '0'),
          unitCarbs: parseFloat(entry.unitCarbs || '0'),
          timestamp: new Date(entry.createdAt)
        }));
        setFoodEntries(transformedEntries);
      }

      // Load exercise entries
      const exerciseResponse = await fetch('/api/exercise-entries');
      if (exerciseResponse.ok) {
        const exerciseData = await exerciseResponse.json();
        const transformedExerciseEntries = exerciseData.map((entry: {
          id: number;
          exercise: string;
          exerciseType?: string;
          amount?: number;
          unit?: string;
          duration?: number; // 旧データ対応
          caloriesBurned: number;
          createdAt: string;
        }) => ({
          ...entry,
          amount: entry.amount || entry.duration || 0, // 旧データの場合はdurationを使用
          unit: entry.unit || '分', // 旧データの場合は分を使用
          timestamp: new Date(entry.createdAt)
        }));
        setExerciseEntries(transformedExerciseEntries);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  const calculateNutritionFromData = (profileData: ProfileData) => {
    let bmr: number;

    // Harris-Benedict equation for BMR calculation
    if (profileData.gender === "male") {
      bmr = 88.362 + (13.397 * profileData.weight) + (4.799 * profileData.height) - (5.677 * profileData.age);
    } else {
      bmr = 447.593 + (9.247 * profileData.weight) + (3.098 * profileData.height) - (4.330 * profileData.age);
    }

    // Base calories = BMR * sedentary multiplier (1.2) + goal calories
    let dailyCalories = bmr * 1.2;
    let protein: number;

    if (profileData.bodyGoal === "lean_muscle") {
      dailyCalories += 200; // 細マッチョ: 軽い増量
      protein = profileData.weight * 2.0;
    } else {
      dailyCalories += 500; // マッチョ: しっかり増量
      protein = profileData.weight * 2.5;
    }

    // PFCバランス計算 (一般的な比率: P:F:C = 25:25:50)
    const proteinCalories = protein * 4; // タンパク質 1g = 4kcal
    const remainingCalories = dailyCalories - proteinCalories;
    const fatCalories = remainingCalories * 0.3; // 30%
    const carbsCalories = remainingCalories * 0.7; // 70%

    const fat = Math.round(fatCalories / 9); // 脂質 1g = 9kcal
    const carbs = Math.round(carbsCalories / 4); // 炭水化物 1g = 4kcal

    setResults({
      dailyCalories: Math.round(dailyCalories),
      protein: Math.round(protein),
      fat: fat,
      carbs: carbs
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const userData = await response.json();
        setProfile(userData);
        calculateNutritionFromData(userData);
      } else {
        console.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentFood.food && currentFood.calories && currentFood.protein && currentFood.fat && currentFood.carbs && currentFood.quantity) {
      const unitCalories = parseInt(currentFood.calories);
      const unitProtein = parseFloat(currentFood.protein);
      const unitFat = parseFloat(currentFood.fat);
      const unitCarbs = parseFloat(currentFood.carbs);
      const quantity = parseInt(currentFood.quantity);

      try {
        const response = await fetch('/api/food-entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            food: currentFood.food,
            calories: unitCalories * quantity,
            protein: unitProtein * quantity,
            fat: unitFat * quantity,
            carbs: unitCarbs * quantity,
            quantity: quantity,
            unitCalories: unitCalories,
            unitProtein: unitProtein,
            unitFat: unitFat,
            unitCarbs: unitCarbs,
          }),
        });

        if (response.ok) {
          const savedEntry = await response.json();
          const newEntry: FoodEntry = {
            ...savedEntry,
            protein: parseFloat(savedEntry.protein),
            fat: parseFloat(savedEntry.fat),
            carbs: parseFloat(savedEntry.carbs),
            unitProtein: parseFloat(savedEntry.unitProtein),
            unitFat: parseFloat(savedEntry.unitFat),
            unitCarbs: parseFloat(savedEntry.unitCarbs),
            timestamp: new Date(savedEntry.createdAt)
          };
          setFoodEntries(prev => [newEntry, ...prev]);
          setCurrentFood({ food: "", calories: "", protein: "", fat: "", carbs: "", quantity: "1" });
        } else {
          console.error('Failed to save food entry');
        }
      } catch (error) {
        console.error('Error saving food entry:', error);
      }
    }
  };

  const handleDeleteFood = async (entryId: string | number) => {
    try {
      const response = await fetch(`/api/food-entries?id=${entryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFoodEntries(prev => prev.filter(entry => entry.id !== entryId));
      } else {
        console.error('Failed to delete food entry');
      }
    } catch (error) {
      console.error('Error deleting food entry:', error);
    }
  };

  // 運動量変更時のカロリー自動計算
  const handleExerciseAmountChange = (amount: string) => {
    setCurrentExercise(prev => {
      const newAmount = parseFloat(amount) || 0;
      let calculatedCalories = 0;

      if (prev.exerciseType && newAmount > 0 && profile.weight > 0) {
        const exercise = getExerciseById(prev.exerciseType);
        if (exercise) {
          calculatedCalories = calculateCalories(exercise, newAmount, profile.weight);
        }
      }

      return {
        ...prev,
        amount,
        calculatedCalories
      };
    });
  };

  // 運動タイプ変更時の処理
  const handleExerciseTypeChange = (exerciseTypeId: string) => {
    setCurrentExercise(prev => {
      const amount = parseFloat(prev.amount) || 0;
      let calculatedCalories = 0;

      if (exerciseTypeId && amount > 0 && profile.weight > 0) {
        const exercise = getExerciseById(exerciseTypeId);
        if (exercise) {
          calculatedCalories = calculateCalories(exercise, amount, profile.weight);
        }
      }

      return {
        exerciseType: exerciseTypeId,
        amount: prev.amount,
        calculatedCalories
      };
    });
  };

  const handleAddExercise = async () => {
    if (currentExercise.exerciseType && currentExercise.amount && currentExercise.calculatedCalories > 0) {
      const exercise = getExerciseById(currentExercise.exerciseType);
      if (!exercise) return;

      try {
        const response = await fetch('/api/exercise-entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exercise: exercise.name,
            exerciseType: currentExercise.exerciseType,
            amount: parseFloat(currentExercise.amount),
            unit: exercise.unitLabel,
            caloriesBurned: currentExercise.calculatedCalories,
          }),
        });

        if (response.ok) {
          const savedEntry = await response.json();
          const newEntry: ExerciseEntry = {
            ...savedEntry,
            timestamp: new Date(savedEntry.createdAt)
          };
          setExerciseEntries(prev => [newEntry, ...prev]);
          setCurrentExercise({
            exerciseType: "",
            amount: "",
            calculatedCalories: 0
          });
        } else {
          console.error('Failed to save exercise entry');
        }
      } catch (error) {
        console.error('Error saving exercise entry:', error);
      }
    }
  };

  const handleDeleteExercise = async (entryId: string | number) => {
    try {
      const response = await fetch(`/api/exercise-entries?id=${entryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExerciseEntries(prev => prev.filter(entry => entry.id !== entryId));
      } else {
        console.error('Failed to delete exercise entry');
      }
    } catch (error) {
      console.error('Error deleting exercise entry:', error);
    }
  };

  const totalConsumedCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalConsumedProtein = foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalConsumedFat = foodEntries.reduce((sum, entry) => sum + entry.fat, 0);
  const totalConsumedCarbs = foodEntries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalBurnedCalories = exerciseEntries.reduce((sum, entry) => sum + entry.caloriesBurned, 0);



  // 運動を考慮したカロリー進捗計算: 摂取カロリー / (目標カロリー + 運動消費カロリー)
  const adjustedDailyCalories = results ? results.dailyCalories + totalBurnedCalories : 0;
  const calorieProgress = adjustedDailyCalories > 0 ? (totalConsumedCalories / adjustedDailyCalories) * 100 : 0;
  const proteinProgress = results ? (totalConsumedProtein / results.protein) * 100 : 0;

  // PFC進捗率計算
  const fatProgress = results ? (totalConsumedFat / results.fat) * 100 : 0;
  const carbsProgress = results ? (totalConsumedCarbs / results.carbs) * 100 : 0;

  // 状態判定とアイコン表示の関数
  const getNutritionStatus = (consumed: number, target: number, type: 'calories' | 'protein' | 'fat' | 'carbs') => {
    const progress = target > 0 ? (consumed / target) * 100 : 0;
    const remaining = target - consumed;

    if (progress >= 100) {
      return {
        status: 'error' as const,
        icon: <ErrorIcon sx={{ fontSize: 18 }} />,
        message: `${Math.abs(remaining).toFixed(0)}${type === 'calories' ? 'kcal' : 'g'} オーバー`,
        bgStatus: 'error' as const
      };
    } else if (progress >= 80) {
      return {
        status: 'warning' as const,
        icon: <WarningIcon sx={{ fontSize: 18 }} />,
        message: `あと${remaining.toFixed(0)}${type === 'calories' ? 'kcal' : 'g'}（目標まで近い！）`,
        bgStatus: 'warning' as const
      };
    } else if (progress >= 50) {
      return {
        status: 'info' as const,
        icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
        message: `あと${remaining.toFixed(0)}${type === 'calories' ? 'kcal' : 'g'} 摂取可能`,
        bgStatus: 'info' as const
      };
    } else {
      return {
        status: 'success' as const,
        icon: <TrendingDownIcon sx={{ fontSize: 18 }} />,
        message: `あと${remaining.toFixed(0)}${type === 'calories' ? 'kcal' : 'g'} 摂取可能（余裕あり）`,
        bgStatus: 'success' as const
      };
    }
  };

  // Show loading state while checking authentication
  if (!isAuthChecked) {
    return (
      <Container>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          読み込み中...
        </div>
      </Container>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Container>
      <LogoutButton onClick={handleLogout}>
        ログアウト ({user.email})
      </LogoutButton>
      <Title>ダイエット計算アプリ</Title>
      <MainContent>
        <LeftColumn>
          {/* 食事入力フォーム */}
          <FoodInputForm onSubmit={handleFoodSubmit}>
            <FormTitle>🍽️ 食事を記録</FormTitle>
            <FoodInputGrid>
              <Input
                type="text"
                value={currentFood.food}
                onChange={(e) => setCurrentFood(prev => ({ ...prev, food: e.target.value }))}
                placeholder="食べ物の名前"
                required
              />
              <Input
                type="number"
                value={currentFood.quantity}
                onChange={(e) => setCurrentFood(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="個数"
                min="1"
                required
              />
              <Input
                type="number"
                value={currentFood.calories}
                onChange={(e) => setCurrentFood(prev => ({ ...prev, calories: e.target.value }))}
                placeholder="1個のカロリー"
                required
              />
              <Input
                type="number"
                step="0.1"
                value={currentFood.protein}
                onChange={(e) => setCurrentFood(prev => ({ ...prev, protein: e.target.value }))}
                placeholder="1個のタンパク質(g)"
                required
              />
              <Input
                type="number"
                step="0.1"
                value={currentFood.fat}
                onChange={(e) => setCurrentFood(prev => ({ ...prev, fat: e.target.value }))}
                placeholder="1個の脂質(g)"
                required
              />
              <Input
                type="number"
                step="0.1"
                value={currentFood.carbs}
                onChange={(e) => setCurrentFood(prev => ({ ...prev, carbs: e.target.value }))}
                placeholder="1個の炭水化物(g)"
                required
              />
            </FoodInputGrid>
            <Button type="submit">記録する</Button>
          </FoodInputForm>

          {/* 運動入力フォーム */}
          <FoodInputForm onSubmit={(e) => { e.preventDefault(); handleAddExercise(); }}>
            <FormTitle>🏃‍♂️ 運動を記録</FormTitle>
            <FoodInputGrid>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
                  運動の種類
                </label>
                <select
                  value={currentExercise.exerciseType}
                  onChange={(e) => handleExerciseTypeChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    outline: 'none'
                  }}
                  required
                >
                  <option value="">運動を選択</option>
                  {exerciseDatabase.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
              </div>

              {currentExercise.exerciseType && (
                <>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
                      {getExerciseById(currentExercise.exerciseType)?.unitLabel || '数値'}
                    </label>
                    <Input
                      type="number"
                      value={currentExercise.amount}
                      onChange={(e) => handleExerciseAmountChange(e.target.value)}
                      placeholder={`${getExerciseById(currentExercise.exerciseType)?.unitLabel || '数値'}を入力`}
                      min="0"
                      step={getExerciseById(currentExercise.exerciseType)?.unit === 'distance' ? '0.1' : '1'}
                      required
                    />
                  </div>

                  <div style={{
                    gridColumn: 'span 2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem'
                  }}>
                    <span>💪 推定消費カロリー:</span>
                    <span style={{ fontWeight: 'bold', color: '#059669' }}>
                      {currentExercise.calculatedCalories}kcal
                    </span>
                  </div>
                </>
              )}
            </FoodInputGrid>

            {currentExercise.exerciseType && (
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.25rem'
              }}>
                💡 {getExerciseById(currentExercise.exerciseType)?.description}
              </div>
            )}

            <Button
              type="submit"
              disabled={!currentExercise.exerciseType || !currentExercise.amount || currentExercise.calculatedCalories === 0}
            >
              記録する
            </Button>
          </FoodInputForm>

          {/* 食事記録一覧 */}
          <div>
            <FormTitle>📝 今日の食事記録</FormTitle>
            <FoodEntryList>
              {foodEntries.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  まだ食事が記録されていません
                </div>
              ) : (
                foodEntries.map((entry) => (
                  <FoodEntryItem key={entry.id}>
                    <FoodEntryHeader>
                      <FoodName>
                        {entry.food} {entry.quantity > 1 && `× ${entry.quantity}`}
                      </FoodName>
                      <FoodTime>
                        {entry.timestamp.toLocaleTimeString('ja-JP', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </FoodTime>
                    </FoodEntryHeader>
                    <FoodNutrients>
                      <span>🔥 {entry.calories}kcal</span>
                      <span>💪 P:{entry.protein}g</span>
                      <span>🟡 F:{entry.fat}g</span>
                      <span>🍞 C:{entry.carbs}g</span>
                      {entry.quantity > 1 && (
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', gridColumn: 'span 4' }}>
                          (1個: {entry.unitCalories}kcal, P:{entry.unitProtein}g, F:{entry.unitFat}g, C:{entry.unitCarbs}g)
                        </span>
                      )}
                      <DeleteButton onClick={() => handleDeleteFood(entry.id)}>
                        削除
                      </DeleteButton>
                    </FoodNutrients>
                  </FoodEntryItem>
                ))
              )}
            </FoodEntryList>
          </div>

          {/* 運動記録一覧 */}
          <div>
            <FormTitle>🏃‍♂️ 今日の運動記録</FormTitle>
            <FoodEntryList>
              {exerciseEntries.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  まだ運動が記録されていません
                </div>
              ) : (
                exerciseEntries.map((entry) => (
                  <FoodEntryItem key={entry.id}>
                    <FoodEntryHeader>
                      <FoodName>{entry.exercise}</FoodName>
                      <FoodTime>{entry.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</FoodTime>
                    </FoodEntryHeader>
                    <FoodNutrients>
                      <span>📊 {entry.amount}{entry.unit}</span>
                      <span>🔥 {entry.caloriesBurned}kcal</span>
                      <DeleteButton
                        onClick={() => handleDeleteExercise(entry.id)}
                        type="button"
                      >
                        削除
                      </DeleteButton>
                    </FoodNutrients>
                  </FoodEntryItem>
                ))
              )}
            </FoodEntryList>
          </div>

          {/* プロフィール設定 */}
          <FormContainer onSubmit={handleSubmit}>
            <FormTitle>⚙️ プロフィール設定</FormTitle>
            <FormGrid>
              <FormField>
                <Label>年齢</Label>
                <Input
                  type="number"
                  value={profile.age || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  placeholder="例: 25"
                  required
                />
              </FormField>

              <FormField>
                <Label>性別</Label>
                <Select
                  value={profile.gender}
                  onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value as "male" | "female" }))}
                >
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                </Select>
              </FormField>

              <FormField>
                <Label>身長 (cm)</Label>
                <Input
                  type="number"
                  value={profile.height || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                  placeholder="例: 170"
                  required
                />
              </FormField>

              <FormField>
                <Label>体重 (kg)</Label>
                <Input
                  type="number"
                  value={profile.weight || ""}
                  onChange={(e) => setProfile(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                  placeholder="例: 65"
                  required
                />
              </FormField>


              <FormField>
                <Label>目標体型</Label>
                <Select
                  value={profile.bodyGoal}
                  onChange={(e) => setProfile(prev => ({ ...prev, bodyGoal: e.target.value as ProfileData["bodyGoal"] }))}
                >
                  <option value="lean_muscle">細マッチョ（引き締まった筋肉質）</option>
                  <option value="bulk_muscle">マッチョ（筋肉増量重視）</option>
                </Select>
              </FormField>
            </FormGrid>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : "計算して保存"}
            </Button>
          </FormContainer>
        </LeftColumn>

        <RightColumn>
          {/* 円グラフでの進捗表示 */}
          {results && (
            <>
              <NutritionCard>
                <NutritionCardTitle>🔥 カロリー摂取状況</NutritionCardTitle>
                <CircularProgress>
                  <CircularProgressSvg>
                    <CircularProgressBackground
                      cx="60"
                      cy="60"
                      r="50"
                    />
                    <CircularProgressForeground
                      cx="60"
                      cy="60"
                      r="50"
                      percentage={calorieProgress}
                      isOverLimit={calorieProgress > 100}
                    />
                  </CircularProgressSvg>
                  <CircularProgressLabel>
                    <CircularProgressValue>
                      {Math.round(calorieProgress)}%
                    </CircularProgressValue>
                    <CircularProgressUnit>
                      {totalConsumedCalories} / {adjustedDailyCalories}
                    </CircularProgressUnit>
                  </CircularProgressLabel>
                </CircularProgress>
                {/* 運動による追加カロリー表示 */}
                {totalBurnedCalories > 0 && (
                  <StatusBackground status="success">
                    <StatusIconWrapper status="success">
                      <TrendingUpIcon sx={{ fontSize: 18 }} />
                    </StatusIconWrapper>
                    <StatusText status="success">
                      運動で +{totalBurnedCalories}kcal 追加！
                    </StatusText>
                  </StatusBackground>
                )}

                {/* カロリー摂取状況 */}
                {(() => {
                  const calorieStatus = getNutritionStatus(totalConsumedCalories, adjustedDailyCalories, 'calories');
                  return (
                    <StatusBackground status={calorieStatus.bgStatus}>
                      <StatusIconWrapper status={calorieStatus.status}>
                        {calorieStatus.icon}
                      </StatusIconWrapper>
                      <StatusText status={calorieStatus.status}>
                        {calorieStatus.message}
                      </StatusText>
                    </StatusBackground>
                  );
                })()}

                {/* PFCバランス円グラフ */}
                <PFCBreakdown>
                  <PFCItem>
                    <SmallCircularProgress>
                      <SmallCircularProgressSvg>
                        <SmallCircularProgressBackground
                          cx="30"
                          cy="30"
                          r="25"
                        />
                        <SmallCircularProgressSegment
                          cx="30"
                          cy="30"
                          r="25"
                          percentage={Math.min(proteinProgress, 100)}
                          offset={0}
                          color="#ef4444"
                        />
                      </SmallCircularProgressSvg>
                      <SmallCircularProgressLabel>
                        <SmallCircularProgressValue>{Math.round(proteinProgress)}%</SmallCircularProgressValue>
                      </SmallCircularProgressLabel>
                    </SmallCircularProgress>
                    <PFCLabel>タンパク質</PFCLabel>
                    <PFCValue>
                      {totalConsumedProtein.toFixed(1)}<PFCUnit>g</PFCUnit>
                    </PFCValue>
                    <PFCValue style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      / {results?.protein || 0}g
                    </PFCValue>
                  </PFCItem>

                  <PFCItem>
                    <SmallCircularProgress>
                      <SmallCircularProgressSvg>
                        <SmallCircularProgressBackground
                          cx="30"
                          cy="30"
                          r="25"
                        />
                        <SmallCircularProgressSegment
                          cx="30"
                          cy="30"
                          r="25"
                          percentage={Math.min(fatProgress, 100)}
                          offset={0}
                          color="#f59e0b"
                        />
                      </SmallCircularProgressSvg>
                      <SmallCircularProgressLabel>
                        <SmallCircularProgressValue>{Math.round(fatProgress)}%</SmallCircularProgressValue>
                      </SmallCircularProgressLabel>
                    </SmallCircularProgress>
                    <PFCLabel>脂質</PFCLabel>
                    <PFCValue>
                      {totalConsumedFat.toFixed(1)}<PFCUnit>g</PFCUnit>
                    </PFCValue>
                    <PFCValue style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      / {results?.fat || 0}g
                    </PFCValue>
                  </PFCItem>

                  <PFCItem>
                    <SmallCircularProgress>
                      <SmallCircularProgressSvg>
                        <SmallCircularProgressBackground
                          cx="30"
                          cy="30"
                          r="25"
                        />
                        <SmallCircularProgressSegment
                          cx="30"
                          cy="30"
                          r="25"
                          percentage={Math.min(carbsProgress, 100)}
                          offset={0}
                          color="#10b981"
                        />
                      </SmallCircularProgressSvg>
                      <SmallCircularProgressLabel>
                        <SmallCircularProgressValue>{Math.round(carbsProgress)}%</SmallCircularProgressValue>
                      </SmallCircularProgressLabel>
                    </SmallCircularProgress>
                    <PFCLabel>炭水化物</PFCLabel>
                    <PFCValue>
                      {totalConsumedCarbs.toFixed(1)}<PFCUnit>g</PFCUnit>
                    </PFCValue>
                    <PFCValue style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      / {results?.carbs || 0}g
                    </PFCValue>
                  </PFCItem>
                </PFCBreakdown>
              </NutritionCard>

              <NutritionCard>
                <NutritionCardTitle>💪 タンパク質摂取状況</NutritionCardTitle>
                <CircularProgress>
                  <CircularProgressSvg>
                    <CircularProgressBackground
                      cx="60"
                      cy="60"
                      r="50"
                    />
                    <CircularProgressForeground
                      cx="60"
                      cy="60"
                      r="50"
                      percentage={proteinProgress}
                      isOverLimit={false}
                    />
                  </CircularProgressSvg>
                  <CircularProgressLabel>
                    <CircularProgressValue>
                      {Math.round(proteinProgress)}%
                    </CircularProgressValue>
                    <CircularProgressUnit>
                      {totalConsumedProtein.toFixed(1)} / {results.protein}g
                    </CircularProgressUnit>
                  </CircularProgressLabel>
                </CircularProgress>
                {/* タンパク質摂取状況 */}
                {(() => {
                  const proteinStatus = getNutritionStatus(totalConsumedProtein, results?.protein || 0, 'protein');
                  return (
                    <StatusBackground status={proteinStatus.bgStatus}>
                      <StatusIconWrapper status={proteinStatus.status}>
                        {proteinStatus.icon}
                      </StatusIconWrapper>
                      <StatusText status={proteinStatus.status}>
                        {proteinStatus.message}
                      </StatusText>
                    </StatusBackground>
                  );
                })()}
              </NutritionCard>
            </>
          )}

          {/* 目標値表示 */}
          {results && (
            <ResultsContainer>
              <ResultsTitle>🎯 今日の目標</ResultsTitle>
              <ResultsGrid>
                <ResultCard variant="calories">
                  <ResultCardTitle variant="calories">
                    1日の目標カロリー
                  </ResultCardTitle>
                  <ResultValue variant="calories">
                    {results.dailyCalories}
                    <span>kcal</span>
                  </ResultValue>
                </ResultCard>
                <ResultCard variant="protein">
                  <ResultCardTitle variant="protein">
                    1日の目標タンパク質
                  </ResultCardTitle>
                  <ResultValue variant="protein">
                    {results.protein}
                    <span>g</span>
                  </ResultValue>
                </ResultCard>
              </ResultsGrid>
              <Notice>
                <p>
                  ※ この計算は一般的な式に基づいています。個人差がありますので、参考程度にお使いください。
                </p>
              </Notice>
            </ResultsContainer>
          )}
        </RightColumn>
      </MainContent>
    </Container>
  );
}
