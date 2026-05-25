export function formatInches(totalInches: number): string {
  const rounded = Math.round(totalInches * 10) / 10;
  const feet = Math.floor(rounded / 12);
  const inchVal = Math.round((rounded % 12) * 10) / 10;
  // Roll over if rounding pushed inches to 12
  if (inchVal >= 12) return `${feet + 1}'`;
  const inchStr = inchVal.toFixed(1).replace(/\.0$/, '');
  if (feet === 0) return `${inchStr}"`;
  if (inchVal === 0) return `${feet}'`;
  return `${feet}' ${inchStr}"`;
}
