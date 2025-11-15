# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tally** is a voice-aware participation grading platform for professors that automates the assessment of student classroom participation through AI-powered audio analysis. The platform is designed for discussion-heavy courses (MBA, law, seminar-style) and aims to reduce administrative burden while improving fairness and providing actionable feedback to students.

## Tech Stack (Target)

- **Frontend**: React with Vite
- **Backend**: Node.js/Express or Python/FastAPI
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (frontend), Render (backend if needed)
- **AI Services**: Claude for classification & feedback, external ASR service for speech recognition
- **Audio Processing**: Speaker diarization and voice identification

## Core Architecture

### Multi-Tenant System
- Tenant isolation (different institutions)
- User roles: Professor, TA, Student, Admin
- Course and session management per tenant

### Audio Processing Pipeline
1. **Audio Ingestion**: Upload recorded class audio (WAV/MP3/MP4)
2. **Speech Recognition**: External ASR service for timestamped transcripts
3. **Speaker Diarization**: Segment audio into speaker turns
4. **Speaker Identification**: Map speakers to students using voice samples and name mentions
5. **Participation Analysis**: Classify contributions (questions, insights, builds, etc.)
6. **Scoring & Aggregation**: Generate participation scores with confidence levels
7. **Human Review**: Professor/TA approval and override system

### Key Workflows

#### Professor Workflow
1. Create course and upload student roster (CSV)
2. Upload audio recordings after each class
3. Review AI-generated participation scores
4. Adjust scores and approve final results
5. Export grades to Canvas or email individual reports

#### Student Experience
- Periodic, private feedback reports (mid-term, end-term)
- Actionable suggestions for improvement
- No competitive leaderboards or constant scoring

## Core Data Models

- **Tenant**: Institution/program isolation
- **User**: Multi-role authentication
- **Course**: Course management with roster
- **Session**: Individual class sessions with audio
- **ParticipationEvent**: Individual speaking events with classification
- **SessionScore**: Per-student, per-session aggregated scores
- **CourseScore**: Final participation grades
- **FeedbackSummary**: Student-facing reports

## Development Commands (To Be Implemented)

Based on the target stack:

```bash
# Frontend (React + Vite)
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build

# Backend (when implemented)
npm start           # Production server
npm run dev         # Development with hot reload
npm test           # Run tests

# Database
# Supabase migrations and seeding commands TBD
```

## Key Features to Implement

### MVP Phase (30-minute demo target)
1. **Authentication & Multi-tenancy**: Basic login for instructors
2. **Roster Management**: CSV upload of student lists
3. **Audio Upload**: Post-class audio file upload
4. **AI Processing**: Basic participation analysis pipeline
5. **Review Interface**: Simple score review and approval
6. **Student Reports**: Individual feedback generation and email distribution

### Advanced Features
- Real-time participation monitoring
- Canvas LMS integration
- Advanced analytics dashboards
- Equity and bias monitoring
- Multi-semester analytics

## Privacy & Compliance Considerations

- FERPA compliance for educational records
- Encrypted storage and transport
- Tenant-level data isolation
- Clear consent messaging for audio recording
- Bias detection and mitigation features

## Critical Success Metrics

- 50-75% reduction in participation grading time
- 80%+ AI accuracy rate (scores unchanged after review)
- Improved fairness perception from students
- Minimal impact on classroom anxiety (<10% negative feedback)

## Development Priorities

1. **Core Pipeline**: Audio → Transcription → Speaker ID → Classification → Scoring
2. **Review Interface**: Clean, efficient instructor dashboard
3. **Confidence Scoring**: Flag low-confidence results for human review
4. **Feedback Generation**: Actionable, constructive student reports
5. **Integration**: Canvas export and email distribution

## Open Technical Decisions

- ASR service selection (accuracy vs. cost)
- Speaker identification approach (voice embeddings vs. text analysis)
- Real-time vs. batch processing architecture
- Confidence threshold calibration
- Participation taxonomy granularity (3-4 types vs. more detailed)

## Notes for Implementation

- Start with batch processing (async with notifications)
- Emphasize instructor control and override capabilities
- Design for graceful degradation with poor audio quality
- Build transparent, explainable AI decisions
- Prioritize simple, clean UI over feature complexity