"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const Container = styled.div`
  min-height: 100vh;
  background: #1a1d2e;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const AuthCard = styled.div`
  background-color: #2d3142;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  border: 2px solid #ff6b35;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  color: #ff6b35;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
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
  color: #a0a0b0;
  margin-bottom: 0.25rem;
`;

const inputStyles = css`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 2px solid #4a4d5e;
  border-radius: 0.375rem;
  outline: none;
  background-color: #383d52;
  color: #ffffff;
  transition: all 0.15s ease-in-out;

  &::placeholder {
    color: #7a7d8e;
  }

  &:focus {
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
    background-color: #434857;
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
  margin-top: 0.5rem;
  background: #ff6b35;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.6);
    background: #ff7f4d;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #4a4d5e;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #ff6b35;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 1rem;
  text-align: center;
  width: 100%;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    color: #ff7f4d;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  color: #ff6b6b;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
`;

const SuccessMessage = styled.div`
  background-color: rgba(16, 185, 129, 0.1);
  color: #4ade80;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(16, 185, 129, 0.3);
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
        <Title>
          <FitnessCenterIcon sx={{ fontSize: 36 }} />
          {isLogin ? 'ログイン' : '会員登録'}
        </Title>

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
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "male" | "female")}
                  required
                >
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                </Select>
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
                <Label>目標体型</Label>
                <Select
                  value={bodyGoal}
                  onChange={(e) => setBodyGoal(e.target.value as "lean_muscle" | "bulk_muscle")}
                  required
                >
                  <option value="lean_muscle">細マッチョ</option>
                  <option value="bulk_muscle">マッチョ</option>
                </Select>
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
            setBodyGoal("lean_muscle");
          }
        }}>
          {isLogin ? '新規会員登録はこちら' : 'ログインはこちら'}
        </ToggleButton>
      </AuthCard>
    </Container>
  );
}