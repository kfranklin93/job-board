import { mockJobs } from './data/mockJobs';
import { generateOrganizationRecommendations } from './lib/recommendationReports';
import { UserProfile } from './types/data'; // Assuming types are in a root 'types' folder

// Helper function to safely get the candidate's most recent job title
const getCurrentTitle = (candidate: UserProfile): string => {
  if (!candidate.experience || candidate.experience.length === 0) {
    return 'N/A';
  }
  const firstExperience = candidate.experience[0];
  if (typeof firstExperience === 'object' && firstExperience.title) {
    return firstExperience.title;
  }
  if (typeof firstExperience === 'string') {
    return firstExperience;
  }
  return 'N/A';
};

// Get unique organization IDs
const organizationIdsSet = new Set(mockJobs.map(job => job.organizationId));
const organizationIds = Array.from(organizationIdsSet);

// Generate reports for each organization
const allReports = organizationIds.map(orgId => {
  const orgName = mockJobs.find(job => job.organizationId === orgId)?.organizationName || 'Unknown Organization';
  return {
    organizationId: orgId,
    organizationName: orgName,
    reports: generateOrganizationRecommendations(orgId)
  };
});

// Format the reports as text for easy viewing
const formatRecommendationReports = () => {
  let reportText = `# Job Seeker Recommendations for Daycare Providers\n\n`;
  reportText += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  
  allReports.forEach(orgReport => {
    reportText += `## ${orgReport.organizationName} (ID: ${orgReport.organizationId})\n\n`;
    
    if (orgReport.reports.length === 0) {
      reportText += `No active job listings found for this organization.\n\n`;
      return;
    }
    
    orgReport.reports.forEach(report => {
      reportText += `### ${report.job.title}\n\n`;
      reportText += `**Job ID:** ${report.job.id}\n`;
      reportText += `**Location:** ${report.job.location}\n`;
      reportText += `**Type:** ${report.job.type || 'Not specified'}\n`;
      reportText += `**Salary:** ${report.job.salary}\n\n`;
      reportText += `**Requirements:**\n`;
      if (report.job.requirements && report.job.requirements.length > 0) {
        report.job.requirements.forEach(req => {
          reportText += `- ${req}\n`;
        });
      } else {
        reportText += `- No specific requirements listed\n`;
      }
      reportText += `\n**Recommendation Summary:**\n${report.summary}\n\n`;
      
      reportText += `**Top Candidates:**\n\n`;
      
      report.recommendations.forEach((candidate, index) => {
        const matchDetail = report.matchDetails[index];
        reportText += `#### ${index + 1}. ${candidate.firstName} ${candidate.lastName} - ${matchDetail.matchScore}% Match\n\n`;
        
        // --- SAFE ACCESS FIXES ---
        reportText += `**Current Title:** ${getCurrentTitle(candidate)}\n`;
        reportText += `**Location:** ${candidate.location ?? 'N/A'}\n`;
        reportText += `**Experience:** ${candidate.yearsOfExperience ?? 0} years\n`;
        reportText += `**Education:** ${candidate.education?.map(edu => edu.degree).join(', ') ?? 'N/A'}\n`;
        reportText += `**Key Skills:** ${candidate.skills?.slice(0, 5).join(', ') ?? 'N/A'}\n\n`;
        
        reportText += `**Key Strengths:**\n`;
        matchDetail.keyStrengths.forEach(strength => {
          reportText += `- ${strength}\n`;
        });
        
        reportText += `\n**Potential Gaps:**\n`;
        if (matchDetail.potentialGaps.length > 0) {
          matchDetail.potentialGaps.forEach(gap => {
            reportText += `- ${gap}\n`;
          });
        } else {
          reportText += `- No significant gaps identified\n`;
        }
        
        reportText += `\n**Bio:** ${candidate.bio ?? 'No bio provided.'}\n\n`;
        reportText += `---\n\n`;
      });
    });
    
    reportText += `\n\n`;
  });
  
  return reportText;
};

export const recommendationReportText = formatRecommendationReports();