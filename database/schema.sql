-- Evolvia Receptly database (PostgreSQL / Supabase)
-- Every table carries business_id so one system can serve many clients safely.

create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_type text,
  phone_number text unique,          -- the number customers call or WhatsApp
  language text default 'en',
  timezone text default 'Asia/Kolkata',
  plan text default 'pilot',
  created_at timestamptz default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  duration_min int not null,
  price numeric(10,2)
);

create table opening_hours (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  opens time not null,
  closes time not null
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  question text not null,
  answer text not null               -- the only facts the AI may state
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text,
  phone text not null,
  consent_to_message boolean default false,
  unique (business_id, phone)
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid references customers(id),
  channel text check (channel in ('call','whatsapp')),
  status text default 'open' check (status in ('open','handed_off','closed')),
  started_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text check (role in ('customer','ai','staff')),
  content text not null,
  created_at timestamptz default now()
);

create table appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_id uuid not null references customers(id),
  service_id uuid references services(id),
  starts_at timestamptz not null,
  status text default 'booked' check (status in ('booked','completed','cancelled','no_show')),
  booked_via uuid references conversations(id),
  unique (business_id, starts_at)    -- prevents double booking
);

create table reminders (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  send_at timestamptz not null,
  sent boolean default false
);

-- Recovered-bookings report (your sales pitch): appointments created from missed-call conversations
create view recovered_bookings as
select a.business_id, date_trunc('week', a.starts_at) as week, count(*) as bookings, sum(s.price) as revenue
from appointments a
left join services s on s.id = a.service_id
where a.booked_via is not null and a.status <> 'cancelled'
group by 1, 2;
