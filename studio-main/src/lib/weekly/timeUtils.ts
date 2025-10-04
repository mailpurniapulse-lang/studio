export function calculatePeriodTimes(
  startTime: string,
  periodDuration: number,
  enableBreak: boolean,
  breakAfterPeriod: number,
  breakDuration: number,
  enableBreak2: boolean,
  breakAfterPeriod2: number,
  breakDuration2: number
) {
  const periods = [];
  const [startHour, startMinute] = startTime.split(":").map(Number);
  let currentTime = new Date();
  currentTime.setHours(startHour, startMinute, 0, 0);

  for (let i = 1; i <= 8; i++) {
    const startTimeStr = currentTime.toTimeString().slice(0, 5);
    currentTime.setMinutes(currentTime.getMinutes() + periodDuration);
    const endTimeStr = currentTime.toTimeString().slice(0, 5);
    periods.push({
      title: `Period ${i}`,
      time: `${startTimeStr}-${endTimeStr}`,
    });

    // Add first break
    if (enableBreak && i === breakAfterPeriod) {
      periods.push({
        title: "Break",
        time: `${endTimeStr}-${addMinutesToTime(endTimeStr, breakDuration)}`,
      });
      currentTime.setMinutes(currentTime.getMinutes() + breakDuration);
    }
    // Add second break
    if (enableBreak2 && i === breakAfterPeriod2) {
      periods.push({
        title: "Break 2",
        time: `${endTimeStr}-${addMinutesToTime(endTimeStr, breakDuration2)}`,
      });
      currentTime.setMinutes(currentTime.getMinutes() + breakDuration2);
    }
  }
  return periods;
}

function addMinutesToTime(time: string, minutesToAdd: number): string {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setMinutes(date.getMinutes() + minutesToAdd);
  return date.toTimeString().slice(0, 5);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
}
