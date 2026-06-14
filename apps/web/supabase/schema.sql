create extension if not exists pgcrypto;

create type product_status as enum ('active', 'inactive', 'out-of-stock');
create type order_status as enum ('new', 'contacted', 'processing', 'completed', 'cancelled');
create type message_status as enum ('unread', 'read', 'archived');

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  image_url text not null default '/images/template.svg',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete restrict,
  sku text unique,
  slug text not null unique,
  model text not null,
  brand text not null,
  name_ar text not null,
  name_en text not null,
  short_description_ar text,
  short_description_en text,
  description_ar text not null default '',
  description_en text not null default '',
  quality_grade text not null default 'MIRROR',
  sell_price integer not null check (sell_price >= 0),
  old_price integer check (old_price is null or old_price >= sell_price),
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  status product_status not null default 'active',
  badge text,
  featured boolean not null default false,
  on_offer boolean not null default false,
  best_seller boolean not null default false,
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table products add column if not exists sku text unique;
alter table products add column if not exists short_description_ar text;
alter table products add column if not exists short_description_en text;
alter table products add column if not exists quality_grade text not null default 'MIRROR';
alter table products add column if not exists old_price integer check (old_price is null or old_price >= sell_price);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('ORD-' || upper(substr(gen_random_uuid()::text, 1, 8))),
  customer_name text not null,
  phone text not null,
  address text not null,
  notes text,
  status order_status not null default 'new',
  total integer not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  product_name_ar text not null,
  product_name_en text not null,
  image text not null default '/images/template.svg',
  size text not null,
  color text not null default '',
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  message text not null,
  status message_status not null default 'unread',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists admin_users (
  email text primary key,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function create_order_with_stock(customer jsonb, items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  order_id uuid;
  order_no text;
  item jsonb;
  product_row products%rowtype;
  computed_total integer := 0;
  qty integer;
  product_uuid uuid;
begin
  if jsonb_array_length(items) = 0 then
    raise exception 'Cart is empty';
  end if;

  if length(trim(coalesce(customer->>'name', ''))) = 0
    or length(trim(coalesce(customer->>'name', ''))) > 120
    or length(trim(coalesce(customer->>'phone', ''))) = 0
    or length(trim(coalesce(customer->>'phone', ''))) > 40
    or length(trim(coalesce(customer->>'address', ''))) = 0
    or length(trim(coalesce(customer->>'address', ''))) > 300
    or length(coalesce(customer->>'notes', '')) > 500 then
    raise exception 'Invalid customer';
  end if;

  insert into orders (customer_name, phone, address, notes)
  values (
    trim(customer->>'name'),
    trim(customer->>'phone'),
    trim(customer->>'address'),
    nullif(trim(customer->>'notes'), '')
  )
  returning id, order_number into order_id, order_no;

  for item in select * from jsonb_array_elements(items)
  loop
    if coalesce(item->>'quantity', '') !~ '^[0-9]+$' then
      raise exception 'Invalid quantity';
    end if;

    qty := (item->>'quantity')::integer;
    if qty <= 0 or qty > 99 then
      raise exception 'Invalid quantity';
    end if;

    begin
      product_uuid := (item->>'productId')::uuid;
    exception when others then
      raise exception 'Invalid product';
    end;

    select * into product_row
    from products
    where id = product_uuid
    for update;

    if not found or product_row.status <> 'active' or product_row.stock < qty then
      raise exception 'Insufficient stock for product %', item->>'productId';
    end if;

    update products
    set
      stock = stock - qty,
      status = case when stock - qty <= 0 then 'out-of-stock'::product_status else status end,
      updated_at = now()
    where id = product_row.id;

    insert into order_items (
      order_id,
      product_id,
      product_name_ar,
      product_name_en,
      image,
      size,
      color,
      quantity,
      unit_price
    )
    values (
      order_id,
      product_row.id,
      product_row.name_ar,
      product_row.name_en,
      coalesce(product_row.images[1], '/images/template.svg'),
      left(coalesce(item->>'size', ''), 20),
      left(coalesce(item->>'color', ''), 40),
      qty,
      product_row.sell_price
    );

    computed_total := computed_total + product_row.sell_price * qty;
  end loop;

  update orders set total = computed_total where id = order_id;
  return jsonb_build_object('id', order_id, 'orderNumber', order_no, 'total', computed_total);
end;
$$;

revoke all on function create_order_with_stock(jsonb, jsonb) from public;
revoke execute on function create_order_with_stock(jsonb, jsonb) from anon, authenticated;
grant execute on function create_order_with_stock(jsonb, jsonb) to service_role;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on categories;
create trigger categories_set_updated_at before update on categories
for each row execute function set_updated_at();

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at before update on products
for each row execute function set_updated_at();

drop trigger if exists orders_set_updated_at on orders;
create trigger orders_set_updated_at before update on orders
for each row execute function set_updated_at();

drop trigger if exists contact_messages_set_updated_at on contact_messages;
create trigger contact_messages_set_updated_at before update on contact_messages
for each row execute function set_updated_at();

create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_sku on products(sku);
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_status on products(status);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_contact_messages_status on contact_messages(status);
create index if not exists idx_order_items_order_id on order_items(order_id);

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table contact_messages enable row level security;
alter table admin_users enable row level security;

drop policy if exists "Public can read active categories" on categories;
create policy "Public can read active categories" on categories for select using (is_active = true);

drop policy if exists "Public can read storefront products" on products;
create policy "Public can read storefront products" on products for select using (status in ('active', 'out-of-stock'));

drop policy if exists "Public can create messages" on contact_messages;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true), ('category-images', 'category-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images" on storage.objects
for select using (bucket_id = 'product-images');

drop policy if exists "Public read category images" on storage.objects;
create policy "Public read category images" on storage.objects
for select using (bucket_id = 'category-images');
