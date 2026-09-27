/**
 * Prints a simple two-column box table to stdout.
 * @param {Array<[string, string]>} rows
 */
export function printReport(rows) {
  const labelWidth = Math.max(...rows.map(([label]) => label.length), 0);
  const valueWidth = Math.max(...rows.map(([, value]) => String(value).length), 0);
  // Row shape: │ label │ value │  => label + value + 8 chars of framing
  const lineWidth = labelWidth + valueWidth + 8;
  const dashWidth = lineWidth - 2;

  const top = `┌${'─'.repeat(dashWidth)}┐`;
  const bottom = `└${'─'.repeat(dashWidth)}┘`;

  console.log(top);
  for (const [label, value] of rows) {
    const left = String(label).padEnd(labelWidth, ' ');
    const right = String(value).padEnd(valueWidth, ' ');
    console.log(`│ ${left} │ ${right} │`);
  }
  console.log(bottom);
}
