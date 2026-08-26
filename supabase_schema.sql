-- Structure de la base de données Trackio

-- 1. Table profiles (liée à auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Active le RLS pour profiles
alter table public.profiles enable row level security;
create policy "Les utilisateurs peuvent voir leur propre profil." on profiles for select using (auth.uid() = id);
create policy "Les utilisateurs peuvent modifier leur propre profil." on profiles for update using (auth.uid() = id);

-- Trigger pour créer automatiquement un profil lors de l'inscription
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Table products
create table public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  selling_price numeric not null,
  cost_price numeric not null,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Active le RLS pour products
alter table public.products enable row level security;
create policy "Les utilisateurs gèrent leurs propres produits." on products for all using (auth.uid() = user_id);

-- 3. Table performance_records
create table public.performance_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  product_id uuid references public.products not null,
  date date not null,
  delivered_quantity integer not null default 0,
  revenue_without_delivery numeric not null default 0,
  ad_spend numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id, date) -- Un seul enregistrement par produit et par jour
);

-- Active le RLS pour performance_records
alter table public.performance_records enable row level security;
create policy "Les utilisateurs gèrent leurs propres performances." on performance_records for all using (auth.uid() = user_id);
