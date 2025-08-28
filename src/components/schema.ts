import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const timetables = pgTable("timetables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  className: text("class_name").notNull().default("Class 1"),
  startTime: text("start_time").notNull().default("09:00"),
  periodDuration: integer("period_duration").notNull().default(45),
  enableBreak: boolean("enable_break").notNull().default(true),
  breakAfterPeriod: integer("break_after_period").notNull().default(4),
  breakDuration: integer("break_duration").notNull().default(15),
  schedule: jsonb("schedule").notNull().default({}),
  customSubjects: jsonb("custom_subjects").notNull().default([]),
});

export const insertTimetableSchema = createInsertSchema(timetables).omit({
  id: true,
});

export type InsertTimetable = z.infer<typeof insertTimetableSchema>;
export type Timetable = typeof timetables.$inferSelect;

// Types for the schedule structure
export type SubjectAssignment = {
  subject: string;
  color: string;
};

export type DaySchedule = {
  [period: string]: SubjectAssignment;
};

export type WeekSchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
};

export type CustomSubject = {
  id: string;
  name: string;
  color: string;
};
