export const isScheduleUpdated = (
  existingSchedule: any[],
  newSchedule: any[]
): boolean => {
  if (existingSchedule.length !== newSchedule.length) return true;

  for (let i = 0; i < existingSchedule.length; i++) {
    if (
      existingSchedule[i].day !== newSchedule[i].day ||
      existingSchedule[i].start_time !== newSchedule[i].start_time ||
      existingSchedule[i].end_time !== newSchedule[i].end_time ||
      existingSchedule[i].subject != newSchedule[i].subject
    ) {
      return true;
    }
  }
  return false;
};
