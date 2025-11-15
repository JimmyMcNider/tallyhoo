-- Row Level Security Policies for Tally
-- Run this AFTER running supabase-schema.sql

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by same tenant" ON profiles
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Tenants RLS Policies  
CREATE POLICY "Users can view their tenant" ON tenants
  FOR SELECT USING (
    id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Courses RLS Policies
CREATE POLICY "Instructors can manage their courses" ON courses
  FOR ALL USING (instructor_id = auth.uid());

CREATE POLICY "TAs can view assigned courses" ON courses
  FOR SELECT USING (
    id IN (
      SELECT course_id FROM course_tas WHERE ta_id = auth.uid()
    )
  );

CREATE POLICY "Students can view enrolled courses" ON courses
  FOR SELECT USING (
    id IN (
      SELECT course_id FROM enrollments WHERE student_id = auth.uid()
    )
  );

-- Enrollments RLS Policies
CREATE POLICY "Course instructors can manage enrollments" ON enrollments
  FOR ALL USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

CREATE POLICY "Course TAs can view enrollments" ON enrollments
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM course_tas WHERE ta_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own enrollment" ON enrollments
  FOR SELECT USING (student_id = auth.uid());

-- Voice Samples RLS Policies
CREATE POLICY "Students can manage own voice samples" ON voice_samples
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Course instructors can view voice samples" ON voice_samples
  FOR SELECT USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

-- Sessions RLS Policies
CREATE POLICY "Course instructors can manage sessions" ON sessions
  FOR ALL USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

CREATE POLICY "Course TAs can view sessions" ON sessions
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM course_tas WHERE ta_id = auth.uid()
    )
  );

CREATE POLICY "Students can view sessions for enrolled courses" ON sessions
  FOR SELECT USING (
    course_id IN (
      SELECT course_id FROM enrollments WHERE student_id = auth.uid()
    )
  );

-- Session Audio Files RLS Policies
CREATE POLICY "Course instructors can manage audio files" ON session_audio_files
  FOR ALL USING (
    session_id IN (
      SELECT s.id FROM sessions s 
      JOIN courses c ON s.course_id = c.id 
      WHERE c.instructor_id = auth.uid()
    )
  );

-- Speaker Segments RLS Policies
CREATE POLICY "Course instructors can view speaker segments" ON speaker_segments
  FOR SELECT USING (
    session_id IN (
      SELECT s.id FROM sessions s 
      JOIN courses c ON s.course_id = c.id 
      WHERE c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Course TAs can view speaker segments" ON speaker_segments
  FOR SELECT USING (
    session_id IN (
      SELECT s.id FROM sessions s 
      JOIN course_tas ct ON s.course_id = ct.course_id 
      WHERE ct.ta_id = auth.uid()
    )
  );

-- Speaker Student Mappings RLS Policies
CREATE POLICY "Course instructors can manage speaker mappings" ON speaker_student_mappings
  FOR ALL USING (
    segment_id IN (
      SELECT ss.id FROM speaker_segments ss
      JOIN sessions s ON ss.session_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE c.instructor_id = auth.uid()
    )
  );

-- Participation Events RLS Policies
CREATE POLICY "Course instructors can view participation events" ON participation_events
  FOR SELECT USING (
    session_id IN (
      SELECT s.id FROM sessions s 
      JOIN courses c ON s.course_id = c.id 
      WHERE c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own participation events" ON participation_events
  FOR SELECT USING (student_id = auth.uid());

-- Session Scores RLS Policies
CREATE POLICY "Course instructors can manage session scores" ON session_scores
  FOR ALL USING (
    session_id IN (
      SELECT s.id FROM sessions s 
      JOIN courses c ON s.course_id = c.id 
      WHERE c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Course TAs can view session scores" ON session_scores
  FOR SELECT USING (
    session_id IN (
      SELECT s.id FROM sessions s 
      JOIN course_tas ct ON s.course_id = ct.course_id 
      WHERE ct.ta_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own session scores" ON session_scores
  FOR SELECT USING (student_id = auth.uid());

-- Course Scores RLS Policies
CREATE POLICY "Course instructors can manage course scores" ON course_scores
  FOR ALL USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own course scores" ON course_scores
  FOR SELECT USING (student_id = auth.uid());

-- Feedback Reports RLS Policies
CREATE POLICY "Course instructors can manage feedback reports" ON feedback_reports
  FOR ALL USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can view own feedback reports" ON feedback_reports
  FOR SELECT USING (student_id = auth.uid());

-- Score Overrides RLS Policies
CREATE POLICY "Course instructors can view score overrides" ON score_overrides
  FOR SELECT USING (
    session_score_id IN (
      SELECT ss.id FROM session_scores ss
      JOIN sessions s ON ss.session_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Only instructors and TAs can create score overrides" ON score_overrides
  FOR INSERT WITH CHECK (
    session_score_id IN (
      SELECT ss.id FROM session_scores ss
      JOIN sessions s ON ss.session_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE c.instructor_id = auth.uid()
    ) OR
    session_score_id IN (
      SELECT ss.id FROM session_scores ss
      JOIN sessions s ON ss.session_id = s.id
      JOIN course_tas ct ON s.course_id = ct.course_id
      WHERE ct.ta_id = auth.uid()
    )
  );

-- Course TAs RLS Policies
CREATE POLICY "Course instructors can manage TAs" ON course_tas
  FOR ALL USING (
    course_id IN (
      SELECT id FROM courses WHERE instructor_id = auth.uid()
    )
  );

CREATE POLICY "TAs can view their assignments" ON course_tas
  FOR SELECT USING (ta_id = auth.uid());

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_session_scores_updated_at BEFORE UPDATE ON session_scores
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_course_scores_updated_at BEFORE UPDATE ON course_scores
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();