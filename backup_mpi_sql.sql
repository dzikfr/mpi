--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-06-27 14:43:57

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
-- TOC entry 217 (class 1259 OID 21268)
-- Name: fw_asset_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fw_asset_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ref_event_id uuid NOT NULL,
    ref_asset_id uuid NOT NULL,
    ref_assigner_id uuid NOT NULL,
    ref_updater_id uuid DEFAULT gen_random_uuid(),
    quantity_used integer NOT NULL,
    log_date date,
    returned_date date,
    ts_insert timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    updated_at timestamp without time zone DEFAULT now(),
    status character(1) NOT NULL
);


ALTER TABLE public.fw_asset_log OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 21279)
-- Name: fw_event_task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fw_event_task (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ref_event_id uuid NOT NULL,
    ref_assigner_id uuid NOT NULL,
    ref_updater_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    due_at timestamp without time zone,
    completed_at timestamp without time zone,
    notes text,
    status character(1),
    name character varying NOT NULL
);


ALTER TABLE public.fw_event_task OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 21297)
-- Name: fw_user_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fw_user_role (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ref_user_id uuid NOT NULL,
    ref_role_id uuid NOT NULL,
    status character(1) NOT NULL
);


ALTER TABLE public.fw_user_role OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 21288)
-- Name: fw_user_volunteer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fw_user_volunteer (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ref_user_id uuid NOT NULL,
    nik character varying NOT NULL,
    full_name character varying NOT NULL,
    address text,
    age int2vector,
    email character varying NOT NULL,
    phone character varying,
    url_photo character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    status character(1) NOT NULL
);


ALTER TABLE public.fw_user_volunteer OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 21303)
-- Name: fw_volunteer_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fw_volunteer_event (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ref_event_id uuid NOT NULL,
    ref_volunteer_id uuid NOT NULL,
    registered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    verified_at timestamp without time zone,
    ref_verified_id uuid,
    notes text,
    status character(1) NOT NULL
);


ALTER TABLE public.fw_volunteer_event OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 21312)
-- Name: list_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.list_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_name character varying NOT NULL,
    column_name character varying NOT NULL,
    value character varying NOT NULL,
    description text,
    ts_insert timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character(1) NOT NULL
);


ALTER TABLE public.list_data OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 21321)
-- Name: master_asset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_asset (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    type character varying,
    description text,
    quantity integer,
    available_quantity integer,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    photo_url character varying,
    status character(1) NOT NULL
);


ALTER TABLE public.master_asset OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 21330)
-- Name: master_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_event (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    description text,
    notes text,
    date_start date,
    date_end date,
    photo_url character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    status character(1) NOT NULL
);


ALTER TABLE public.master_event OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 21339)
-- Name: master_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_role (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    role_name character varying NOT NULL,
    role_description character varying,
    status character(1) NOT NULL
);


ALTER TABLE public.master_role OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 21347)
-- Name: master_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.master_user (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    status character(1) NOT NULL
);


ALTER TABLE public.master_user OWNER TO postgres;

--
-- TOC entry 4915 (class 0 OID 21268)
-- Dependencies: 217
-- Data for Name: fw_asset_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4916 (class 0 OID 21279)
-- Dependencies: 218
-- Data for Name: fw_event_task; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fw_event_task VALUES ('99f1c3eb-be1c-4f96-8296-ce05fa83cbbd', '137cfd64-8b94-4c15-84e5-9bd3244914f3', '9ffde372-a407-4580-9bb5-3f4c4ee9edad', NULL, '2025-06-27 14:39:49.083661', '2025-06-27 07:00:00', '2025-06-27 07:00:00', 'yes sirr', 'A', 'nobar anime');


--
-- TOC entry 4918 (class 0 OID 21297)
-- Dependencies: 220
-- Data for Name: fw_user_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fw_user_role VALUES ('9392b6b7-2457-4326-ab53-36c10f0d041b', '9ffde372-a407-4580-9bb5-3f4c4ee9edad', 'e58e9a7c-f579-451d-9c7a-d38728252090', 'A');


--
-- TOC entry 4917 (class 0 OID 21288)
-- Dependencies: 219
-- Data for Name: fw_user_volunteer; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fw_user_volunteer VALUES ('25ac3ef2-1ade-43f7-ba71-ca17211f2639', '2318d38b-284c-4bfb-9efd-c8fc887c5ba5', '0190190', 'dzikri fauzi', 'jalan jauh menempuh perjalanan', '21', 'dzikri@gmail.com', '0812345678', 'uploads/1751006693511-[KORIGENGI-Ryuzaky] Yui Yuigahama.png', '2025-06-27 13:44:53.57179', NULL, 'A');


--
-- TOC entry 4919 (class 0 OID 21303)
-- Dependencies: 221
-- Data for Name: fw_volunteer_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fw_volunteer_event VALUES ('f1ec4f13-6d5b-4ebd-bbb2-e22763e5b835', '137cfd64-8b94-4c15-84e5-9bd3244914f3', '25ac3ef2-1ade-43f7-ba71-ca17211f2639', '2025-06-27 07:00:00', NULL, NULL, NULL, 'A');


--
-- TOC entry 4920 (class 0 OID 21312)
-- Dependencies: 222
-- Data for Name: list_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.list_data VALUES ('f9ccd094-158e-4856-b9a9-15fa4b362c37', 'master_asset', 'type', 'Perlengkapan', 'Perlengkapan', '2025-05-28 21:33:08.92168', 'A');
INSERT INTO public.list_data VALUES ('a311f79a-5a23-4bc4-b3ac-d1cb1214cf96', 'master_asset', 'type', 'Elektronik', 'Elektronik', '2025-05-28 21:33:08.92168', 'A');
INSERT INTO public.list_data VALUES ('6d390781-ac1d-47ca-8821-9d0882eb3291', 'master_asset', 'type', 'Kendaraan', 'Kendaraan', '2025-05-28 21:33:08.92168', 'A');
INSERT INTO public.list_data VALUES ('de638529-4ac2-487d-859a-0731f7db880b', 'master_asset', 'type', 'Furniture', 'Furniture', '2025-05-28 21:33:08.92168', 'A');
INSERT INTO public.list_data VALUES ('ef5a0948-8ddf-4aac-9f7a-dc59d5c71516', 'master_asset', 'type', 'Pakaian', 'Pakaian', '2025-05-28 21:33:08.92168', 'A');


--
-- TOC entry 4921 (class 0 OID 21321)
-- Dependencies: 223
-- Data for Name: master_asset; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.master_asset VALUES ('96a80238-647a-42c4-b26c-a3fa2af9b161', 'test asset', 'baru', 'nah', 3, 2, 'ah', '2025-06-27 13:00:27.697588', NULL, NULL, 'A');


--
-- TOC entry 4922 (class 0 OID 21330)
-- Dependencies: 224
-- Data for Name: master_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.master_event VALUES ('ca855464-a6c7-40c9-883d-92416e21f109', 'asset1 update kedua', 'update', 'update event cuy', '2025-06-28', '2025-07-01', 'uploads/1751008128191-Akane Kurokawa.jpg', '2025-06-27 13:05:23.070335', '2025-06-27 14:08:48.257712', 'A');
INSERT INTO public.master_event VALUES ('137cfd64-8b94-4c15-84e5-9bd3244914f3', 'anifest udpate cuy', 'update', 'update event cuy', '2025-06-28', '2025-07-01', 'uploads/1751008199143-Akane Kurokawa.jpg', '2025-06-27 13:46:40.677856', '2025-06-27 14:09:59.190727', 'A');


--
-- TOC entry 4923 (class 0 OID 21339)
-- Dependencies: 225
-- Data for Name: master_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.master_role VALUES ('e58e9a7c-f579-451d-9c7a-d38728252090', 'admin', 'Administrator', 'A');
INSERT INTO public.master_role VALUES ('540b221e-cfd3-4dbd-baa7-3db82004fe3a', 'volunteer', 'Volunteer', 'A');


--
-- TOC entry 4924 (class 0 OID 21347)
-- Dependencies: 226
-- Data for Name: master_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.master_user VALUES ('9ffde372-a407-4580-9bb5-3f4c4ee9edad', 'admin', '$2b$10$igLNWB2/pgfDDOvZrpDtZO5qUkHoP37gfvTPDysFVDOqeCyi1VJHe', '2025-05-28 21:33:08.92168+07', NULL, 'A');
INSERT INTO public.master_user VALUES ('2318d38b-284c-4bfb-9efd-c8fc887c5ba5', 'dzikri', '$2b$10$zB6diSqo1IPXfxa84GORsOAQyUbHXqqwu2ejE/tKTqL4rwHfzzTYy', '2025-06-27 13:44:53.57179+07', NULL, 'A');
INSERT INTO public.master_user VALUES ('a9d0f691-00e8-4043-8272-6b01ae06a20d', 'dzikri', '$2b$10$oPX4iEeOWdd.X01ZQ53KCe4tkQijLqL6gU0vFUFDze5KuhXVPLyyu', '2025-06-27 13:46:41.149542+07', NULL, 'A');
INSERT INTO public.master_user VALUES ('c772da31-52ea-4a73-8d65-ec461fdcfedd', 'dzikri', '$2b$10$ZJSE3sZUZqz007rHtj/ldeBquxXCxN7w.M53aucmDIdFxJpFYbxwi', '2025-06-27 13:57:45.21563+07', NULL, 'A');


--
-- TOC entry 4751 (class 2606 OID 21278)
-- Name: fw_asset_log fw_asset_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fw_asset_log
    ADD CONSTRAINT fw_asset_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4753 (class 2606 OID 21287)
-- Name: fw_event_task fw_event_task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fw_event_task
    ADD CONSTRAINT fw_event_task_pkey PRIMARY KEY (id);


--
-- TOC entry 4759 (class 2606 OID 21311)
-- Name: fw_volunteer_event fw_volunteer_event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fw_volunteer_event
    ADD CONSTRAINT fw_volunteer_event_pkey PRIMARY KEY (id);


--
-- TOC entry 4761 (class 2606 OID 21320)
-- Name: list_data list_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_data
    ADD CONSTRAINT list_data_pkey PRIMARY KEY (id);


--
-- TOC entry 4763 (class 2606 OID 21329)
-- Name: master_asset master_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_asset
    ADD CONSTRAINT master_asset_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 2606 OID 21338)
-- Name: master_event master_event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_event
    ADD CONSTRAINT master_event_pkey PRIMARY KEY (id);


--
-- TOC entry 4755 (class 2606 OID 21296)
-- Name: fw_user_volunteer master_volunteer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fw_user_volunteer
    ADD CONSTRAINT master_volunteer_pkey PRIMARY KEY (id);


--
-- TOC entry 4767 (class 2606 OID 21346)
-- Name: master_role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- TOC entry 4769 (class 2606 OID 21355)
-- Name: master_user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.master_user
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 4757 (class 2606 OID 21302)
-- Name: fw_user_role user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fw_user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);


-- Completed on 2025-06-27 14:43:58

--
-- PostgreSQL database dump complete
--

