/**
 * Utility for extracting keywords from text and performing gap analysis.
 */

/**
 * Extracts potential keywords from a text string.
 * This is a basic implementation that filters out common stop words and 
 * focuses on capitalized words and technical terms.
 */
export function extractKeywords(text: string): string[] {
  if (!text) return [];

  // Common English stop words to ignore
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when', 'at', 'from', 
    'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 
    'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 
    'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 
    'can', 'will', 'just', 'don', 'should', 'now', 'i', 'me', 'my', 'myself', 'we', 
    'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 
    'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 
    'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 
    'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 
    'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
    'did', 'doing'
  ]);

  // Clean the text: remove punctuation and split into words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Count frequencies
  const frequencies: Record<string, number> = {};
  words.forEach(word => {
    frequencies[word] = (frequencies[word] || 0) + 1;
  });

  // Sort by frequency and return unique words
  return Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]);
}

/**
 * Performs a gap analysis between a profile and a job description.
 * Returns keywords present in the job description but missing from the profile.
 */
export function performGapAnalysis(profileText: string, jobDescription: string): {
  matchingKeywords: string[];
  missingKeywords: string[];
  matchPercentage: number;
} {
  const profileKeywords = new Set(extractKeywords(profileText));
  const jobKeywords = extractKeywords(jobDescription);

  const matchingKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jobKeywords.forEach(keyword => {
    if (profileKeywords.has(keyword)) {
      matchingKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const totalJobKeywords = jobKeywords.length;
  const matchPercentage = totalJobKeywords > 0 
    ? Math.round((matchingKeywords.length / totalJobKeywords) * 100) 
    : 0;

  return {
    matchingKeywords,
    missingKeywords,
    matchPercentage
  };
}
