import jsPDF from 'jspdf';
import { UserProfile, Job } from '../../types/data';
import { calculateMatchScore, MatchResult } from '../api/candidateMatchingEngine';

// AI-powered report generation service
export class AIReportGenerator {
  
  /**
   * Generate AI-powered candidate summary
   */
  static generateAISummary(candidate: UserProfile, job: Job, matchResult: MatchResult): string {
    const { score, breakdown, details } = matchResult;
    
    let summary = `${candidate.firstName} ${candidate.lastName} is `;
    
    // Score-based assessment
    if (score >= 90) {
      summary += "an exceptional match for this position. ";
    } else if (score >= 80) {
      summary += "a strong candidate for this role. ";
    } else if (score >= 70) {
      summary += "a good fit with some development potential. ";
    } else {
      summary += "showing promise but may need additional training. ";
    }
    
    // Highlight top strengths
    const topStrengths = [];
    if (breakdown.skills >= 80) topStrengths.push("excellent skill alignment");
    if (breakdown.experience >= 80) topStrengths.push("relevant experience");
    if (breakdown.education >= 80) topStrengths.push("strong educational background");
    if (breakdown.certifications >= 80) topStrengths.push("required certifications");
    
    if (topStrengths.length > 0) {
      summary += `Key strengths include ${topStrengths.join(', ')}. `;
    }
    
    // Years of experience insight
    if (candidate.yearsOfExperience) {
      if (candidate.yearsOfExperience >= 5) {
        summary += `With ${candidate.yearsOfExperience} years of experience, they bring seasoned expertise to the role.`;
      } else {
        summary += `Their ${candidate.yearsOfExperience} years of experience demonstrates growing competency in the field.`;
      }
    }
    
    return summary;
  }
  
  /**
   * Generate comprehensive PDF report for a candidate
   */
  static async generateCandidateReport(
    candidate: UserProfile, 
    job: Job, 
    organizationName: string = 'Daycare Organization'
  ): Promise<Blob> {
    const pdf = new jsPDF();
    const matchResult = calculateMatchScore(job, candidate);
    const pageWidth = pdf.internal.pageSize.width;
    let yPosition = 20;
    
    // Helper function to add text with proper spacing
    const addText = (text: string, x: number, fontSize: number = 12, fontStyle: string = 'normal') => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      pdf.text(text, x, yPosition);
      yPosition += fontSize * 0.5 + 5;
    };
    
    const addSeparator = () => {
      yPosition += 5;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;
    };
    
    // Header
    pdf.setFillColor(94, 53, 177);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    addText('AI-Powered Candidate Report', 20, 18, 'bold');
    pdf.setTextColor(0, 0, 0);
    yPosition = 60;
    
    // Candidate Info
    addText(`Candidate: ${candidate.firstName} ${candidate.lastName}`, 20, 16, 'bold');
    addText(`Position: ${job.title}`, 20, 14);
    addText(`Organization: ${organizationName}`, 20, 14);
    addText(`Generated: ${new Date().toLocaleDateString()}`, 20, 12);
    addSeparator();
    
    // Overall Score
    addText('Overall Match Score', 20, 14, 'bold');
    const scoreColor = matchResult.score >= 80 ? [76, 175, 80] : 
                      matchResult.score >= 60 ? [255, 193, 7] : [244, 67, 54];
    pdf.setTextColor(...scoreColor);
    addText(`${matchResult.score}/100`, 20, 24, 'bold');
    pdf.setTextColor(0, 0, 0);
    yPosition += 5;
    
    // Score breakdown
    addText('Score Breakdown', 20, 14, 'bold');
    yPosition += 5;
    
    const breakdownItems = [
      { label: 'Skills Match', score: matchResult.breakdown.skills },
      { label: 'Experience', score: matchResult.breakdown.experience },
      { label: 'Years of Experience', score: matchResult.breakdown.yearsOfExperience },
      { label: 'Education', score: matchResult.breakdown.education },
      { label: 'Certifications', score: matchResult.breakdown.certifications },
      { label: 'Job Type Preference', score: matchResult.breakdown.jobType }
    ];
    
    breakdownItems.forEach(item => {
      addText(`${item.label}: ${item.score}/100`, 30, 11);
    });
    
    addSeparator();
    
    // AI Summary
    addText('AI Analysis Summary', 20, 14, 'bold');
    const aiSummary = this.generateAISummary(candidate, job, matchResult);
    const splitSummary = pdf.splitTextToSize(aiSummary, pageWidth - 40);
    pdf.setFontSize(11);
    splitSummary.forEach((line: string) => {
      pdf.text(line, 20, yPosition);
      yPosition += 6;
    });
    
    addSeparator();
    
    // Skills Analysis
    addText('Skills Analysis', 20, 14, 'bold');
    
    if (matchResult.details.matchedSkills.length > 0) {
      addText('Matching Skills:', 20, 12, 'bold');
      matchResult.details.matchedSkills.forEach(skill => {
        pdf.setTextColor(76, 175, 80);
        addText(`✓ ${skill}`, 30, 10);
      });
      pdf.setTextColor(0, 0, 0);
    }
    
    if (matchResult.details.missingSkills.length > 0) {
      yPosition += 5;
      addText('Development Areas:', 20, 12, 'bold');
      matchResult.details.missingSkills.forEach(skill => {
        pdf.setTextColor(244, 67, 54);
        addText(`○ ${skill}`, 30, 10);
      });
      pdf.setTextColor(0, 0, 0);
    }
    
    addSeparator();
    
    // Candidate Details
    addText('Candidate Profile', 20, 14, 'bold');
    addText(`Email: ${candidate.email}`, 20, 11);
    if (candidate.phone) addText(`Phone: ${candidate.phone}`, 20, 11);
    if (candidate.location) addText(`Location: ${candidate.location}`, 20, 11);
    if (candidate.yearsOfExperience) addText(`Experience: ${candidate.yearsOfExperience} years`, 20, 11);
    
    // Education
    if (candidate.education && candidate.education.length > 0) {
      yPosition += 5;
      addText('Education:', 20, 12, 'bold');
      candidate.education.forEach(edu => {
        addText(`• ${edu.degree} - ${edu.institution} (${edu.graduationYear})`, 30, 10);
      });
    }
    
    // Experience
    if (candidate.experience && candidate.experience.length > 0) {
      yPosition += 5;
      addText('Recent Experience:', 20, 12, 'bold');
      candidate.experience.slice(0, 3).forEach(exp => {
        addText(`• ${exp.title} at ${exp.company}`, 30, 10);
        addText(`  ${exp.startDate} - ${exp.endDate}`, 35, 9);
      });
    }
    
    // Footer
    yPosition = pdf.internal.pageSize.height - 30;
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text('Generated by AI-Powered Daycare Staffing Platform', pageWidth / 2, yPosition, { align: 'center' });
    
    return pdf.output('blob');
  }
  
  /**
   * Generate weekly top candidates report for recruiters
   */
  static async generateWeeklyReport(
    jobs: Job[], 
    topCandidates: { job: Job; candidates: UserProfile[] }[]
  ): Promise<Blob> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    let yPosition = 20;
    
    // Header
    pdf.setFillColor(94, 53, 177);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Weekly Top Candidates Report', 20, 30);
    pdf.setTextColor(0, 0, 0);
    yPosition = 60;
    
    // Date range
    pdf.setFontSize(12);
    pdf.text(`Report Period: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 20;
    
    topCandidates.forEach(({ job, candidates }) => {
      // Job title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${job.title} - ${job.organizationName}`, 20, yPosition);
      yPosition += 15;
      
      // Top candidates
      candidates.slice(0, 5).forEach((candidate, index) => {
        const matchResult = calculateMatchScore(job, candidate);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${index + 1}. ${candidate.firstName} ${candidate.lastName}`, 30, yPosition);
        pdf.text(`${matchResult.score}% match`, pageWidth - 60, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Check if we need a new page
      if (yPosition > pdf.internal.pageSize.height - 50) {
        pdf.addPage();
        yPosition = 20;
      }
    });
    
    return pdf.output('blob');
  }
  
  /**
   * Download blob as PDF file
   */
  static downloadReport(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default AIReportGenerator;
