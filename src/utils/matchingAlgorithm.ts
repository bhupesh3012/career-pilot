/**
 * Calculates a matching percentage between user skills and required skills.
 * Intersects the array of user skills with the array of required skills on the internship post.
 * Returns an integer percentage between 0 and 100.
 */
export function calculateMatchingScore(userSkills: string[], requiredSkills: string[]): number {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  if (!userSkills || userSkills.length === 0) return 0;

  const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
  let matches = 0;

  requiredSkills.forEach(reqSkill => {
    const normalizedReq = reqSkill.toLowerCase().trim();
    // Check for exact or partial inclusion
    const isMatched = normalizedUserSkills.some(userSkill => 
      userSkill === normalizedReq || 
      userSkill.includes(normalizedReq) || 
      normalizedReq.includes(userSkill)
    );
    if (isMatched) {
      matches++;
    }
  });

  const ratio = matches / requiredSkills.length;
  // Calculate percentage, adding a small baseline of 40% if there is any intersection, up to 100%
  const score = Math.round(ratio * 100);
  
  return Math.min(100, Math.max(0, score));
}
