-- Seed verified GATE 2025 DBMS PYQs.
-- Existing rows are protected by the NOT EXISTS checks so this migration
-- does not create duplicates if the PYQs were already inserted manually.

insert into public.pyqs (
  subject_id,
  chapter_id,
  topic_id,
  year,
  question_number,
  question_text,
  options,
  correct_answer,
  explanation,
  marks,
  negative_marks,
  difficulty,
  question_type,
  source
)
select
  'dbms',
  'dbms-chapter-6',
  'dbms-6-14',
  2025,
  '15',
  'A schedule contains three database transactions. T1 reads X, writes Y, while T2 and T3 read data written by T1. T1 aborts at the end. Which other transactions must be rolled back?',
  '[
    {"key":"A","text":"Only T2"},
    {"key":"B","text":"Only T3"},
    {"key":"C","text":"Both T2 and T3"},
    {"key":"D","text":"Neither T2 nor T3"}
  ]'::jsonb,
  'C',
  'T2 and T3 have read data affected by T1 before T1 aborts, so both are affected by the rollback.',
  1,
  0.333333,
  'Easy',
  'MCQ',
  'GATE 2025 CS1 Master Question Paper - Q15'
where not exists (
  select 1
  from public.pyqs
  where subject_id = 'dbms'
    and year = 2025
    and question_number = '15'
);

insert into public.pyqs (
  subject_id,
  chapter_id,
  topic_id,
  year,
  question_number,
  question_text,
  options,
  correct_answer,
  explanation,
  marks,
  negative_marks,
  difficulty,
  question_type,
  source
)
select
  'dbms',
  'dbms-chapter-3',
  'dbms-3-11',
  2025,
  '55',
  'Given player, team, coach, and members tables, an SQL query uses a nested subquery to find the minimum age of players belonging to the team coached by Mark. Find the value returned by the query.',
  '[]'::jsonb,
  '26',
  'The subquery identifies the team coached by Mark and the players belonging to that team. Their ages are considered by the outer MIN query, giving 26.',
  2,
  0,
  'Easy',
  'NAT',
  'GATE 2025 CS1 Master Question Paper - Q55'
where not exists (
  select 1
  from public.pyqs
  where subject_id = 'dbms'
    and year = 2025
    and question_number = '55'
);

insert into public.pyqs (
  subject_id,
  chapter_id,
  topic_id,
  year,
  question_number,
  question_text,
  options,
  correct_answer,
  explanation,
  marks,
  negative_marks,
  difficulty,
  question_type,
  source
)
select
  'dbms',
  'dbms-chapter-6',
  'dbms-6-6',
  2025,
  '53',
  'Given two database transactions and four possible schedules, determine which schedule is conflict serializable.',
  '[
    {"key":"A","text":"Schedule A"},
    {"key":"B","text":"Schedule B"},
    {"key":"C","text":"Schedule C"},
    {"key":"D","text":"Schedule D"}
  ]'::jsonb,
  'B',
  'Schedule B produces an acyclic precedence graph, so it is conflict serializable. The other schedules contain a cycle in the precedence graph.',
  2,
  0,
  'Medium',
  'MCQ',
  'GATE 2025 CS2 Master Question Paper - Q53'
where not exists (
  select 1
  from public.pyqs
  where subject_id = 'dbms'
    and year = 2025
    and question_number = '53'
);
