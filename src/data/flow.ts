const ORIGINAL_STEP_IDS: Record<number, string> = {
  0: 'step1', 1: 'step3', 2: 'step4', 3: 'step5', 4: 'step6', 5: 'step7',
  6: 'step8', 7: 'step9', 8: 'step10', 9: 'step11', 10: 'step12', 11: 'step13',
  12: 'step14', 13: 'step15', 14: 'step16', 15: 'step17', 16: 'step18a',
  17: 'step19', 18: 'step21', 19: 'step23', 20: 'step24', 21: 'step24a',
  22: 'step24b', 23: 'step24c', 24: 'step25', 25: 'step26', 26: 'step27',
  28: 'step18', 29: 'step22',
}

export const MAX_INTERNAL_STEP = 29

export function toOriginalStepId(step: number): string {
  return ORIGINAL_STEP_IDS[step] ?? 'step28'
}
