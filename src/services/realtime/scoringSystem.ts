import React from 'react';
import { UserProfile, Job } from '../../types/data';
import { calculateMatchScore, findBestJobMatches, JobMatch } from '../api/candidateMatchingEngine';

// Event types for real-time updates
export interface ScoringUpdateEvent {
  type: 'PROFILE_UPDATED' | 'JOB_UPDATED' | 'SCORES_RECALCULATED';
  candidateId?: string;
  jobId?: string;
  data: any;
}

// Real-time scoring system
export class RealTimeScoringSystem {
  private static instance: RealTimeScoringSystem;
  private listeners: Map<string, ((event: ScoringUpdateEvent) => void)[]> = new Map();
  private candidateScores: Map<string, Map<string, number>> = new Map(); // candidateId -> jobId -> score
  private jobMatches: Map<string, JobMatch[]> = new Map(); // candidateId -> matches
  
  static getInstance(): RealTimeScoringSystem {
    if (!this.instance) {
      this.instance = new RealTimeScoringSystem();
    }
    return this.instance;
  }
  
  /**
   * Subscribe to real-time scoring updates
   */
  subscribe(eventType: string, callback: (event: ScoringUpdateEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    this.listeners.get(eventType)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }
  
  /**
   * Emit event to all subscribers
   */
  private emit(event: ScoringUpdateEvent) {
    const callbacks = this.listeners.get(event.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in scoring system callback:', error);
        }
      });
    }
  }
  
  /**
   * Recalculate scores when candidate profile is updated
   */
  async updateCandidateProfile(candidate: UserProfile, jobs: Job[]): Promise<void> {
    console.log(`Recalculating scores for ${candidate.firstName} ${candidate.lastName}...`);
    
    // Calculate new scores for all jobs
    const candidateJobScores = new Map<string, number>();
    
    for (const job of jobs) {
      const matchResult = calculateMatchScore(job, candidate);
      candidateJobScores.set(job.id, matchResult.score);
    }
    
    // Update stored scores
    this.candidateScores.set(candidate.id, candidateJobScores);
    
    // Update job matches
    const jobMatches = findBestJobMatches(candidate, jobs);
    this.jobMatches.set(candidate.id, jobMatches);
    
    // Emit update event
    this.emit({
      type: 'PROFILE_UPDATED',
      candidateId: candidate.id,
      data: {
        candidate,
        scores: Object.fromEntries(candidateJobScores),
        jobMatches
      }
    });
    
    // Simulate processing delay for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.emit({
      type: 'SCORES_RECALCULATED',
      candidateId: candidate.id,
      data: {
        candidate,
        updatedScores: Object.fromEntries(candidateJobScores),
        timestamp: new Date().toISOString()
      }
    });
  }
  
  /**
   * Recalculate scores when job is updated
   */
  async updateJob(job: Job, candidates: UserProfile[]): Promise<void> {
    console.log(`Recalculating scores for job: ${job.title}...`);
    
    const jobCandidateScores = new Map<string, number>();
    
    for (const candidate of candidates) {
      const matchResult = calculateMatchScore(job, candidate);
      jobCandidateScores.set(candidate.id, matchResult.score);
      
      // Update candidate's job scores
      if (!this.candidateScores.has(candidate.id)) {
        this.candidateScores.set(candidate.id, new Map());
      }
      this.candidateScores.get(candidate.id)!.set(job.id, matchResult.score);
    }
    
    this.emit({
      type: 'JOB_UPDATED',
      jobId: job.id,
      data: {
        job,
        candidateScores: Object.fromEntries(jobCandidateScores)
      }
    });
  }
  
  /**
   * Get current score for a candidate-job pair
   */
  getScore(candidateId: string, jobId: string): number | null {
    const candidateScores = this.candidateScores.get(candidateId);
    if (candidateScores) {
      return candidateScores.get(jobId) || null;
    }
    return null;
  }
  
  /**
   * Get all scores for a candidate
   */
  getCandidateScores(candidateId: string): Map<string, number> | null {
    return this.candidateScores.get(candidateId) || null;
  }
  
  /**
   * Get job matches for a candidate
   */
  getJobMatches(candidateId: string): JobMatch[] | null {
    return this.jobMatches.get(candidateId) || null;
  }
  
  /**
   * Simulate real-time skill addition for demo
   */
  async simulateSkillAddition(candidate: UserProfile, newSkill: string, jobs: Job[]): Promise<void> {
    // Add the new skill
    const updatedCandidate = {
      ...candidate,
      skills: [...(candidate.skills || []), newSkill],
      updatedAt: new Date().toISOString()
    };
    
    // Recalculate scores
    await this.updateCandidateProfile(updatedCandidate, jobs);
  }
  
  /**
   * Simulate real-time experience update for demo
   */
  async simulateExperienceUpdate(
    candidate: UserProfile, 
    additionalYears: number, 
    jobs: Job[]
  ): Promise<void> {
    const updatedCandidate = {
      ...candidate,
      yearsOfExperience: (candidate.yearsOfExperience || 0) + additionalYears,
      updatedAt: new Date().toISOString()
    };
    
    await this.updateCandidateProfile(updatedCandidate, jobs);
  }
  
  /**
   * Clear all stored data
   */
  clearAllData(): void {
    this.candidateScores.clear();
    this.jobMatches.clear();
  }
  
  /**
   * Get scoring statistics
   */
  getStatistics(): {
    totalCandidates: number;
    totalScores: number;
    averageScore: number;
    highScoreCandidates: number;
  } {
    let totalScores = 0;
    let scoreSum = 0;
    let highScoreCount = 0;
    
    this.candidateScores.forEach((jobScores) => {
      jobScores.forEach((score) => {
        totalScores++;
        scoreSum += score;
        if (score >= 80) highScoreCount++;
      });
    });
    
    return {
      totalCandidates: this.candidateScores.size,
      totalScores,
      averageScore: totalScores > 0 ? Math.round(scoreSum / totalScores) : 0,
      highScoreCandidates: highScoreCount
    };
  }
}

// Export singleton instance
export const scoringSystem = RealTimeScoringSystem.getInstance();

// React hook for real-time scoring updates
export function useRealTimeScoring() {
  const [scores, setScores] = React.useState<Map<string, Map<string, number>>>(new Map());
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [lastUpdate, setLastUpdate] = React.useState<Date | null>(null);
  
  React.useEffect(() => {
    const unsubscribeProfile = scoringSystem.subscribe('PROFILE_UPDATED', (event) => {
      setIsUpdating(true);
      // Update will complete when SCORES_RECALCULATED is received
    });
    
    const unsubscribeScores = scoringSystem.subscribe('SCORES_RECALCULATED', (event) => {
      setIsUpdating(false);
      setLastUpdate(new Date());
      // Force re-render to pick up new scores
      setScores(new Map(scoringSystem['candidateScores']));
    });
    
    const unsubscribeJob = scoringSystem.subscribe('JOB_UPDATED', (event) => {
      setLastUpdate(new Date());
      setScores(new Map(scoringSystem['candidateScores']));
    });
    
    return () => {
      unsubscribeProfile();
      unsubscribeScores();
      unsubscribeJob();
    };
  }, []);
  
  return {
    scores,
    isUpdating,
    lastUpdate,
    updateCandidate: scoringSystem.updateCandidateProfile.bind(scoringSystem),
    updateJob: scoringSystem.updateJob.bind(scoringSystem),
    getScore: scoringSystem.getScore.bind(scoringSystem),
    getCandidateScores: scoringSystem.getCandidateScores.bind(scoringSystem),
    getJobMatches: scoringSystem.getJobMatches.bind(scoringSystem),
    simulateSkillAddition: scoringSystem.simulateSkillAddition.bind(scoringSystem),
    simulateExperienceUpdate: scoringSystem.simulateExperienceUpdate.bind(scoringSystem)
  };
}

export default scoringSystem;
