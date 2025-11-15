-- Sample Data for Testing Tally Application
-- Run this AFTER running schema and RLS policies

-- Insert a test tenant
INSERT INTO tenants (id, name, domain) VALUES 
('11111111-1111-1111-1111-111111111111', 'UVA Darden School of Business', 'darden.virginia.edu');

-- Note: Profiles will be created automatically via the trigger when users sign up
-- But we can insert sample courses and enrollments for testing

-- Insert sample courses (you'll need to replace instructor_id with actual user IDs from auth.users)
-- For now, using placeholder UUIDs - replace these with real user IDs after signup

INSERT INTO courses (id, tenant_id, instructor_id, name, term, section, meeting_times, description) VALUES 
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Strategic Management MBA', 'Fall 2024', 'Section A', 'MWF 10:00-11:00 AM', 'Advanced strategic management course focused on case-based learning'),
('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Business Ethics', 'Fall 2024', 'Section B', 'TTH 2:00-3:30 PM', 'Ethical decision making in business contexts');

-- Insert sample students (these would normally come from CSV upload)
INSERT INTO enrollments (course_id, student_id, student_name, student_email, external_student_id) VALUES 
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'John Smith', 'john.smith@darden.virginia.edu', 'STU001'),
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444445', 'Sarah Johnson', 'sarah.j@darden.virginia.edu', 'STU002'),
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444446', 'Michael Chen', 'm.chen@darden.virginia.edu', 'STU003'),
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444447', 'Emily Davis', 'emily.davis@darden.virginia.edu', 'STU004'),
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444448', 'David Wilson', 'd.wilson@darden.virginia.edu', 'STU005');

-- Insert sample sessions
INSERT INTO sessions (id, course_id, name, session_date, duration_minutes, notes, status, confidence_score, total_events, students_analyzed) VALUES 
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Strategic Management - Week 3', '2024-11-14', 75, 'Discussion of Porter\'s Five Forces framework', 'processed', 0.87, 156, 42),
('55555555-5555-5555-5555-555555555556', '22222222-2222-2222-2222-222222222222', 'Case Discussion - Market Entry', '2024-11-12', 90, 'Market entry strategy case study', 'review_needed', 0.72, 134, 38);

-- Insert sample session scores
INSERT INTO session_scores (
  session_id, 
  student_id, 
  participation_events_count, 
  frequency_score, 
  quality_score, 
  balance_score, 
  session_participation_score, 
  confidence_score, 
  ai_generated_feedback, 
  is_flagged, 
  flag_reason, 
  is_approved
) VALUES 
('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 8, 85.0, 88.0, 92.0, 85.0, 0.92, 'Strong analytical contributions with good use of framework concepts. Effectively builds on others'' ideas.', false, null, true),
('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444445', 12, 95.0, 94.0, 75.0, 92.0, 0.88, 'Excellent insights and challenges to assumptions. Consider allowing more space for others to contribute.', true, 'Potential over-participation', false),
('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444446', 2, 35.0, 65.0, 98.0, 45.0, 0.65, 'Good quality questions when speaking. Encourage more frequent participation.', true, 'Low confidence in speaker identification', false),
('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444447', 6, 75.0, 92.0, 88.0, 88.0, 0.89, 'Excellent synthesis of ideas and practical applications. Well-balanced participation.', false, null, true),
('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444448', 4, 55.0, 78.0, 95.0, 68.0, 0.78, 'Thoughtful contributions when speaking. Consider increasing frequency of participation.', false, null, true);

-- Insert sample course scores (aggregated)
INSERT INTO course_scores (
  course_id, 
  student_id, 
  sessions_attended, 
  total_participation_events, 
  average_session_score, 
  course_participation_score, 
  trend, 
  final_score
) VALUES 
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 12, 89, 85.0, 85.0, 'improving', 85.0),
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444445', 12, 134, 92.0, 92.0, 'stable', 92.0),
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444446', 11, 23, 68.0, 68.0, 'concerning', 68.0),
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444447', 12, 98, 88.0, 88.0, 'improving', 88.0),
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444448', 12, 45, 75.0, 75.0, 'stable', 75.0);

-- Insert sample participation events
INSERT INTO participation_events (
  id,
  session_id, 
  student_id, 
  start_time, 
  end_time, 
  duration_seconds, 
  transcript, 
  contribution_type, 
  question_type, 
  base_score, 
  quality_score, 
  confidence, 
  feedback_strengths, 
  feedback_weaknesses, 
  word_count
) VALUES 
('77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 754.2, 768.5, 14.3, 'How does this strategy align with Porter''s five forces framework, particularly regarding competitive rivalry?', 'question', 'analytical', 3, 0.95, 0.95, 'Excellent use of framework terminology and analytical thinking', 'Could elaborate more on specific competitive factors', 18),
('77777777-7777-7777-7777-777777777778', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 1396.1, 1409.8, 13.7, 'I agree with Sarah''s point about market timing, and I''d add that the regulatory environment in emerging markets creates additional barriers that need to be factored into the analysis.', 'build', null, 2, 0.89, 0.89, 'Good building on peer insights with additional analytical depth', 'Could provide specific examples', 34),
('77777777-7777-7777-7777-777777777779', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444445', 502.3, 521.7, 19.4, 'The cultural factors in emerging markets are often completely overlooked in traditional strategic analysis. We''re applying Western frameworks to non-Western contexts without considering local business practices.', 'insight', null, 4, 0.94, 0.94, 'Original thinking that challenges conventional approaches', 'None identified', 32),
('77777777-7777-7777-7777-777777777780', '55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444445', 2712.4, 2724.9, 12.5, 'I''m not convinced that the data presented supports that conclusion. The market penetration rates shown are from 2019 - pre-pandemic dynamics could be completely different now.', 'challenge', 'challenge', 3, 0.82, 0.82, 'Good critical analysis and attention to data currency', 'Could suggest alternative data sources', 28);

-- Insert sample feedback reports
INSERT INTO feedback_reports (
  course_id, 
  student_id, 
  report_period, 
  overall_score, 
  strengths, 
  improvement_areas, 
  recommendations, 
  report_content, 
  sent_at, 
  sent_to_email
) VALUES 
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'midterm', 85.0, 
 ARRAY['Analytical thinking', 'Building on others'' ideas'], 
 ARRAY['Voice projection', 'Frequency of participation'], 
 'Continue your positive momentum and consider taking on more challenging discussion points',
 '# Participation Report for John Smith

## Overall Performance  
Your current participation score: **85/100**

## Session Summary
- Sessions attended: 12
- Total contributions: 89
- Average contributions per session: 7

## Strengths
- Analytical thinking
- Building on others'' ideas

## Areas for Growth  
- Voice projection
- Frequency of participation

## Recommendations
Based on your participation pattern, we suggest:
- Continue your positive momentum
- Consider taking on more challenging discussion points

Your participation adds value to our class discussions. Keep up the great work!', 
 '2024-10-15 14:30:00+00', 'john.smith@darden.virginia.edu'),
 
('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444446', 'midterm', 68.0, 
 ARRAY['Thoughtful questions', 'Active listening'], 
 ARRAY['Speaking up more frequently', 'Confidence building'], 
 'Aim to contribute at least 2-3 times per session and prepare 1-2 questions before class',
 '# Participation Report for Michael Chen

## Overall Performance  
Your current participation score: **68/100**

## Session Summary
- Sessions attended: 11  
- Total contributions: 23
- Average contributions per session: 2

## Strengths
- Thoughtful questions
- Active listening

## Areas for Growth
- Speaking up more frequently  
- Confidence building

## Recommendations
Based on your participation pattern, we suggest:
- Aim to contribute at least 2-3 times per session
- Prepare 1-2 questions or insights before class

Your participation adds value to our class discussions. Keep up the great work!', 
 null, null);