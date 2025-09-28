import { NextRequest, NextResponse } from 'next/server';

// Define food entry type
interface FoodEntry {
  id: number;
  userId: number;
  food: string;
  calories: number;
  protein: string;
  quantity: number;
  unitCalories: number;
  unitProtein: string;
  createdAt: string;
}

// Temporary in-memory storage for demo purposes
const foodEntriesData: FoodEntry[] = [];
let nextId = 1;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { food, calories, protein, quantity, unitCalories, unitProtein } = body;

    // Simple validation
    if (!food || !calories || !protein || !quantity || !unitCalories || !unitProtein) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const newFoodEntry = {
      id: nextId++,
      userId: 1, // Demo user ID
      food,
      calories: parseInt(calories),
      protein: protein.toString(),
      quantity: parseInt(quantity),
      unitCalories: parseInt(unitCalories),
      unitProtein: unitProtein.toString(),
      createdAt: new Date().toISOString(),
    };

    foodEntriesData.unshift(newFoodEntry); // Add to beginning

    return NextResponse.json(newFoodEntry);
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
    return NextResponse.json(foodEntriesData);
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
        { error: 'Food entry ID is required' },
        { status: 400 }
      );
    }

    const entryIndex = foodEntriesData.findIndex(entry => entry.id === parseInt(id));

    if (entryIndex === -1) {
      return NextResponse.json(
        { error: 'Food entry not found' },
        { status: 404 }
      );
    }

    const deletedEntry = foodEntriesData.splice(entryIndex, 1)[0];

    return NextResponse.json({
      message: 'Food entry deleted successfully',
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