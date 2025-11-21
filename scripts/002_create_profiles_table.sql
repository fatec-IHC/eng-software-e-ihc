-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null,
  full_name text,
  avatar_url text,
  role text,
  primary key (id)
);

alter table profiles
  enable row level security;

-- Set up a trigger to create a profile when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'role');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
