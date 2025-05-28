export interface JoinRecord {
  eventCode: string;
  participantId: string;
}

const STORAGE_KEY = "joinRecords";

/** Get the array of saved join‐records (or an empty array). */
export function getJoinRecords(): JoinRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Save or update a record for this eventCode → participantId. */
export function saveJoinRecord(eventCode: string, participantId: string) {
  const records = getJoinRecords();
  const idx = records.findIndex((r) => r.eventCode === eventCode);
  if (idx >= 0) {
    records[idx].participantId = participantId;
  } else {
    records.push({ eventCode, participantId });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/** Look up a saved participantId for this eventCode, if any. */
export function getSavedParticipantId(eventCode: string): string | null {
  const record = getJoinRecords().find((r) => r.eventCode === eventCode);
  return record?.participantId ?? null;
}
