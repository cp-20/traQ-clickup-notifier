import { getMessage } from './tasks';
import { postTraqMessage } from './traq';

const cron = async () => {
  console.log('Running cron');

  try {
    const message = await getMessage();
    // await postTraqMessage(message);
    console.log('message posted', message.length);
  } catch (error) {
    console.error('Failed to run cron', error);
  }
};

const scheduleNextDay = () => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 24);

  const nextDayYear = tomorrow.getFullYear();
  const nextDayMonth = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
  const nextDayDate = tomorrow.getDate().toString().padStart(2, '0');
  const nextDayString = `${nextDayYear}-${nextDayMonth}-${nextDayDate}T00:00:00+09:00`;

  const nextDay = new Date(nextDayString);

  console.log('Scheduled to run at', nextDay.toISOString());

  const diff = nextDay.getTime() - now.getTime();
  setTimeout(() => {
    cron();
    scheduleNextDay();
  }, diff);
};

scheduleNextDay();
