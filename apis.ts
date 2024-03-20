import { API_KEY } from './env';

export type List = {
  id: string;
  name: string;
  content: string;
  task_count: number;
  archived: boolean;
};

export const fetchLists = async (spaceId: string) => {
  const res = await fetch(
    `https://api.clickup.com/api/v2/space/${spaceId}/list`,
    { headers: { Authorization: API_KEY } }
  );
  const result = (await res.json()) as { lists: List[] };

  return result.lists;
};

export type Status = {
  status: 'to do' | 'doing' | 'canceled' | 'complete';
  color: `#${string}`;
  type: 'open' | 'custom' | 'done' | 'closed';
};

export type User = {
  id: number;
  username: string;
  color: `#${string}`;
  email: string;
  profilePicture: string;
};

export type Tag = {
  name: string;
  tag_fg: `#${string}`;
  tag_bg: `#${string}`;
  creator: number;
};

export type Priority = {
  color: `#${string}`;
  id: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
};

export type Dependencies = {
  task_id: string;
  depends_on: string;
  type: number;
  date_created: string;
  userid: string;
  workspace_id: string;
};

export type Task = {
  id: string;
  name: string;
  text_content: string;
  description: string;
  status: Status;
  date_created: string; // unix timestamp
  date_updated: string; // unix timestamp
  date_closed: string | null; // unix timestamp
  date_done: string | null; // unix timestamp
  archived: boolean;
  creator: User;
  assignees: User[];
  watchers: User[];
  parent: string | null;
  priority: string | null;
  due_date: string | null; // unix timestamp
  start_date: string | null; // unix timestamp
  dependencies: Dependencies[];
  tags: Tag[];
  url: string;
  list: {
    id: string;
    name: string;
  };
};

export const fetchTasks = async (listId: string) => {
  const res = await fetch(
    `https://api.clickup.com/api/v2/list/${listId}/task?subtasks=true&include_closed=true`,
    { headers: { Authorization: API_KEY } }
  );
  const result = (await res.json()) as { tasks: Task[] };

  return result.tasks;
};
