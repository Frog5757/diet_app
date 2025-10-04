import { NextRequest, NextResponse } from 'next/server';

// Define exercise entry type
interface ExerciseEntry {
  id: number;
  userId: number;
  exercise: string;
  exerciseType?: string; // 運動タイプID
  amount: number; // 回数/時間/距離
  unit: string; // 単位
  duration?: number; // 旧データ互換用（非推奨）
  caloriesBurned: number;
  createdAt: string;
}

// Temporary in-memory storage for demo purposes
const exerciseEntriesData: ExerciseEntry[] = [];
let nextId = 1;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exercise, exerciseType, amount, unit, duration, caloriesBurned } = body;

    // Simple validation - 新形式または旧形式をサポート
    if (!exercise || !caloriesBurned || (!amount && !duration)) {
      return NextResponse.json(
        { error: 'Required fields: exercise, caloriesBurned, and either amount or duration' },
        { status: 400 }
      );
    }

    const newExerciseEntry = {
      id: nextId++,
      userId: 1, // Demo user ID
      exercise,
      exerciseType: exerciseType || undefined,
      amount: amount ? parseFloat(amount) : (duration ? parseInt(duration) : 0),
      unit: unit || '分',
      duration: duration ? parseInt(duration) : undefined, // 旧データ互換
      caloriesBurned: parseInt(caloriesBurned),
      createdAt: new Date().toISOString(),
    };

    exerciseEntriesData.unshift(newExerciseEntry); // Add to beginning

    return NextResponse.json(newExerciseEntry);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json(exerciseEntriesData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Exercise entry ID is required' },
        { status: 400 }
      );
    }

    const entryIndex = exerciseEntriesData.findIndex(entry => entry.id === parseInt(id));

    if (entryIndex === -1) {
      return NextResponse.json(
        { error: 'Exercise entry not found' },
        { status: 404 }
      );
    }

    const deletedEntry = exerciseEntriesData.splice(entryIndex, 1)[0];

    return NextResponse.json({
      message: 'Exercise entry deleted successfully',
      deletedEntry
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}