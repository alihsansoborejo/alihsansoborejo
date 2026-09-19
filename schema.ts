import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Users table (Firebase Auth linkage)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. PPDB Online Registrations table
export const ppdbRegistrations = pgTable('ppdb_registrations', {
  id: text('id').primaryKey(),
  registrationNumber: text('registration_number').notNull().unique(),
  fullName: text('full_name').notNull(),
  nisn: text('nisn'),
  nik: text('nik'),
  birthPlace: text('birth_place'),
  birthDate: text('birth_date'),
  gender: text('gender').notNull(),
  parentName: text('parent_name').notNull(),
  parentPhone: text('parent_phone').notNull(),
  parentAddress: text('parent_address'),
  previousSchool: text('previous_school'),
  registrationDate: text('registration_date').notNull(),
  status: text('status').default('menunggu_verifikasi').notNull(),
  notes: text('notes'),
  documentsJson: jsonb('documents_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Staff & Teachers (GTK)
export const staffMembers = pgTable('staff_members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  category: text('category').notNull(), // 'pimpinan' | 'guru' | 'tenaga_kependidikan'
  nip: text('nip'),
  education: text('education'),
  subject: text('subject'),
  photoUrl: text('photo_url'),
  bio: text('bio'),
  orderNum: integer('order_num').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. News & Announcements
export const newsArticles = pgTable('news_articles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  category: text('category').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(),
  author: text('author').notNull(),
  imageUrl: text('image_url'),
  readTime: text('read_time'),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. School Master Configuration & Content State
// Keys: 'school_profile', 'stats_list', 'programs', 'extracurriculars', 'achievements', 'facilities', 'gallery', 'testimonials', 'faqs'
export const appSettings = pgTable('app_settings', {
  id: serial('id').primaryKey(),
  settingKey: text('setting_key').notNull().unique(),
  settingValue: jsonb('setting_value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
