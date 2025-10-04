"use client";

import { useState } from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const AuthCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
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

const Button = styled.button`
  width: 100%;
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

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1rem;
  text-align: center;
  width: 100%;

  &:hover {
    color: #1d4ed8;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: #f0fdf4;
  color: #16a34a;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

interface User {
  id: number;
  email: string;
  createdAt: string;
}

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active" | "very_active">("sedentary");
  const [bodyGoal, setBodyGoal] = useState<"lean_muscle" | "bulk_muscle">("lean_muscle");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const requestBody = isLogin
        ? { email, password }
        : {
            email,
            password,
            profile: {
              age: parseInt(age),
              gender,
              height: parseInt(height),
              weight: parseInt(weight),
              activityLevel,
              bodyGoal
            }
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Login successful
          localStorage.setItem('user', JSON.stringify(data.user));
          onAuthSuccess(data.user);
        } else {
          // Registration successful
          setSuccess('Registration successful! Please login.');
          setIsLogin(true);
          setEmail("");
          setPassword("");
          setAge("");
          setHeight("");
          setWeight("");
          setGender("male");
          setActivityLevel("sedentary");
          setBodyGoal("lean_muscle");
        }
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <AuthCard>
        <Title>{isLogin ? 'ログイン' : '会員登録'}</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormField>
            <Label>メールアドレス</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </FormField>

          <FormField>
            <Label>パスワード</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
            />
          </FormField>

          {!isLogin && (
            <>
              <FormField>
                <Label>年齢</Label>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="年齢を入力"
                  required
                />
              </FormField>

              <FormField>
                <Label>性別</Label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "male" | "female")}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    outline: 'none'
                  }}
                  required
                >
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                </select>
              </FormField>

              <FormField>
                <Label>身長 (cm)</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="身長を入力"
                  required
                />
              </FormField>

              <FormField>
                <Label>体重 (kg)</Label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="体重を入力"
                  required
                />
              </FormField>

              <FormField>
                <Label>活動レベル</Label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as "sedentary" | "light" | "moderate" | "active" | "very_active")}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    outline: 'none'
                  }}
                  required
                >
                  <option value="sedentary">ほとんど運動しない</option>
                  <option value="light">軽い運動 (週1-3回)</option>
                  <option value="moderate">適度な運動 (週3-5回)</option>
                  <option value="active">激しい運動 (週6-7回)</option>
                  <option value="very_active">非常に激しい運動 (1日2回、激しい運動)</option>
                </select>
              </FormField>

              <FormField>
                <Label>目標体型</Label>
                <select
                  value={bodyGoal}
                  onChange={(e) => setBodyGoal(e.target.value as "lean_muscle" | "bulk_muscle")}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    outline: 'none'
                  }}
                  required
                >
                  <option value="lean_muscle">細マッチョ</option>
                  <option value="bulk_muscle">マッチョ</option>
                </select>
              </FormField>
            </>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? '処理中...' : (isLogin ? 'ログイン' : '会員登録')}
          </Button>
        </Form>

        <ToggleButton onClick={() => {
          setIsLogin(!isLogin);
          setError("");
          setSuccess("");
          if (!isLogin) {
            // Clear profile fields when switching to login
            setAge("");
            setHeight("");
            setWeight("");
            setGender("male");
            setActivityLevel("sedentary");
            setBodyGoal("lean_muscle");
          }
        }}>
          {isLogin ? '新規会員登録はこちら' : 'ログインはこちら'}
        </ToggleButton>
      </AuthCard>
    </Container>
  );
}