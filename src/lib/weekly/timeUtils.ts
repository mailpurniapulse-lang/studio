export function calculatePeriodTimes(
  startTime: string,
  periodDuration: number,
  enableBreak: boolean,
  breakAfterPeriod: number,
  breakDuration: number
) {
  const [hours, minutes] = startTime.split(':').map(Number);
  let currentTime = hours * 60 + minutes;
  const periods = [];

  for (let i = 1; i <= 8; i++) {
    const periodStartTime = formatTime(currentTime);
    const periodEndTime = formatTime(currentTime + periodDuration);
    
    periods.push({
      title: `Period ${i}`,
      time: `${periodStartTime}-${periodEndTime}`
    });

    currentTime += periodDuration;

    if (enableBreak && i === breakAfterPeriod) {
      currentTime += breakDuration;
    }
  }

  return periods;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours > 12 ? hours - 12 : hours;
  return `${String(formattedHours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
}