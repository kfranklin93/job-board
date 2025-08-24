// src/demo/recommendationEngineDemo.ts
// Demonstration of the Daycare Staffing & Recommendation Engine

import { mockJobs } from '../../data/mockJobs';
import { mockJobSeekers } from '../../data/mockJobSeekers';
import { mockRecruiters } from '../../data/mockRecruiters';
import { calculateMatchScore } from '../../services/api/candidateMatchingEngine';
import { 
  getRecommendationsForJob, 
  generateStrengthsAndGaps, 
  generateRecommendationSummary 
} from '../../services/api/recommendationService';

console.log('🎯 DAYCARE STAFFING & RECOMMENDATION ENGINE DEMO');
console.log('================================================');

// Demo 1: Single Job Matching
console.log('\n📋 DEMO 1: Lead Preschool Teacher Position Matching');
console.log('---------------------------------------------------');

const leadTeacherJob = mockJobs.find(job => job.title === 'Lead Preschool Teacher')!;
console.log(`Job: ${leadTeacherJob.title} at ${leadTeacherJob.organizationName}`);
console.log(`Location: ${leadTeacherJob.location}`);
console.log(`Requirements: ${leadTeacherJob.requirements.join(', ')}`);

// Test individual candidate scores
console.log('\n🔍 Individual Candidate Scoring:');
mockJobSeekers.slice(0, 5).forEach(candidate => {
  const score = calculateMatchScore(leadTeacherJob, candidate);
  console.log(`${candidate.firstName} ${candidate.lastName}: ${score}% match`);
});

// Get top recommendations
const topCandidates = getRecommendationsForJob(leadTeacherJob, mockJobSeekers, 3);
console.log('\n🏆 Top 3 Recommendations:');
topCandidates.forEach((candidate, index) => {
  console.log(`${index + 1}. ${candidate.firstName} ${candidate.lastName} - ${candidate.matchScore}% match`);
  console.log(`   Experience: ${candidate.yearsOfExperience} years`);
  console.log(`   Current Role: ${candidate.jobTitle}`);
  console.log(`   Location: ${candidate.location}`);
});

// Demo 2: Detailed Analysis for Top Candidate
console.log('\n📊 DEMO 2: Detailed Analysis for Top Candidate');
console.log('----------------------------------------------');

const topCandidate = topCandidates[0];
console.log(`Analyzing: ${topCandidate.firstName} ${topCandidate.lastName}`);

const analysis = generateStrengthsAndGaps(leadTeacherJob, topCandidate);
console.log('\n✅ Strengths:');
analysis.strengths.forEach(strength => console.log(`  • ${strength}`));

console.log('\n⚠️ Potential Gaps:');
if (analysis.gaps.length === 0) {
  console.log('  • No significant gaps identified');
} else {
  analysis.gaps.forEach(gap => console.log(`  • ${gap}`));
}

// Demo 3: Recruiter Summary Report
console.log('\n📈 DEMO 3: Recruiter Summary Report');
console.log('------------------------------------');

const summary = generateRecommendationSummary(leadTeacherJob, topCandidates);
console.log(summary);

// Demo 4: Special Education Position Matching
console.log('\n🎓 DEMO 4: Special Education Teacher Position Matching');
console.log('-----------------------------------------------------');

const specialEdJob = mockJobs.find(job => job.title === 'Special Education Teacher')!;
console.log(`Job: ${specialEdJob.title} at ${specialEdJob.organizationName}`);

const specialEdCandidates = getRecommendationsForJob(specialEdJob, mockJobSeekers, 3);
console.log('\n🏆 Top 3 Candidates for Special Education Role:');
specialEdCandidates.forEach((candidate, index) => {
  console.log(`${index + 1}. ${candidate.firstName} ${candidate.lastName} - ${candidate.matchScore}% match`);
  
  // Show why this candidate is a good fit
  const candidateAnalysis = generateStrengthsAndGaps(specialEdJob, candidate);
  if (candidateAnalysis.strengths.length > 0) {
    console.log(`   Key Strength: ${candidateAnalysis.strengths[0]}`);
  }
});

// Demo 5: Cross-Job Analysis for a Single Candidate
console.log('\n👤 DEMO 5: Cross-Job Analysis for Single Candidate');
console.log('--------------------------------------------------');

const testCandidate = mockJobSeekers.find(c => c.firstName === 'Robert' && c.lastName === 'Jackson')!;
console.log(`Analyzing opportunities for: ${testCandidate.firstName} ${testCandidate.lastName}`);
console.log(`Background: ${testCandidate.jobTitle}`);

console.log('\n💼 Match Scores Across All Available Positions:');
mockJobs.forEach(job => {
  const score = calculateMatchScore(job, testCandidate);
  console.log(`${job.title} at ${job.organizationName}: ${score}% match`);
});

// Demo 6: Recruiter Performance Metrics
console.log('\n📊 DEMO 6: Recruiter Performance Metrics');
console.log('-----------------------------------------');

const recruiter = mockRecruiters[0];
console.log(`Recruiter: ${recruiter.firstName} ${recruiter.lastName}`);
console.log(`Specialization: ${recruiter.jobTitle}`);
console.log(`Experience: ${recruiter.yearsOfExperience} years`);

// Simulate some performance metrics
let totalPlacements = 0;
let avgMatchScore = 0;

mockJobs.forEach(job => {
  const recommendations = getRecommendationsForJob(job, mockJobSeekers, 1);
  if (recommendations.length > 0) {
    totalPlacements++;
    avgMatchScore += recommendations[0].matchScore;
  }
});

avgMatchScore = Math.round(avgMatchScore / totalPlacements);

console.log(`\n📈 Performance Summary:`);
console.log(`  • Active Jobs Filled: ${totalPlacements}`);
console.log(`  • Average Match Quality: ${avgMatchScore}%`);
console.log(`  • Specializes in positions requiring: ${recruiter.skills?.slice(0, 3).join(', ')}`);

console.log('\n✨ RECOMMENDATION ENGINE DEMO COMPLETE');
console.log('=======================================');

// Export demo function for use in React components
export const runRecommendationEngineDemo = () => {
  // This function can be called from React components to demonstrate the engine
  const demoResults = {
    leadTeacherJob,
    topCandidates,
    analysis: generateStrengthsAndGaps(leadTeacherJob, topCandidates[0]),
    summary: generateRecommendationSummary(leadTeacherJob, topCandidates),
    specialEdCandidates,
    recruiterData: recruiter
  };
  
  return demoResults;
};
