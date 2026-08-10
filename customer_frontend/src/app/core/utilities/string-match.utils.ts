export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0.0;

  const pairs1 = getBigrams(s1);
  const pairs2 = getBigrams(s2);

  let union = pairs1.length + pairs2.length;
  let hitCount = 0;

  for (const x of pairs1) {
    for (let i = 0; i < pairs2.length; i++) {
      if (x === pairs2[i]) {
        hitCount++;
        pairs2.splice(i, 1);
        break;
      }
    }
  }

  return (2.0 * hitCount) / union;
}

function getBigrams(str: string): string[] {
  const s = str.toLowerCase();
  const v = new Array(s.length - 1);
  for (let i = 0; i < s.length - 1; i++) {
    v[i] = s.slice(i, i + 2);
  }
  return v;
}
