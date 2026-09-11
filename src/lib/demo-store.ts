import { CheckIn, DailyMetric, Insight, Journal } from "@/lib/types";

type Habit = { id: string; title: string; time: string; done: boolean; icon: string };
type Screening = { id: string; title: string; score: number; maxScore: number; statusLabel: string; createdAt: string };
type Activity = { id: string; type: string; createdAt: string };
type SessionData = { checkIns: CheckIn[]; journals: Journal[]; insights: Insight[]; habits: Habit[]; screenings: Screening[]; activities: Activity[] };

const defaultHabits: Habit[] = [
  { id: "h1", title: "Hydration (Target: 2.5L)", time: "Throughout day", done: false, icon: "water_drop" },
  { id: "h2", title: "10-Min Somatic Box Breathing", time: "Morning Reset", done: false, icon: "air" },
  { id: "h3", title: "Evening Reflection Journal", time: "9:30 PM", done: false, icon: "edit_note" },
];

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

const seedMetrics: DailyMetric[] = [
  { date: daysAgo(6), mood: 4, stress: 3, sleepHours: 7.6 },
  { date: daysAgo(5), mood: 4, stress: 4, sleepHours: 7.2 },
  { date: daysAgo(4), mood: 3, stress: 5, sleepHours: 6.8 },
  { date: daysAgo(3), mood: 3, stress: 6, sleepHours: 6.5 },
  { date: daysAgo(2), mood: 3, stress: 6, sleepHours: 6.1 },
  { date: daysAgo(1), mood: 2, stress: 7, sleepHours: 5.9 },
];

const globalStore = globalThis as typeof globalThis & { __svasthiDemoSessions?: Map<string, SessionData> };
const sessions = globalStore.__svasthiDemoSessions ?? new Map<string, SessionData>();
globalStore.__svasthiDemoSessions = sessions;
function session(sessionId: string): SessionData {
  const existing = sessions.get(sessionId);
  if (existing) return existing;
  const created = { checkIns: [], journals: [], insights: [], habits: defaultHabits.map((habit) => ({ ...habit })), screenings: [], activities: [] };
  sessions.set(sessionId, created);
  return created;
}

export const demoStore = {
  addCheckIn(sessionId: string, checkIn: CheckIn) { session(sessionId).checkIns.unshift(checkIn); return checkIn; },
  addJournal(sessionId: string, journal: Journal) { session(sessionId).journals.unshift(journal); return journal; },
  addInsight(sessionId: string, insight: Insight) { session(sessionId).insights.unshift(insight); return insight; },
  checkIns(sessionId: string) { return session(sessionId).checkIns; },
  journal(sessionId: string, id: string) { return session(sessionId).journals.find((item) => item.id === id); },
  checkIn(sessionId: string, id: string) { return session(sessionId).checkIns.find((item) => item.id === id); },
  latestInsight(sessionId: string) { return session(sessionId).insights[0] ?? null; },
  habits(sessionId: string) { return session(sessionId).habits; },
  toggleHabit(sessionId: string, id: string) {
    const item = session(sessionId).habits.find((habit) => habit.id === id);
    if (!item) return null;
    item.done = !item.done;
    return item;
  },
  screenings(sessionId: string) { return session(sessionId).screenings; },
  addScreening(sessionId: string, screening: Screening) { session(sessionId).screenings.unshift(screening); return screening; },
  addActivity(sessionId: string, type: string) { const activity = { id: crypto.randomUUID(), type, createdAt: new Date().toISOString() }; session(sessionId).activities.unshift(activity); return activity; },
  dashboard(sessionId: string) {
    const latest = session(sessionId).checkIns[0];
    const today = new Date().toISOString().slice(0, 10);
    const weekly = latest ? [...seedMetrics, { date: today, mood: latest.mood, stress: latest.stress, sleepHours: latest.sleepHours }] : seedMetrics;
    const averageSleep = weekly.reduce((sum, item) => sum + item.sleepHours, 0) / weekly.length;
    const averageStress = weekly.reduce((sum, item) => sum + item.stress, 0) / weekly.length;
    return {
      weekly,
      currentCheckIn: latest ?? null,
      latestInsight: this.latestInsight(sessionId),
      stats: { streakDays: 7, avgSleepHours: Number(averageSleep.toFixed(1)), wellnessScore: Math.max(0, Math.round(100 - averageStress * 7)), completedHabits: session(sessionId).habits.filter((habit) => habit.done).length, habitCount: session(sessionId).habits.length },
      resources: [{ label: "Tele-MANAS crisis support", phone: "14416", available: "24/7" }],
    };
  },
};
