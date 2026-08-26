-- deploy/init.sql
-- Esquema inicial de PostgreSQL para Portafolio Web
-- Se ejecuta automáticamente en el primer arranque del contenedor de BD

CREATE TYPE project_type   AS ENUM ('WEB', 'MOBILE');
CREATE TYPE project_status AS ENUM ('IN_PROGRESS', 'COMPLETED', 'MAINTAINED');

-- ============================================================
-- TECHNOLOGIES
-- ============================================================
CREATE TABLE IF NOT EXISTS technologies (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(60)  NOT NULL UNIQUE,
    category    VARCHAR(40)  NOT NULL,
    icon        VARCHAR(255),
    color       VARCHAR(9)   DEFAULT '#888888',
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id                BIGSERIAL PRIMARY KEY,
    title             VARCHAR(120) NOT NULL,
    slug              VARCHAR(140) NOT NULL UNIQUE,
    short_description VARCHAR(200) NOT NULL,
    description       TEXT         NOT NULL,
    type              project_type   NOT NULL DEFAULT 'WEB',
    status            project_status NOT NULL DEFAULT 'COMPLETED',
    repo_url          VARCHAR(500),
    demo_url          VARCHAR(500),
    image_url         VARCHAR(500),
    featured          BOOLEAN      NOT NULL DEFAULT FALSE,
    start_date        DATE,
    end_date          DATE,
    views_count       INT          NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ============================================================
-- PROJECT ↔ TECHNOLOGY (N:M)
-- ============================================================
CREATE TABLE IF NOT EXISTS project_technologies (
    project_id     BIGINT NOT NULL REFERENCES projects(id)     ON DELETE CASCADE,
    technology_id  BIGINT NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, technology_id)
);

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    subject     VARCHAR(150) NOT NULL,
    message     TEXT         NOT NULL,
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    archived    BOOLEAN      NOT NULL DEFAULT FALSE,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(300),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ============================================================
-- ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    enabled       BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_type      ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_featured  ON projects(featured) WHERE featured;
CREATE INDEX IF NOT EXISTS idx_contact_unread     ON contact_messages(is_read) WHERE NOT is_read;
