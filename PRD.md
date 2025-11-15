PRD: “Tally” – Voice-Aware Participation Grading for Professors

1. Product Overview

1.1 Context

Team: MBA students at UVA Darden participating in an AI hackathon (Claude Competition).

Track: Teacher – tools to make instructors more efficient and effective.

Target setting: Discussion-heavy courses (e.g., MBA, law, seminar-style undergrad), but extensible to any class with meaningful verbal participation.

1.2 Problem

Professors and TAs currently manage participation using:

Memory and gut feel

Handwritten notes or tally sheets

Ad-hoc Excel sheets

Canvas/ LMS grade columns disconnected from real classroom events

This leads to:

High administrative burden (after-class reconstruction of who spoke and how)

Subjective & inconsistent grading that can feel unfair to students

Equity issues: loud voices dominate; quieter or marginalized students are missed

Weak feedback: students rarely get actionable guidance about how they’re showing up in class

At the same time, classes increasingly generate rich audio data (mic’d classrooms, Zoom recordings, lecture capture), and universities already collect student voice recordings for other reasons (name pronunciation tools, language courses, etc.). That data is mostly unused for pedagogy.

1.3 Vision

Create a multi-tenant participation platform that:

Ingests class audio (live or recorded)

Recognizes who is speaking and how they are contributing

Generates fair, explainable participation grades plus actionable feedback

Lets teachers review, adjust, and audit the AI’s judgments

Feeds final grades and feedback back into Canvas or another LMS or even go off a student email list to distribute via email to students.

Core principle:

Increase fairness and reduce busywork without turning participation into a stressful, gamified contest. Feedback should support learning, not fuel anxiety.

2. Goals & Success Metrics

2.1 Primary Goals

Reduce time spent on participation grading

Professors spend far less time reconstructing participation after class.

Improve fairness and transparency

Participation grading is more consistent and backed by observable data.

Provide constructive, low-anxiety feedback

Students get concrete, periodic feedback about their classroom presence, not a surprise number at the end.

Fit seamlessly into the professor’s workflow

Canvas-friendly, classroom-realistic (single laptop/tablet), and easy to review.

2.2 Example Success Metrics (for later evaluation)

↓ 50–75% reduction in time professors report spending on participation grading.

↑ student perception of fairness (e.g., survey: “My participation grade reflects my contribution”).

≥ 80% of AI-proposed scores remain unchanged after instructor review.

≤ 10% of students report increased anxiety attributable to the tool (goal is neutral or positive impact on perceived classroom climate).

Improve quality of classroom discussion over time through the actionable feedback being constructive and find their voice in the classroom.

3. Users & Personas

3.1 Primary Users

Professor / Instructor

Owns final participation grades.

Needs efficient, explainable data and easy overrides.

Teaching Assistant (TA)

Helps manage larger sections.

Uses dashboard to review sessions, flag issues, propose grade adjustments.

3.2 Secondary Users

Student

Receives participation scores and qualitative feedback in a healthy, non-competitive way and report potential issues back to the AI and teaching staff.

Institution / Program Administrator (future)

Cares about equity, consistency across sections, and adoption.

4. Scope

4.1 In-Scope for Initial Build (Hackathon MVP)

Multi-tenant web app with:

Teacher/TA login and course/session management.

Upload of recorded class audio (one file per session) as the main ingestion path.

Pipeline that, given:

Audio + roster + optional student name audio samples,

Produces per-student participation events, scores, and confidence levels.

Basic taxonomy-based scoring (question types, contribution value, frequency).

Instructor/TA review & audit UI for each session:

View scores, see example utterances or transcripts, adjust grades, confirm or override.

Canvas-compatible grade export (CSV and simple LMS API stub).

Student-facing: read-only participation summary at configurable intervals (e.g., mid-term + end-of-term, or after a given session).

Real-time, in-class participation monitoring via live mic/stream.

Rich Canvas integration (OAuth, assignments mapping, automatic grade sync).

More advanced analytics (equity dashboards, cohort comparisons, heatmap based on seating chart).

Multi-course, multi-semester analytics.

5. Core Use Cases

Professor uploads class audio after a session and gets a first-pass participation analysis by student.

TA reviews AI scores, adjusts outliers, and approves final participation scores for the session.

Professor sees a dashboard of participation patterns over multiple sessions (who is quiet, who dominates).

At mid-term and end-of-term, professor exports a participation grade + feedback for each student to Canvas.

Student sees a private, periodic summary of their participation and qualitative feedback, without constant gamified metrics.

6. Functional Requirements

6.1 Authentication & Multi-Tenancy

FR-1: Support user accounts with roles: Professor, TA, Student, Admin.

FR-2: Support tenants (e.g., “Darden School of Business”) so different institutions are logically separated.

FR-3: Data from one tenant must not be visible to another.

FR-4: Professors can invite TAs and assign them to specific courses.

6.2 Course & Roster Management

FR-5: Professors can create a course with: name, term, section, meeting times.

FR-6: Professors can add students via:

CSV upload with: name, email, student ID, optional Canvas ID.

(Future) LMS integration/roster import.

FR-7: Professors can associate student voice samples when available:

Upload audio files per student (e.g. from university pronunciation system).

Or students can record their own name via a simple web recorder.

6.3 Session Management & Audio Ingestion

FR-8: For each course, professors can create sessions (e.g., “Session 3 – Pricing Case”).

FR-9: For each session, professors/ TAs can:

Upload one or more audio files (e.g., classroom mic recording, Zoom audio export).

Provide metadata: date, duration, room, notes.

FR-10 (stretch): Optionally mark approximate seating chart or “who usually sits where” to help with verification (not required for MVP).

6.4 Audio Processing & Participation Extraction

FR-11: System must process audio and output:

Transcripts with timestamps.

Speaker segments (who spoke at what time, if known; otherwise an anonymous ID like Speaker_1, Speaker_2).

FR-12: System attempts to map speakers to students using:

Voice similarity between class audio and stored voice samples.

Name mentions in the transcript:

When professor says “Jimmy, what do you think?”

When peers mention “I agree with Jimmy.”

FR-13: For each possible student-speaker match, system calculates a confidence score (0–1 or 0–100%).

FR-14: System creates Participation Events:

Attributes:

student_id (or unknown if low confidence)

start time, end time

raw transcript text

detected speech act type (e.g., question, answer, build, disagreement, off-topic)

length (seconds, word count)

6.5 Participation Scoring Engine

FR-15: Define a participation taxonomy (MVP example):

Question types:

Clarifying question

Probing/analytical question

Challenge/disagreement with reasoning

Example / anecdote / application question

Contribution types:

New insight

Building on others’ points

Summarizing / synthesizing

Off-topic / distractor

FR-16: For each Participation Event, assign:

question_type (if applicable)

contribution_type

base_score (e.g., +1, +2, +3) based on type and length

quality_score inferred from content (coherence, reference to case/reading, reasoning markers, etc.)

feedback_strength detailing strong points of participation event

feedback_weakness detailing weak points of participation event

FR-17: For each student per session, aggregate into:

frequency_score (how often they participate)

quality_score (average/weighted quality)

balance_score (avoid extreme domination)

feedback_strengths (qualitative summary of strong points in participation)

feedback_weaknesses (qualitative areas where there is room for improvement, and what they can do to improve)

FR-18: For each student per session, compute:

session_participation_score = weighted combination of frequency, quality, balance.

confidence_score for that overall score (derived from how many events, how reliably speaker was identified, classification certainty)

FR-19: Define configurable scoring weights per course:

Professor can set how much to weigh frequency vs. quality vs. different question types (MVP: simple presets; later: full custom).

6.6 Instructor & TA Review / Audit

FR-20: For each session, Professors/TAs see a review dashboard with:

List of students and their proposed session_participation_score and confidence

Flags:

Low confidence scores (below a configurable threshold).

Outliers vs. that student’s prior sessions (e.g., huge jump/drop).

FR-21: Professors/TAs can:

Click into a student’s row to see their events for that session:

Snippets of transcript

Audio clip preview (short samples)

Assigned types (question/insight/etc.).

Adjust the session score (increase/decrease or override).

Mark events as:

Correct

Misattributed

Needs exclusion (noise / off-mic / misunderstood).

Adjust qualitative feedback being returned to students

Allowed to view and download the full transcript as needed.

Allow a dual screen view of transcript and student analysis with student engagement highlighted on the transcript

Allow professor to click quotes within the student analysis which triggers the dual transcript view with highlights, showing the clicked quote location.

Allow a dual screen view of the transcript and overall class analysis.

Allow professor to click quotes within the overall class analysis to trigger the opening of the transcript at the location of the quote with it highlighted.

FR-22: Every manual adjustment is logged:

who changed the score,

from → to,

reason (optional note),

timestamp.

FR-23: Once satisfied, Professor/TA can lock the session so scores are ready for aggregation.

6.7 Longitudinal Dashboard for Professors

FR-24: For each course, show a multi-session view:

For each student:

Trend line of participation scores over time.

Count of sessions with zero participation events detected.

Class-level metrics:

Distribution of participation scores.

Ratio of high/medium/low participation students.

FR-25: Provide quick views to answer:

“Who is consistently quiet?”

“Who tends to dominate?”

“Who improved significantly after mid-term feedback?”

6.8 Feedback Cadence & Student Experience

Principles:

Avoid constant competitive leaderboards.

Make feedback private, periodic, and formative.

FR-26: Professors can configure feedback cadence per course:

At least:

Mid-term + End-of-term (default).

Optional: Every N sessions (e.g., every 3–4 classes).

FR-27: For each feedback checkpoint, system generates student-facing summaries:

A simple statement of where they stand:

e.g., “On track,” “Slightly below expectation,” “Exceeds expectation,” rather than raw numeric scores only.

2–3 bullet suggestions tailored from their event patterns:

“You often ask clarifying questions; next step is to offer your own perspective.”

“You contribute frequently; focus on synthesizing and inviting others in.”

FR-28: Students access feedback via:

A secure link (SAML/SSO or emailed magic link)

Or via LMS integration (Canvas assignment comments / gradebook notes).

FR-29: Students should not be allowed to see the placement of other students, whether above or below their own placing

6.9 Grade Aggregation & Canvas Export

FR-30: For each course, system aggregates session_participation_scores into:

course_participation_score per student (e.g., 0–100).

FR-31: Professors can:

Adjust final course participation score per student (with audit log).

Export grades in:

CSV with columns: student ID, name, email, final participation score.

(Future) push via Canvas API to a specific assignment.

FR-32: Along with numeric grade, system prepares a short qualitative comment using patterns across sessions, which the professor can edit.

7. AI / ML System Design (Conceptual)

7.1 Pipeline Overview

Audio Ingestion

Accept WAV/MP3/MP4 audio.

Automatic Speech Recognition (ASR)

Use an external ASR service to produce timestamped transcripts.

Speaker Diarization

Segment audio into consistent “speaker turns” (Speaker_1, Speaker_2, etc.).

Speaker Identification / Student Mapping

Use stored voice embeddings from student name recordings + diarized segments.

Use text analysis to detect name mentions in transcripts and map them to roster entries.

Combine both signals to compute a probability distribution over which student each speaker is.

Utterance Classification

Use Claude (or another LLM) on each segment’s transcript to classify:

Question / answer / build / disagreement / etc.

Topical vs. off-topic.

Quality markers (reasoning, reference to readings/case, clarity).

Scoring & Aggregation

Convert classified events into per-student scores per session.

Compute confidence levels at event and aggregated levels.

Human-in-the-Loop Review

Present scores + key evidence to Professors/TAs.

Collect overrides, corrections, and use those signals to iteratively calibrate thresholds and heuristics.

7.2 Confidence Scoring

Event-level confidence factors:

Speaker → student mapping probability.

Transcript reliability (ASR confidence).

Model certainty on classification.

Aggregate (session) confidence:

Combination of event confidences + number of events.

If few events or low speaker ID certainty, flag as low confidence.

Any score with confidence below threshold T must be:

Visibly flagged in dashboards.

Highlighted during instructor review.

8. Data Model (High-Level)

Entities (conceptual, not schema-exact):

Tenant (institution / program)

User (Professor, TA, Student, Admin)

Course

Enrollment (Course ←→ Student mapping)

Session

AudioFile (linked to Session)

VoiceSample (Student ↔ voice reference)

SpeakerSegment (start_time, end_time, raw text, speaker_id)

SpeakerStudentLink (segment ↔ student + confidence)

ParticipationEvent (subset of one or more segments)

SessionScore (per student, per session)

CourseScore (per student, per course)

FeedbackSummary (per student, per checkpoint)

ScoreOverride (who changed what, when, why)

9. Non-Functional Requirements

9.1 Performance

MVP: It is acceptable if processing a 60–90 minute class takes several minutes, asynchronous with email/in-app notification when ready.

Real-time is a stretch goal.

9.2 Privacy & Compliance

Treat all audio and scores as sensitive educational records (FERPA).

Ensure:

Tenant-level isolation.

Encrypted storage and transport.

Clear messaging: “This tool assists the instructor; it does not replace their judgment.”

9.3 Reliability

If audio fails to process, surface clear errors and allow re-upload.

Partial processing (e.g., low quality audio) should still return best-effort results with low confidence and flags.

9.4 Bias & Fairness

Explicitly warn that:

Accents, mic distance, and other factors may disadvantage some students.

Design UX for instructor review before final grades are exported.

Make heuristics transparent where possible.

10. Risks & Mitigations

Voice recognition errors → unfair scores

Mitigation: confidence scores, mandatory review for low-confidence cases, ability to override.

Faculty resistance (too complex / too opaque)

Mitigation: keep UI simple; show few, clear metrics; surface concrete examples (transcript snippets, audio clips).

Student anxiety / competitiveness

Mitigation: no leaderboards, infrequent and private feedback, message tool as support for fairness and growth.

Audio quality variability

Mitigation: include basic checks and guidance (“use central mic,” “avoid extreme background noise”), handle partial transcripts gracefully.

11. Open Questions (To Decide as You Build)

You can leave these in the doc and make quick decisions during the hackathon:

How granular should the taxonomy be for MVP?

Start simple (3–4 contribution types, 2–3 question types) vs. go richer?

Default feedback cadence?

Recommend: Build to be able to do every session, but it may not be valuable to deliver to students every class

What exact stack?

Likely:

Frontend: React/Next.js (vercel)

Backend: Node/Express or Python/FastAPI (Free Render plan if it’s necessary)

DB: Postgres (Supabase)

ASR: 3rd-party API

LLM: Claude for classification & feedback text

Do we let students opt-out / control visibility in MVP?

At least clearly message to professors that they should get student consent per institutional guidelines.
