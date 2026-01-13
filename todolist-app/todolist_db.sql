--
-- PostgreSQL database dump
--

\restrict y4nkQR1hvHWFRVlxUVAD2hOeWhyCeYQNpYZhH6yRvY0sBgaIOPO0cz5OdRLaWkU

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: todolists; Type: TABLE; Schema: public; Owner: todolist_user
--

CREATE TABLE public.todolists (
    id integer CONSTRAINT todo_lists_id_not_null NOT NULL,
    user_id integer CONSTRAINT todo_lists_user_id_not_null NOT NULL,
    title character varying(255) CONSTRAINT todo_lists_title_not_null NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.todolists OWNER TO todolist_user;

--
-- Name: todo_lists_id_seq; Type: SEQUENCE; Schema: public; Owner: todolist_user
--

CREATE SEQUENCE public.todo_lists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.todo_lists_id_seq OWNER TO todolist_user;

--
-- Name: todo_lists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: todolist_user
--

ALTER SEQUENCE public.todo_lists_id_seq OWNED BY public.todolists.id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: todolist_user
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    todolist_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    completed boolean DEFAULT false,
    priority integer DEFAULT 0,
    due_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.todos OWNER TO todolist_user;

--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: todolist_user
--

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.todos_id_seq OWNER TO todolist_user;

--
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: todolist_user
--

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: todolist_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO todolist_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: todolist_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO todolist_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: todolist_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: todolists id; Type: DEFAULT; Schema: public; Owner: todolist_user
--

ALTER TABLE ONLY public.todolists ALTER COLUMN id SET DEFAULT nextval('public.todo_lists_id_seq'::regclass);


--
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: todolist_user
--

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: todolist_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: todolists; Type: TABLE DATA; Schema: public; Owner: todolist_user
--

COPY public.todolists (id, user_id, title, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: todolist_user
--

COPY public.todos (id, todolist_id, title, description, completed, priority, due_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: todolist_user
--

COPY public.users (id, email, password_hash, created_at, updated_at) FROM stdin;
\.


--
-- Name: todo_lists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: todolist_user
--

SELECT pg_catalog.setval('public.todo_lists_id_seq', 1, false);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: todolist_user
--

SELECT pg_catalog.setval('public.todos_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: todolist_user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: todolists todo_lists_pkey; Type: CONSTRAINT; Schema: public; Owner: todolist_user
--

ALTER TABLE ONLY public.todolists
    ADD CONSTRAINT todo_lists_pkey PRIMARY KEY (id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: todolist_user
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: todolist_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: todolist_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_todolists_user_id; Type: INDEX; Schema: public; Owner: todolist_user
--

CREATE INDEX idx_todolists_user_id ON public.todolists USING btree (user_id);


--
-- Name: idx_todos_completed; Type: INDEX; Schema: public; Owner: todolist_user
--

CREATE INDEX idx_todos_completed ON public.todos USING btree (completed);


--
-- Name: idx_todos_todolist_id; Type: INDEX; Schema: public; Owner: todolist_user
--

CREATE INDEX idx_todos_todolist_id ON public.todos USING btree (todolist_id);


--
-- Name: todolists todo_lists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todolist_user
--

ALTER TABLE ONLY public.todolists
    ADD CONSTRAINT todo_lists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: todos todos_todolist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: todolist_user
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_todolist_id_fkey FOREIGN KEY (todolist_id) REFERENCES public.todolists(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO todolist_user;


--
-- PostgreSQL database dump complete
--

\unrestrict y4nkQR1hvHWFRVlxUVAD2hOeWhyCeYQNpYZhH6yRvY0sBgaIOPO0cz5OdRLaWkU

