export function shouldPrefetchBookingData(
  nodeEnv: string | undefined
): boolean {
  return nodeEnv !== "development";
}
