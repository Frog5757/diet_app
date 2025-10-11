"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

const Container = styled.div`
  min-height: 100vh;
  background: #1a1d2e;
  padding: 2rem 1rem;
`;

const Content = styled.div`
  max-width: 48rem;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  color: #ff6b35;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 640px) {
    font-size: 1.5rem;
    margin-top: 1rem;
    gap: 0.5rem;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  @media (max-width: 640px) {
    position: relative;
    top: 0;
    left: 0;
    margin: 0 auto 1rem;
    padding: 0.4rem 1rem;
    font-size: 0.75rem;
  }
`;

const FormContainer = styled.form`
  background-color: #2d3142;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 2px solid #ff6b35;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(255, 107, 53, 0.3);
  }
`;

const FormTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #ff6b35;
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
  margin-top: 1.5rem;
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

export default function MyPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    age: 0,
    gender: "male",
    height: 0,
    weight: 0,
    bodyGoal: "lean_muscle"
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        loadUserProfile();
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const userData = await response.json();
        if (userData) {
          setProfile(userData);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
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
        alert('プロフィールを保存しました！');
      } else {
        console.error('Failed to save profile');
        alert('保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <div style={{ textAlign: 'center', color: '#a0a0b0' }}>
          読み込み中...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => router.push('/')}>
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        戻る
      </BackButton>
      <Content>
        <Title>
          <SettingsIcon sx={{ fontSize: 40 }} />
          マイページ
        </Title>

        <FormContainer onSubmit={handleSubmit}>
          <FormTitle>プロフィール設定</FormTitle>
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
            {isLoading ? "保存中..." : "保存する"}
          </Button>
        </FormContainer>
      </Content>
    </Container>
  );
}
