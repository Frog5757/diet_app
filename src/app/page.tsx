"use client";

import { useState, useEffect, useCallback } from "react";
import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import AuthPage from "./auth/page";

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
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  bodyGoal: "lean_muscle" | "bulk_muscle";
}

interface Results {
  dailyCalories: number;
  protein: number;
}

interface FoodEntry {
  id: string;
  food: string;
  calories: number;
  protein: number;
  quantity: number;
  unitCalories: number;
  unitProtein: number;
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
    ring: 2px;
    ring-color: #3b82f6;
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
    ring: 2px;
    ring-color: #3b82f6;
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

const CalorieSummaryCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  position: sticky;
  top: 1rem;
`;

const CalorieSummaryTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const CalorieProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const CalorieProgress = styled.div<{ percentage: number }>`
  height: 100%;
  background-color: ${props => props.percentage > 100 ? '#ef4444' : '#10b981'};
  width: ${props => Math.min(props.percentage, 100)}%;
  transition: width 0.3s ease;
`;

const CalorieStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CalorieStat = styled.div`
  text-align: center;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
`;

const CalorieStatValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
`;

const CalorieStatLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
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

const NutritionStatus = styled.div<{ isComplete: boolean }>`
  font-size: 0.875rem;
  color: ${props => props.isComplete ? '#10b981' : '#ef4444'};
  font-weight: 500;
  margin-top: 0.5rem;
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
    activityLevel: "sedentary",
    bodyGoal: "lean_muscle"
  });
  const [results, setResults] = useState<Results | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [currentFood, setCurrentFood] = useState({ food: "", calories: "", protein: "", quantity: "1" });
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
      activityLevel: "sedentary",
      bodyGoal: "lean_muscle"
    });
    setResults(null);
    setFoodEntries([]);
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
          quantity: number;
          unitCalories: number;
          unitProtein: string;
          createdAt: string;
        }) => ({
          ...entry,
          protein: parseFloat(entry.protein),
          unitProtein: parseFloat(entry.unitProtein),
          timestamp: new Date(entry.createdAt)
        }));
        setFoodEntries(transformedEntries);
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

    if (profileData.gender === "male") {
      bmr = 88.362 + (13.397 * profileData.weight) + (4.799 * profileData.height) - (5.677 * profileData.age);
    } else {
      bmr = 447.593 + (9.247 * profileData.weight) + (3.098 * profileData.height) - (4.330 * profileData.age);
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    let dailyCalories = bmr * activityMultipliers[profileData.activityLevel];
    let protein: number;

    if (profileData.bodyGoal === "lean_muscle") {
      dailyCalories += 200;
      protein = profileData.weight * 2.0;
    } else {
      dailyCalories += 500;
      protein = profileData.weight * 2.5;
    }

    setResults({
      dailyCalories: Math.round(dailyCalories),
      protein: Math.round(protein)
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
    if (currentFood.food && currentFood.calories && currentFood.protein && currentFood.quantity) {
      const unitCalories = parseInt(currentFood.calories);
      const unitProtein = parseFloat(currentFood.protein);
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
            quantity: quantity,
            unitCalories: unitCalories,
            unitProtein: unitProtein,
          }),
        });

        if (response.ok) {
          const savedEntry = await response.json();
          const newEntry: FoodEntry = {
            ...savedEntry,
            protein: parseFloat(savedEntry.protein),
            unitProtein: parseFloat(savedEntry.unitProtein),
            timestamp: new Date(savedEntry.createdAt)
          };
          setFoodEntries(prev => [newEntry, ...prev]);
          setCurrentFood({ food: "", calories: "", protein: "", quantity: "1" });
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

  const totalConsumedCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalConsumedProtein = foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const remainingCalories = results ? results.dailyCalories - totalConsumedCalories : 0;
  const remainingProtein = results ? results.protein - totalConsumedProtein : 0;
  const calorieProgress = results ? (totalConsumedCalories / results.dailyCalories) * 100 : 0;
  const proteinProgress = results ? (totalConsumedProtein / results.protein) * 100 : 0;

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
            </FoodInputGrid>
            <Button type="submit">記録する</Button>
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
                      <span>💪 {entry.protein}g</span>
                      {entry.quantity > 1 && (
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          (1個: {entry.unitCalories}kcal, {entry.unitProtein}g)
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
                <Label>活動レベル</Label>
                <Select
                  value={profile.activityLevel}
                  onChange={(e) => setProfile(prev => ({ ...prev, activityLevel: e.target.value as ProfileData["activityLevel"] }))}
                >
                  <option value="sedentary">ほとんど運動しない</option>
                  <option value="light">軽い運動（週1-3回）</option>
                  <option value="moderate">中程度の運動（週3-5回）</option>
                  <option value="active">活発な運動（週6-7回）</option>
                  <option value="very_active">非常に活発（1日2回運動）</option>
                </Select>
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
                      {totalConsumedCalories} / {results.dailyCalories}
                    </CircularProgressUnit>
                  </CircularProgressLabel>
                </CircularProgress>
                <NutritionStatus isComplete={remainingCalories <= 0}>
                  {remainingCalories > 0
                    ? `あと ${remainingCalories}kcal 摂取可能`
                    : remainingCalories === 0
                    ? "目標達成！"
                    : `${Math.abs(remainingCalories)}kcal オーバー`
                  }
                </NutritionStatus>
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
                <NutritionStatus isComplete={remainingProtein <= 0}>
                  {remainingProtein > 0
                    ? `あと ${remainingProtein.toFixed(1)}g 必要`
                    : remainingProtein === 0
                    ? "目標達成！"
                    : `${Math.abs(remainingProtein).toFixed(1)}g 達成済み`
                  }
                </NutritionStatus>
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
