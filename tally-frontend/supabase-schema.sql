-- Tally Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('professor', 'ta', 'student', 'admin');
CREATE TYPE session_status AS ENUM ('pending', 'processing', 'processed', 'review_needed', 'approved');
CREATE TYPE contribution_type AS ENUM ('question', 'answer', 'build', 'challenge', 'insight', 'clarification', 'synthesis', 'off_topic');
CREATE TYPE question_type AS ENUM ('clarifying', 'analytical', 'challenge', 'application');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'professor',
  tenant_id UUID, -- For multi-tenancy
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenants table (institutions/organizations)
CREATE TABLE tenants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  term TEXT NOT NULL,
  section TEXT,
  meeting_times TEXT,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table (many-to-many: courses <-> students)
CREATE TABLE enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  external_student_id TEXT, -- For CSV imports
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);

-- Voice samples for speaker identification
CREATE TABLE voice_samples (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  audio_duration INTEGER, -- seconds
  embedding VECTOR(512), -- For voice recognition (if using pgvector)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table (class sessions)
CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  session_date DATE,
  duration_minutes INTEGER,
  notes TEXT,
  status session_status DEFAULT 'pending',
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  confidence_score DECIMAL(3,2), -- Overall confidence 0-1
  total_events INTEGER DEFAULT 0,
  students_analyzed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audio files for sessions
CREATE TABLE session_audio_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_url TEXT NOT NULL,
  mime_type TEXT,
  duration_seconds INTEGER,
  upload_completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Speaker segments from diarization
CREATE TABLE speaker_segments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  speaker_label TEXT NOT NULL, -- e.g., "Speaker_1", "Speaker_2"
  start_time DECIMAL(10,3) NOT NULL, -- seconds from start
  end_time DECIMAL(10,3) NOT NULL,
  transcript TEXT,
  confidence DECIMAL(3,2), -- ASR confidence
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Speaker to student mapping
CREATE TABLE speaker_student_mappings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  segment_id UUID REFERENCES speaker_segments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  confidence DECIMAL(3,2) NOT NULL, -- How confident we are in this mapping
  method TEXT, -- 'voice_similarity', 'name_mention', 'manual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participation events (processed segments)
CREATE TABLE participation_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  segment_ids UUID[], -- Array of speaker_segments IDs
  start_time DECIMAL(10,3) NOT NULL,
  end_time DECIMAL(10,3) NOT NULL,
  duration_seconds DECIMAL(6,3),
  transcript TEXT,
  contribution_type contribution_type,
  question_type question_type,
  base_score INTEGER DEFAULT 0,
  quality_score DECIMAL(3,2), -- 0-1
  confidence DECIMAL(3,2), -- Overall confidence in this event
  feedback_strengths TEXT,
  feedback_weaknesses TEXT,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session scores (aggregated per student per session)
CREATE TABLE session_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  participation_events_count INTEGER DEFAULT 0,
  frequency_score DECIMAL(5,2),
  quality_score DECIMAL(5,2),
  balance_score DECIMAL(5,2),
  session_participation_score DECIMAL(5,2), -- Final weighted score
  confidence_score DECIMAL(3,2), -- Confidence in this score
  ai_generated_feedback TEXT,
  instructor_notes TEXT,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- Course scores (aggregated per student per course)
CREATE TABLE course_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sessions_attended INTEGER DEFAULT 0,
  total_participation_events INTEGER DEFAULT 0,
  average_session_score DECIMAL(5,2),
  course_participation_score DECIMAL(5,2), -- 0-100 final grade
  trend TEXT, -- 'improving', 'stable', 'declining', 'concerning'
  instructor_adjustment DECIMAL(5,2) DEFAULT 0,
  final_score DECIMAL(5,2), -- After instructor adjustment
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);

-- Student feedback reports
CREATE TABLE feedback_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  report_period TEXT, -- 'midterm', 'final', 'session_3'
  overall_score DECIMAL(5,2),
  strengths TEXT[],
  improvement_areas TEXT[],
  recommendations TEXT,
  report_content TEXT, -- Full markdown/text report
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_to_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Score overrides/audit log
CREATE TABLE score_overrides (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_score_id UUID REFERENCES session_scores(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  field_name TEXT NOT NULL, -- 'session_participation_score', 'is_approved', etc.
  old_value TEXT,
  new_value TEXT,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course teaching assistants (many-to-many)
CREATE TABLE course_tas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  ta_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{}',
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, ta_id)
);

-- Create indexes for performance
CREATE INDEX idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX idx_courses_tenant_id ON courses(tenant_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_sessions_course_id ON sessions(course_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_speaker_segments_session_id ON speaker_segments(session_id);
CREATE INDEX idx_participation_events_session_id ON participation_events(session_id);
CREATE INDEX idx_participation_events_student_id ON participation_events(student_id);
CREATE INDEX idx_session_scores_session_id ON session_scores(session_id);
CREATE INDEX idx_session_scores_student_id ON session_scores(student_id);
CREATE INDEX idx_course_scores_course_id ON course_scores(course_id);
CREATE INDEX idx_course_scores_student_id ON course_scores(student_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_audio_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaker_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaker_student_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE participation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tas ENABLE ROW LEVEL SECURITY;