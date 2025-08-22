// Demo runner for the recommendation engine
const { mockJobs } = require('../data/mockJobs');
const { mockJobSeekers } = require('../data/mockJobSeekers');
const { calculateMatchScore } = require('../services/candidateMatchingEngine');
const { getRecommendationsForJob, generateStrengthsAndGaps, generateRecommendationSummary } = require('../services/recommendationService');

console.log('🎯 DAYCARE STAFFING & RECOMMENDATION ENGINE DEMO');
console.log('================================================');

// Find the Lead Preschool Teacher job
const leadTeacherJob = mockJobs.find(job => job.title === 'Lead Preschool Teacher');

if (leadTeacherJob) {
  console.log('\n📋 DEMO 1: Lead Preschool Teacher Position Matching');
  console.log('---------------------------------------------------');
  console.log(`Job: ${leadTeacherJob.title} at ${leadTeacherJob.organizationName}`);
  console.log(`Location: ${leadTeacherJob.location}`);
  console.log(`Requirements: ${leadTeacherJob.requirements.join(', ')}`);

  // Get top 3 recommendations
  const topCandidates = getRecommendationsForJob(leadTeacherJob, mockJobSeekers, 3);
  
  console.log('\n🏆 Top 3 Recommendations:');
  topCandidates.forEach((candidate, index) => {
    console.log(`${index + 1}. ${candidate.firstName} ${candidate.lastName} - ${candidate.matchScore}% match`);
    console.log(`   Experience: ${candidate.yearsOfExperience} years`);
    console.log(`   Current Role: ${candidate.jobTitle}`);
    console.log(`   Location: ${candidate.location}`);
  });

  if (topCandidates.length > 0) {
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

    console.log('\n📈 DEMO 3: Recruiter Summary Report');
    console.log('------------------------------------');
    const summary = generateRecommendationSummary(leadTeacherJob, topCandidates);
    console.log(summary);
  }
} else {
  console.log('❌ Lead Preschool Teacher job not found');
}

console.log('\n✨ RECOMMENDATION ENGINE DEMO COMPLETE');
console.log('=======================================');
