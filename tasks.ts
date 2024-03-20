import { type Task, fetchLists, fetchTasks } from './apis';
import { SPACE_ID } from './env';
import rawUsers from './users.json';

const users = rawUsers as Record<string, string>;

const tagEmoji: Record<string, string> = {
  要修正: ':mag:',
  要期限: ':alarm_clock:',
  要アサイン: ':man_bowing:',
};

const statusEmoji: Record<string, string> = {
  'to do': ':pencil:',
  doing: ':loading:',
  canceled: ':no_entry_sign:',
  complete: ':white_check_mark:',
};

const sortByDue = (a: Task, b: Task) =>
  new Date(a.due_date ? parseInt(a.due_date) : '2030-01-01') <
  new Date(b.due_date ? parseInt(b.due_date) : '2030-01-01')
    ? -1
    : 1;

const formatTasks = (tasks: Task[], mention = false) =>
  '|状態|期限|種類|タスク|担当|タグ|\n|---|---|---|---|---|---|\n' +
  tasks
    .map((task) => {
      const { name, assignees, tags, due_date, url, list, status } = task;
      const date = (() => {
        if (due_date === null) return '';
        const d = new Date(parseInt(due_date));
        const month = d.getMonth() + 1;
        const date = d.getDate().toString().padStart(2, '0');
        return `${month}/${date}`;
      })();

      const assignMessage = assignees
        .map((a) => (mention ? `@${users[a.id]}` : `:@${users[a.id]}:`))
        .join(mention ? ' ' : '');

      const tagMessage = tags
        .map((t) => tagEmoji[t.name] ?? null)
        .filter(Boolean)
        .join('');

      const statusMessage = statusEmoji[status.status] ?? status.status;

      return `|${[
        statusMessage,
        date,
        list.name,
        `[${name}](${url.replace('https://', '//')})`,
        assignMessage,
        tagMessage,
      ].join('|')}|`;
    })
    .join('\n');

export const getMessage = async () => {
  const lists = await fetchLists(SPACE_ID);

  const tasks = (
    await Promise.all(lists.map((list) => fetchTasks(list.id)))
  ).flat();

  const todoTasks = tasks
    .filter(
      (task) => task.status.status === 'to do' || task.status.status === 'doing'
    )
    .toSorted(sortByDue);

  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  const overDueTasks = todoTasks.filter(
    (task) => task.due_date && new Date(parseInt(task.due_date)) < now
  );

  const DueTodayTasks = todoTasks.filter(
    (task) =>
      task.due_date &&
      new Date(parseInt(task.due_date)).toDateString() === now.toDateString()
  );

  const nextWeekTasks = todoTasks.filter(
    (task) =>
      task.due_date &&
      new Date(new Date(now.toDateString()).getTime() + oneDay) <
        new Date(parseInt(task.due_date)) &&
      new Date(parseInt(task.due_date)) < new Date(now.getTime() + oneDay * 7)
  );

  // const noDueTasks = todoTasks.filter((task) => task.due_date === null);

  // const noAssignTasks = todoTasks.filter((task) => task.assignees.length === 0);

  const message = `## :alert.large: 締め切りを過ぎたタスク

${formatTasks(overDueTasks, true)}

## :blob_bongo.large: 今日締め切りのタスク

${formatTasks(DueTodayTasks, true)}

## :calendar.large: 直近1週間のタスク

${formatTasks(nextWeekTasks)}`;

  return message;
};
