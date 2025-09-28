import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import {
  pgTable,
  serial,
  varchar,
  integer,
  decimal,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Enums
export const genderEnum = pgEnum('gender', ['male', 'female']);
export const activityLevelEnum = pgEnum('activity_level', [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very_active'
]);
export const bodyGoalEnum = pgEnum('body_goal', ['lean_muscle', 'bulk_muscle']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  age: integer('age').notNull(),
  gender: genderEnum('gender').notNull(),
  height: integer('height').notNull(),
  weight: integer('weight').notNull(),
  activityLevel: activityLevelEnum('activity_level').notNull(),
  bodyGoal: bodyGoalEnum('body_goal').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Food entries table
export const foodEntries = pgTable('food_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  food: varchar('food', { length: 255 }).notNull(),
  calories: integer('calories').notNull(),
  protein: decimal('protein', { precision: 5, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  unitCalories: integer('unit_calories').notNull(),
  unitProtein: decimal('unit_protein', { precision: 5, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const db = drizzle(sql);