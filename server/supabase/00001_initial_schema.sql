-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- CATEGORIES TABLE
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  description text,
  image varchar(500),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BOOKS TABLE
create table books (
  id uuid primary key default uuid_generate_v4(),
  title varchar(255) not null,
  author varchar(255) not null,
  description text not null,
  price numeric(10,2) not null,
  image varchar(500) not null,
  category_id uuid references categories(id) on delete set null,
  stock integer default 0,
  "language" varchar(100),
  is_featured boolean default false,
  is_best_seller boolean default false,
  is_new_arrival boolean default false,
  avg_rating numeric(3,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USERS TABLE
create table users (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  email varchar(255) unique not null,
  phone varchar(20),
  password varchar(255) not null,
  is_admin boolean default false,
  addresses jsonb default '[]'::jsonb,
  wishlist jsonb default '[]'::jsonb,
  recently_viewed jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CARTS TABLE
create table carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CART ITEMS TABLE (Since MongoDB had nested items)
create table cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid references carts(id) on delete cascade not null,
  book_id uuid references books(id) on delete cascade not null,
  quantity integer default 1,
  unique(cart_id, book_id)
);

-- ORDERS TABLE
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number varchar(50) unique not null,
  user_id uuid references users(id) on delete cascade not null,
  shipping_address jsonb not null,
  payment_method varchar(50) default 'COD',
  subtotal numeric(10,2) not null,
  delivery_charge numeric(10,2) not null,
  grand_total numeric(10,2) not null,
  status varchar(50) default 'Pending',
  status_history jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDER ITEMS TABLE
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  book_id uuid references books(id) on delete set null,
  title varchar(255) not null,
  author varchar(255) not null,
  price numeric(10,2) not null,
  quantity integer not null,
  image varchar(500)
);



-- REVIEWS TABLE
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  book_id uuid references books(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
