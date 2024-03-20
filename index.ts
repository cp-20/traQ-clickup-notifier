import { getMessage } from './tasks';
import { postTraqMessage } from './traq';

const cron = async () => {
  console.log('Running cron');

  try {
    const message = await getMessage();
    await postTraqMessage(message);
  } catch (error) {
    console.error('Failed to run cron', error);
  }
};

const scheduleNextDay = () => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 24);
  const nextDay = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
    0,
    0,
    0
  );

  console.log('Scheduled to run at', nextDay.toISOString());

  const diff = nextDay.getTime() - now.getTime();
  setTimeout(() => {
    cron();
    scheduleNextDay();
  }, diff);
};

scheduleNextDay();
