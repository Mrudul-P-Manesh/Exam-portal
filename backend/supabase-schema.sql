create table if not exists public.users (
  id bigint generated always as identity primary key,
  username text not null unique,
  password text not null,
  role text not null default 'candidate',
  suspicion_score integer not null default 0,
  has_started boolean not null default false,
  has_completed boolean not null default false,
  start_time timestamptz null,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id bigint generated always as identity primary key,
  user_id bigint not null references public.users(id) on delete cascade,
  question_id integer not null,
  source_code text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create table if not exists public.logs (
  id bigint generated always as identity primary key,
  user_id bigint not null references public.users(id) on delete cascade,
  username text not null,
  event_type text not null,
  metadata jsonb null,
  created_at timestamptz not null default now()
);

create index if not exists idx_submissions_user_id on public.submissions(user_id);
create index if not exists idx_logs_user_id on public.logs(user_id);
