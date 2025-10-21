# Asset Pulse - Solution Architecture Document

## Document Information

- **Application Name**: Asset Pulse
- **Version**: 1.0
- **Date**: October 21, 2025
- **Organization**: SCBX Group
- **Target Platform**: Azure Kubernetes Service (AKS)
- **Database**: Azure Database for PostgreSQL Flexible Server

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Azure Infrastructure Design](#3-azure-infrastructure-design)
4. [Application Architecture](#4-application-architecture)
5. [Database Architecture](#5-database-architecture)
6. [Security Architecture](#6-security-architecture)
7. [Observability & Monitoring](#7-observability--monitoring)
8. [CI/CD Pipeline](#8-cicd-pipeline)
9. [Disaster Recovery & Business Continuity](#9-disaster-recovery--business-continuity)
10. [Scalability & Performance](#10-scalability--performance)
11. [Cost Optimization](#11-cost-optimization)
12. [Implementation Roadmap](#12-implementation-roadmap)

---

## 1. Executive Summary

### 1.1 Solution Overview

Asset Pulse is an AI-powered Software Asset Management (SAM) platform designed to run on **Azure Kubernetes Service (AKS)** with **Azure Database for PostgreSQL Flexible Server**. The solution leverages cloud-native architecture patterns to deliver a scalable, highly available, and secure platform for SCBX Group's 25+ subsidiaries.

### 1.2 Key Design Principles

- **Cloud-Native**: Containerized microservices on Kubernetes
- **Scalability**: Horizontal pod autoscaling based on demand
- **High Availability**: Multi-zone deployment with 99.9% SLA
- **Security-First**: Zero-trust network, private endpoints, RBAC
- **Cost-Optimized**: Right-sized resources with autoscaling
- **Observability**: Comprehensive monitoring and distributed tracing

### 1.3 Technology Stack Summary

| Component | Technology | Azure Service |
|-----------|-----------|---------------|
| **Container Orchestration** | Kubernetes | Azure Kubernetes Service (AKS) |
| **Backend API** | Go (Golang) + Fiber | AKS Pods |
| **Frontend** | Next.js (React) | AKS Pods + Azure CDN |
| **Database** | PostgreSQL 15 + pgvector | Azure Database for PostgreSQL Flexible Server |
| **Caching** | Redis | Azure Cache for Redis |
| **Object Storage** | Blob Storage | Azure Blob Storage |
| **API Gateway** | NGINX Ingress | AKS Ingress Controller |
| **Container Registry** | Docker | Azure Container Registry (ACR) |
| **Identity & Access** | OAuth 2.0 / OIDC | Azure AD / Entra ID |
| **Secrets Management** | Kubernetes Secrets | Azure Key Vault |
| **Monitoring** | Prometheus + Grafana | Azure Monitor + Application Insights |
| **Logging** | Fluentd / Fluent Bit | Azure Log Analytics |
| **CI/CD** | GitHub Actions | GitHub Actions + Azure DevOps |
| **LLM Integration** | OpenAI API / Azure OpenAI | Azure OpenAI Service |

---

## 2. High-Level Architecture

### 2.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Internet / Users                                │
│              (Employees, HR, Managers, CTOs across 25+ subsidiaries)        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Azure Front Door / CDN                              │
│                  (Global load balancing, WAF, DDoS protection)              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Azure Kubernetes Service (AKS)                       │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                       NGINX Ingress Controller                         │ │
│  │              (SSL termination, routing, rate limiting)                 │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                      │                                       │
│         ┌────────────────────────────┼────────────────────────────┐         │
│         ▼                            ▼                            ▼         │
│  ┌─────────────┐           ┌─────────────────┐          ┌──────────────┐  │
│  │  Frontend   │           │   Backend API   │          │   Worker     │  │
│  │  Next.js    │           │   (Go/Golang)   │          │   Pods       │  │
│  │  Pods       │           │   Pods          │          │              │  │
│  │             │           │                 │          │  - LLM Jobs  │  │
│  │ • React UI  │◄─────────►│  • REST API     │          │  - Analytics │  │
│  │ • SSR       │           │  • Auth/RBAC    │          │  - Reports   │  │
│  │ • Static    │           │  • Business     │          │              │  │
│  │   Assets    │           │    Logic        │          │              │  │
│  │             │           │  • LLM Client   │          │              │  │
│  └─────────────┘           └─────────────────┘          └──────────────┘  │
│         │                            │                            │         │
│         └────────────────────────────┼────────────────────────────┘         │
│                                      │                                       │
└──────────────────────────────────────┼───────────────────────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
         ┌────────────────────┐  ┌──────────────┐  ┌──────────────────┐
         │   Azure Cache      │  │  Azure DB    │  │  Azure OpenAI    │
         │   for Redis        │  │  PostgreSQL  │  │  Service         │
         │                    │  │  Flexible    │  │                  │
         │  • Session cache   │  │              │  │  • GPT-4o        │
         │  • LLM cache       │  │  • Core data │  │  • Embeddings    │
         │  • Rate limiting   │  │  • pgvector  │  │  • Claude backup │
         └────────────────────┘  └──────────────┘  └──────────────────┘
                    │                  │                  
                    ▼                  ▼                  
         ┌────────────────────┐  ┌──────────────┐
         │  Azure Key Vault   │  │  Azure Blob  │
         │                    │  │  Storage     │
         │  • API keys        │  │              │
         │  • DB credentials  │  │  • Backups   │
         │  • Certificates    │  │  • Reports   │
         └────────────────────┘  │  • Logs      │
                                 └──────────────┘
                    │
                    ▼
         ┌────────────────────────────────────────┐
         │     Azure Monitor & Log Analytics      │
         │                                        │
         │  • Application Insights (APM)          │
         │  • Container Insights                  │
         │  • Prometheus + Grafana                │
         │  • Alerting & Dashboards               │
         └────────────────────────────────────────┘
```

### 2.2 Network Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Azure Subscription (SCBX Group)                      │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                   Resource Group: asset-pulse-prod                │ │
│  │  ┌─────────────────────────────────────────────────────────────┐ │ │
│  │  │              Virtual Network (VNet): asset-pulse-vnet       │ │ │
│  │  │                   Address Space: 10.0.0.0/16                │ │ │
│  │  │                                                              │ │ │
│  │  │  ┌────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │  Subnet: aks-nodes (10.0.1.0/24)                       │ │ │ │
│  │  │  │  • AKS node pools                                      │ │ │ │
│  │  │  │  • System pods                                         │ │ │ │
│  │  │  │  • Application pods                                    │ │ │ │
│  │  │  └────────────────────────────────────────────────────────┘ │ │ │
│  │  │                                                              │ │ │
│  │  │  ┌────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │  Subnet: aks-internal-lb (10.0.2.0/24)                │ │ │ │
│  │  │  │  • Internal load balancers                            │ │ │ │
│  │  │  │  • Private endpoints                                  │ │ │ │
│  │  │  └────────────────────────────────────────────────────────┘ │ │ │
│  │  │                                                              │ │ │
│  │  │  ┌────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │  Subnet: postgres-subnet (10.0.3.0/24)                │ │ │ │
│  │  │  │  • Azure PostgreSQL Flexible Server                   │ │ │ │
│  │  │  │  • Private endpoint                                   │ │ │ │
│  │  │  └────────────────────────────────────────────────────────┘ │ │ │
│  │  │                                                              │ │ │
│  │  │  ┌────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │  Subnet: redis-subnet (10.0.4.0/24)                   │ │ │ │
│  │  │  │  • Azure Cache for Redis                              │ │ │ │
│  │  │  │  • Private endpoint                                   │ │ │ │
│  │  │  └────────────────────────────────────────────────────────┘ │ │ │
│  │  │                                                              │ │ │
│  │  │  ┌────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │  Subnet: gateway-subnet (10.0.10.0/24)                │ │ │ │
│  │  │  │  • Application Gateway / Azure Front Door              │ │ │ │
│  │  │  └────────────────────────────────────────────────────────┘ │ │ │
│  │  │                                                              │ │ │
│  │  └─────────────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘

Security Groups / NSGs:
• Deny all inbound by default
• Allow HTTPS (443) from Azure Front Door to Ingress
• Allow AKS → PostgreSQL (5432) within VNet
• Allow AKS → Redis (6380) within VNet
• Allow AKS → Azure OpenAI (HTTPS) via Service Endpoint
• Private DNS zones for private endpoints
```

---

## 3. Azure Infrastructure Design

### 3.1 Azure Kubernetes Service (AKS) Configuration

#### Cluster Specifications

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Cluster Name** | `asset-pulse-aks-prod` | Production environment identifier |
| **Kubernetes Version** | 1.28+ (stable channel) | LTS with managed upgrades |
| **Network Plugin** | Azure CNI | Advanced networking with VNet integration |
| **Network Policy** | Calico | Granular pod-to-pod security |
| **Availability Zones** | 3 zones (Southeast Asia) | High availability and fault tolerance |
| **Cluster Autoscaler** | Enabled | Cost optimization |
| **Pod Security** | Azure Policy for Kubernetes | Enforce security baselines |

#### Node Pool Configuration

**System Node Pool** (for Kubernetes system pods):
- VM Size: `Standard_D4s_v5` (4 vCPU, 16 GB RAM)
- Node Count: 3 (one per zone)
- Autoscaling: No (fixed size)
- OS Disk: 128 GB Premium SSD
- Taints: `CriticalAddonsOnly=true:NoSchedule`

**Application Node Pool** (for application workloads):
- VM Size: `Standard_D8s_v5` (8 vCPU, 32 GB RAM)
- Node Count: 3-10 (autoscaling)
- Autoscaling: Yes (min 3, max 10)
- OS Disk: 256 GB Premium SSD
- Node Labels: `workload=application`

**Worker Node Pool** (for background jobs, LLM processing):
- VM Size: `Standard_E4s_v5` (4 vCPU, 32 GB RAM, memory-optimized)
- Node Count: 2-8 (autoscaling)
- Autoscaling: Yes (min 2, max 8)
- OS Disk: 128 GB Premium SSD
- Node Labels: `workload=worker`
- Taints: `workload=worker:NoSchedule`

#### AKS Add-ons

- **Azure Monitor for Containers**: Enabled
- **Azure Policy**: Enabled
- **Application Gateway Ingress Controller** (AGIC): Optional alternative to NGINX
- **Microsoft Defender for Containers**: Enabled
- **Azure Key Vault Secrets Provider**: Enabled (CSI driver)

### 3.2 Azure Database for PostgreSQL Flexible Server

#### Database Specifications

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Server Name** | `asset-pulse-postgres-prod` | Unique Azure DNS name |
| **PostgreSQL Version** | 15 | Latest stable with pgvector support |
| **Compute Tier** | General Purpose | Balance of performance and cost |
| **VM Size** | `Standard_D4ds_v4` (4 vCPU, 16 GB RAM) | Sufficient for 1000+ concurrent users |
| **Storage** | 512 GB, auto-grow enabled | Accommodate usage events and embeddings |
| **Storage Type** | Premium SSD (P30) | Low latency for analytics queries |
| **IOPS** | 5000 IOPS | High transaction throughput |
| **Backup Retention** | 30 days | Compliance requirement |
| **Geo-Redundant Backup** | Enabled | Disaster recovery |
| **High Availability** | Zone-redundant | 99.99% SLA |
| **Network** | Private endpoint only | Security isolation |

#### PostgreSQL Extensions

```sql
-- Required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "vector";         -- pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- Query performance monitoring
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Fuzzy text search
```

#### Database Configuration

```conf
# Connection pooling (via PgBouncer sidecar in AKS)
max_connections = 200
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 64MB
maintenance_work_mem = 512MB

# Query performance
random_page_cost = 1.1
effective_io_concurrency = 200

# WAL and replication
wal_level = replica
max_wal_senders = 5
checkpoint_timeout = 15min
max_wal_size = 4GB
```

### 3.3 Azure Cache for Redis

#### Redis Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Cache Name** | `asset-pulse-redis-prod` | Unique identifier |
| **SKU** | Premium P1 (6 GB) | Redis cluster with persistence |
| **Replicas** | 1 replica | High availability |
| **Clustering** | Enabled | Horizontal scalability |
| **Persistence** | RDB snapshot (every 15 min) | Data durability |
| **Network** | Private endpoint only | Security isolation |
| **TLS** | 1.2 minimum | Encrypted in-transit |

#### Redis Usage Patterns

1. **Session Store**: User sessions (JWT token cache, 8-hour TTL)
2. **LLM Response Cache**: Cache GPT-4o responses (24-hour TTL)
3. **Rate Limiting**: API rate limits per user/IP
4. **Application Cache**: Frequently accessed data (app catalog, user roles)
5. **Job Queue**: Background job orchestration (optional, can use Redis Queue)

### 3.4 Azure Container Registry (ACR)

| Parameter | Value |
|-----------|-------|
| **Registry Name** | `assetpulseacr` |
| **SKU** | Premium (geo-replication, private endpoint) |
| **Admin Account** | Disabled (use AKS managed identity) |
| **Content Trust** | Enabled (image signing) |
| **Quarantine** | Enabled (security scanning) |
| **Geo-Replication** | Southeast Asia + East Asia |

### 3.5 Azure OpenAI Service

| Parameter | Value |
|-----------|-------|
| **Resource Name** | `asset-pulse-openai-prod` |
| **Region** | East US (GPT-4o availability) |
| **Deployments** | |
| - GPT-4o | 50K TPM (tokens per minute) |
| - GPT-4o-mini | 100K TPM |
| - text-embedding-3-large | 100K TPM |
| **Network** | Public endpoint with VNet service endpoint |
| **Key Management** | Azure Key Vault integration |

**Cost Estimation**:
- GPT-4o: $0.005/1K input tokens, $0.015/1K output tokens
- GPT-4o-mini: $0.00015/1K input tokens, $0.0006/1K output tokens
- text-embedding-3-large: $0.00013/1K tokens
- Estimated: ~$500-1000/month for 10K recommendations/month

### 3.6 Additional Azure Services

#### Azure Front Door
- **Purpose**: Global load balancing, WAF, CDN
- **SKU**: Standard (WAF included)
- **WAF Policy**: OWASP ModSecurity 3.2 ruleset
- **Features**: DDoS protection, SSL offload, geo-filtering

#### Azure Key Vault
- **Purpose**: Secrets, keys, certificates management
- **SKU**: Standard (sufficient for most use cases)
- **Access Policy**: AKS Workload Identity integration
- **Secrets**: DB passwords, API keys, JWT signing keys

#### Azure Blob Storage
- **Purpose**: Backup storage, report files, logs archive
- **Account Type**: StorageV2 (General Purpose v2)
- **Replication**: GRS (Geo-redundant storage)
- **Access Tier**: Hot (backups), Cool (archived logs)

#### Azure Monitor & Application Insights
- **Purpose**: Observability and monitoring
- **Log Analytics Workspace**: Centralized logging
- **Retention**: 90 days (compliance)
- **Alerts**: PagerDuty/Slack integration

---

## 4. Application Architecture

### 4.1 Microservices Architecture (Modular Monolith → Microservices Ready)

#### Phase 1: Modular Monolith (MVP)

Single Go application with modular design for future decomposition:

```
┌─────────────────────────────────────────────────────────────┐
│              Backend API Pod (Go Application)                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                   HTTP Router (Fiber)                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────┼────────────────────────────┐   │
│  │         Handler Layer (Controllers)                   │   │
│  │  • auth_handler                                       │   │
│  │  • license_handler                                    │   │
│  │  • recommendation_handler                             │   │
│  │  • template_handler                                   │   │
│  │  • request_handler                                    │   │
│  └────────────────────────┼────────────────────────────┘   │
│                           │                                  │
│  ┌────────────────────────┼────────────────────────────┐   │
│  │           Usecase Layer (Business Logic)              │   │
│  │  • AuthUsecase                                        │   │
│  │  • LicenseUsecase                                     │   │
│  │  • RecommendationUsecase (6 features)                 │   │
│  │  • TemplateUsecase                                    │   │
│  │  • RequestUsecase                                     │   │
│  └────────────────────────┼────────────────────────────┘   │
│                           │                                  │
│  ┌────────────────────────┼────────────────────────────┐   │
│  │       Repository Layer (Data Access)                  │   │
│  │  • DatabaseRepository (GORM)                          │   │
│  │  • CacheRepository (Redis)                            │   │
│  └────────────────────────┼────────────────────────────┘   │
│                           │                                  │
│  ┌────────────────────────┴────────────────────────────┐   │
│  │            Utility Layer (Shared Services)            │   │
│  │  • LLM Client (OpenAI, Claude)                        │   │
│  │  • Logger                                             │   │
│  │  • Error Handler                                      │   │
│  │  • JWT Validator                                      │   │
│  └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Deployment**:
- 3-6 replicas (horizontal pod autoscaling)
- Resource limits: 1 CPU, 2 GB RAM per pod
- Liveness/readiness probes: `/health`, `/ready`

#### Phase 2: Microservices Decomposition (Future)

When traffic exceeds 10K users or team size > 10 developers:

1. **Auth Service**: Authentication, authorization, user management
2. **License Service**: License CRUD, inventory management
3. **Recommendation Service**: AI/LLM recommendation engine (6 features)
4. **Workflow Service**: Approval workflow, request management
5. **Analytics Service**: Usage analytics, reporting
6. **Notification Service**: Email, Slack, in-app notifications

### 4.2 Frontend Architecture

**Next.js Application** (Server-Side Rendering + Static Generation)

```
┌─────────────────────────────────────────────────────────────┐
│                  Frontend Pod (Next.js)                      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 Next.js Server (Node.js)               │ │
│  │  • SSR for dynamic pages                              │ │
│  │  • Static generation for public pages                 │ │
│  │  • API routes for BFF pattern                         │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────┼────────────────────────────┐   │
│  │              React Component Tree                     │   │
│  │  Pages:                                               │   │
│  │  • /login                                             │   │
│  │  • /dashboard (employee/hr/manager/cto)               │   │
│  │  • /recommendations                                   │   │
│  │  • /templates                                         │   │
│  │  • /approvals                                         │   │
│  │  • /analytics                                         │   │
│  └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Deployment**:
- 2-4 replicas (autoscaling)
- Resource limits: 500m CPU, 1 GB RAM per pod
- Static assets served via Azure CDN (CloudFront alternative)
- Image optimization via Next.js built-in optimizer

### 4.3 Worker Pods Architecture

**Background Job Processing** (Go workers)

```
┌─────────────────────────────────────────────────────────────┐
│                     Worker Pods (Go)                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              Job Queue Consumer (Redis)                │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────┼────────────────────────────┐   │
│  │                  Job Processors                        │   │
│  │  • LLM Batch Processing (similarity analysis)         │   │
│  │  • Usage Analytics Aggregation                        │   │
│  │  • Report Generation                                  │   │
│  │  • Notification Dispatch                              │   │
│  │  • Data Export/Import                                 │   │
│  └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Deployment**:
- 2-8 replicas (autoscaling based on queue depth)
- Resource limits: 1 CPU, 4 GB RAM per pod (memory-optimized)
- Node affinity: Worker node pool
- Tolerations: `workload=worker:NoSchedule`

### 4.4 Container Images

#### Backend API Image (Go)

**Dockerfile** (Multi-stage build):

```dockerfile
# Stage 1: Builder
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Stage 2: Runtime
FROM alpine:3.18
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

**Image Size**: ~20-30 MB (compiled Go binary)
**Build Time**: ~2-3 minutes

#### Frontend Image (Next.js)

**Dockerfile**:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

**Image Size**: ~150-200 MB
**Build Time**: ~5-7 minutes

---

## 5. Database Architecture

### 5.1 PostgreSQL Schema Overview

**Database Name**: `asset_pulse_prod`

**Schema Organization**:

```sql
-- Core Schemas
CREATE SCHEMA org;        -- Organization, companies, departments
CREATE SCHEMA auth;       -- Users, roles, permissions
CREATE SCHEMA catalog;    -- Apps, features, vendors
CREATE SCHEMA license;    -- Contracts, inventories, assignments
CREATE SCHEMA usage;      -- Usage events, analytics
CREATE SCHEMA ai;         -- Recommendations, embeddings, similarities
CREATE SCHEMA workflow;   -- Requests, approvals, memos
CREATE SCHEMA audit;      -- Audit logs, notifications
```

**Table Count**: 30+ tables (as per `0001_initial_tables.sql`)

### 5.2 High-Traffic Tables

| Table | Estimated Rows | Growth Rate | Partitioning Strategy |
|-------|---------------|-------------|----------------------|
| `usage_events` | 10M+ | 100K/day | Range partition by month |
| `license_assignments` | 100K | 1K/month | No partitioning |
| `recommendations` | 50K | 500/day | Range partition by quarter |
| `audit_logs` | 5M+ | 50K/day | Range partition by month |
| `app_feature_embeddings` | 10K | 100/month | No partitioning |

### 5.3 Partitioning Strategy

**Usage Events** (high-volume time-series data):

```sql
CREATE TABLE usage_events (
    event_id BIGSERIAL,
    user_id INTEGER NOT NULL,
    app_id INTEGER NOT NULL,
    event_at TIMESTAMP NOT NULL,
    event_type VARCHAR(50),
    event_value JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (event_id, event_at)
) PARTITION BY RANGE (event_at);

-- Monthly partitions
CREATE TABLE usage_events_2025_10 PARTITION OF usage_events
    FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

CREATE TABLE usage_events_2025_11 PARTITION OF usage_events
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- Automated partition management via pg_partman or cron job
```

### 5.4 Indexing Strategy

**Key Indexes**:

```sql
-- Usage analytics queries
CREATE INDEX idx_usage_user_app_time ON usage_events (user_id, app_id, event_at DESC);
CREATE INDEX idx_usage_app_time ON usage_events (app_id, event_at DESC);
CREATE INDEX idx_usage_time ON usage_events (event_at DESC);

-- License lookups
CREATE INDEX idx_license_user_app ON license_assignments (user_id, app_id);
CREATE INDEX idx_license_status ON license_assignments (status, expires_at);

-- Recommendations
CREATE INDEX idx_rec_type_status ON recommendations (rec_type, status);
CREATE INDEX idx_rec_user ON recommendations (user_id, status);

-- pgvector similarity search
CREATE INDEX idx_app_embedding_vector ON app_feature_embeddings 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
```

### 5.5 Connection Pooling

**PgBouncer Sidecar Pattern**:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: pgbouncer-config
data:
  pgbouncer.ini: |
    [databases]
    asset_pulse_prod = host=asset-pulse-postgres-prod.postgres.database.azure.com port=5432 dbname=asset_pulse_prod
    
    [pgbouncer]
    listen_addr = 0.0.0.0
    listen_port = 6432
    auth_type = md5
    auth_file = /etc/pgbouncer/userlist.txt
    pool_mode = transaction
    max_client_conn = 1000
    default_pool_size = 25
    reserve_pool_size = 5
    server_idle_timeout = 600
    log_connections = 1
    log_disconnections = 1
```

**Connection String** (from application):
```
postgresql://user:pass@localhost:6432/asset_pulse_prod?sslmode=require
```

### 5.6 Backup Strategy

**Automated Backups** (Azure managed):
- **Full Backup**: Daily at 2:00 AM UTC
- **Point-in-Time Recovery**: Enabled (5-minute RPO)
- **Retention**: 30 days
- **Geo-Replication**: Async replication to East Asia region

**Manual Backups** (via CronJob):
- **pg_dump**: Weekly full dump to Azure Blob Storage
- **Schema-only backup**: Daily (for quick restore testing)

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
spec:
  schedule: "0 3 * * 0"  # Every Sunday at 3 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: pg-dump
            image: postgres:15-alpine
            command:
            - /bin/sh
            - -c
            - |
              pg_dump -h $PGHOST -U $PGUSER -d asset_pulse_prod -F c -f /backup/asset_pulse_$(date +%Y%m%d).dump
              az storage blob upload --file /backup/*.dump --container backups
            env:
            - name: PGHOST
              value: "asset-pulse-postgres-prod.postgres.database.azure.com"
            - name: PGUSER
              valueFrom:
                secretKeyRef:
                  name: postgres-credentials
                  key: username
          restartPolicy: OnFailure
```

---

## 6. Security Architecture

### 6.1 Zero-Trust Network Model

**Principles**:
1. **No implicit trust**: Verify every request
2. **Least privilege**: Minimum required permissions
3. **Assume breach**: Defense in depth

**Implementation**:
- Network policies (Calico) for pod-to-pod communication
- Private endpoints for all Azure PaaS services
- No public IP addresses for database/Redis
- Service mesh (optional: Linkerd/Istio) for mTLS

### 6.2 Authentication & Authorization

#### Identity Provider Integration

**Azure AD / Entra ID** (SSO):
- OAuth 2.0 / OIDC integration
- SAML 2.0 support for enterprise SSO
- Multi-Factor Authentication (MFA) required for admin roles

**JWT Token Flow**:

```
User → Azure AD → Token → API Gateway → Validate JWT → Backend API
                                          ↓
                                    Redis (token cache)
```

**JWT Claims**:
```json
{
  "sub": "user_id",
  "email": "user@scb.co.th",
  "roles": ["employee", "dept_manager"],
  "company_code": "SCB",
  "department_code": "IT",
  "exp": 1729540800
}
```

#### Role-Based Access Control (RBAC)

**Kubernetes RBAC** (infrastructure level):
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: app-deployer
rules:
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "update", "patch"]
```

**Application RBAC** (business logic level):
- Defined in `roles` and `user_roles` tables
- Scope-based permissions (user/app/dept/subsidiary/group)
- Enforced in Go middleware (`handler/middleware/rbac.go`)

### 6.3 Secrets Management

**Azure Key Vault Integration**:

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-keyvault
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    userAssignedIdentityID: "<managed-identity-client-id>"
    keyvaultName: "asset-pulse-keyvault"
    objects: |
      array:
        - |
          objectName: postgres-password
          objectType: secret
          objectVersion: ""
        - |
          objectName: redis-password
          objectType: secret
          objectVersion: ""
        - |
          objectName: openai-api-key
          objectType: secret
          objectVersion: ""
        - |
          objectName: jwt-signing-key
          objectType: secret
          objectVersion: ""
    tenantId: "<azure-tenant-id>"
```

**Secrets Rotation**:
- Automated rotation: 90 days
- Zero-downtime rotation via versioned secrets
- Audit trail in Key Vault logs

### 6.4 Network Security

**Network Security Groups (NSGs)**:

```hcl
# Terraform configuration
resource "azurerm_network_security_group" "aks_nsg" {
  name                = "aks-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  # Allow HTTPS from Azure Front Door
  security_rule {
    name                       = "AllowFrontDoor"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "AzureFrontDoor.Backend"
    destination_address_prefix = "*"
  }

  # Deny all other inbound
  security_rule {
    name                       = "DenyAllInbound"
    priority                   = 4096
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}
```

**Calico Network Policies** (pod-level):

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-api-policy
spec:
  podSelector:
    matchLabels:
      app: backend-api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx-ingress
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - podSelector:
        matchLabels:
          app: redis
    ports:
    - protocol: TCP
      port: 6379
  - to:
    - namespaceSelector: {}
      podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - protocol: UDP
      port: 53
```

### 6.5 Data Protection

**Encryption at Rest**:
- AKS: Azure Disk Encryption with customer-managed keys (CMK)
- PostgreSQL: Transparent Data Encryption (TDE) enabled
- Redis: Azure Storage encryption enabled
- Blob Storage: AES-256 encryption

**Encryption in Transit**:
- TLS 1.2/1.3 for all external connections
- mTLS for internal pod-to-pod (via service mesh, optional)
- PostgreSQL: `sslmode=require`
- Redis: TLS enabled (port 6380)

**Data Masking** (PII protection):
```sql
-- Dynamic data masking for sensitive columns
ALTER TABLE users 
  ALTER COLUMN email 
  SET MASKED WITH (FUNCTION = 'email()');

ALTER TABLE users 
  ALTER COLUMN phone_number 
  SET MASKED WITH (FUNCTION = 'partial(0,"XXX-XXX-",4)');
```

### 6.6 Compliance & Auditing

**Audit Logging**:
- All API requests logged to `audit_logs` table
- PostgreSQL query logs to Azure Log Analytics
- Kubernetes audit logs enabled
- Retention: 90 days (compliance requirement)

**Compliance Standards**:
- SOC 2 Type II (target)
- ISO 27001 (SCBX Group requirement)
- PDPA (Thailand Personal Data Protection Act)
- Azure Policy compliance checks

---

## 7. Observability & Monitoring

### 7.1 Monitoring Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Architecture                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Application Instrumentation                │  │
│  │  • Go: OpenTelemetry SDK                             │  │
│  │  • Next.js: OpenTelemetry JS                         │  │
│  │  • Custom metrics (Prometheus client)                │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│         ┌─────────────────┼─────────────────┐               │
│         ▼                 ▼                 ▼               │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Prometheus  │  │  Azure Mon   │  │  App         │      │
│  │             │  │  (Metrics)   │  │  Insights    │      │
│  │ • Metrics   │  │              │  │  (APM)       │      │
│  │ • Alerts    │  │ • Container  │  │              │      │
│  └─────────────┘  │   Insights   │  │ • Traces     │      │
│         │         │ • VM Metrics │  │ • Logs       │      │
│         ▼         └──────────────┘  │ • Exceptions │      │
│  ┌─────────────┐         │          └──────────────┘      │
│  │  Grafana    │◄────────┘                 │               │
│  │  Dashboards │                           │               │
│  └─────────────┘                           │               │
│                                            ▼               │
│                                 ┌────────────────────┐     │
│                                 │  Log Analytics     │     │
│                                 │  Workspace         │     │
│                                 │                    │     │
│                                 │  • Centralized     │     │
│                                 │    logging         │     │
│                                 │  • KQL queries     │     │
│                                 └────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Key Metrics

#### Application Metrics (Custom + Prometheus)

**Backend API**:
- `api_requests_total{method, endpoint, status}` - Request count
- `api_request_duration_seconds{method, endpoint}` - Request latency (histogram)
- `api_active_connections` - Active HTTP connections
- `llm_requests_total{model, status}` - LLM API calls
- `llm_request_duration_seconds{model}` - LLM response time
- `llm_tokens_used_total{model, type}` - Token consumption (input/output)
- `db_query_duration_seconds{query_type}` - Database query latency
- `cache_hit_ratio` - Redis cache hit rate
- `recommendation_generation_total{feature}` - Recommendations by type

**Frontend**:
- `page_views_total{page}` - Page views
- `user_sessions_active` - Active user sessions
- `frontend_errors_total{type}` - Client-side errors

#### Infrastructure Metrics (Azure Monitor)

**AKS**:
- Node CPU/Memory utilization
- Pod count per node
- Pod restarts
- Network I/O

**PostgreSQL**:
- CPU/Memory utilization
- Active connections
- Transaction rate (commits/sec)
- Query execution time
- Deadlocks
- Replication lag

**Redis**:
- CPU/Memory utilization
- Cache hit rate
- Evicted keys
- Connected clients

### 7.3 Distributed Tracing

**OpenTelemetry Integration**:

```go
// Go backend tracing
import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/trace"
    "go.opentelemetry.io/contrib/instrumentation/github.com/gofiber/fiber/otelfiber"
)

func main() {
    // Initialize tracer
    tp := initTracer()
    defer tp.Shutdown(context.Background())
    
    app := fiber.New()
    
    // Auto-instrument Fiber
    app.Use(otelfiber.Middleware())
    
    // Manual span creation
    app.Get("/recommendations/jd-match", func(c *fiber.Ctx) error {
        ctx := c.UserContext()
        tracer := otel.Tracer("asset-pulse-api")
        
        ctx, span := tracer.Start(ctx, "jd_match_recommendation")
        defer span.End()
        
        // Call LLM with traced context
        recommendations, err := llmClient.GenerateRecommendations(ctx, jobDescription)
        
        span.SetAttributes(
            attribute.Int("recommendation.count", len(recommendations)),
            attribute.String("recommendation.model", "gpt-4o"),
        )
        
        return c.JSON(recommendations)
    })
}
```

**Trace Visualization**: Azure Application Insights (Application Map, Transaction Search)

### 7.4 Logging Strategy

**Log Levels**:
- `ERROR`: System errors, exceptions
- `WARN`: Degraded performance, fallback logic
- `INFO`: Business events (recommendation generated, request approved)
- `DEBUG`: Detailed troubleshooting (disabled in production)

**Structured Logging** (JSON format):

```go
import "github.com/rs/zerolog/log"

log.Info().
    Str("user_id", userID).
    Str("feature", "jd_match").
    Int("recommendations", count).
    Dur("duration", elapsed).
    Msg("Generated recommendations")
```

**Log Aggregation**:
- Fluent Bit daemonset on each node
- Forward to Azure Log Analytics
- Retention: 90 days
- KQL queries for analysis

**Example KQL Query** (top 10 slowest API endpoints):

```kql
ContainerLog
| where ContainerName == "backend-api"
| extend json = parse_json(LogEntry)
| where json.level == "INFO" and json.api_duration_ms > 0
| summarize avg_duration=avg(tolong(json.api_duration_ms)), request_count=count() by tostring(json.endpoint)
| order by avg_duration desc
| take 10
```

### 7.5 Alerting Rules

**Critical Alerts** (PagerDuty):
- API error rate > 5% (5-minute window)
- API p99 latency > 3s (5-minute window)
- Database connection pool exhausted
- Pod crash loop (3 restarts in 10 minutes)
- Node not ready > 5 minutes

**Warning Alerts** (Slack):
- API error rate > 1% (10-minute window)
- LLM API error rate > 5% (fallback to rule-based)
- Cache hit rate < 70%
- Database slow query > 5s
- Disk utilization > 80%

**Example Prometheus Alert**:

```yaml
groups:
- name: api_alerts
  rules:
  - alert: HighErrorRate
    expr: |
      sum(rate(api_requests_total{status=~"5.."}[5m])) /
      sum(rate(api_requests_total[5m])) > 0.05
    for: 5m
    labels:
      severity: critical
      team: backend
    annotations:
      summary: "High API error rate ({{ $value | humanizePercentage }})"
      description: "API error rate is above 5% for the last 5 minutes"
```

### 7.6 Dashboards

**Grafana Dashboards**:

1. **Application Overview**:
   - Request rate, error rate, latency (RED metrics)
   - Active users, sessions
   - LLM usage and costs
   
2. **Infrastructure Overview**:
   - AKS cluster health
   - Node/pod resource utilization
   - Database/Redis metrics
   
3. **Business Metrics**:
   - Recommendations generated per feature
   - Approval workflow metrics
   - License utilization trends
   - Cost savings realized

4. **LLM Cost Tracking**:
   - Tokens consumed by model
   - Cost per recommendation
   - Cache hit rate impact

---

## 8. CI/CD Pipeline

### 8.1 Pipeline Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
│                   (asset-pulse-web, asset-pulse-api)         │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ git push / PR
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Actions                           │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Stage 1: Build                                        │ │
│  │  • Checkout code                                       │ │
│  │  • Run tests (unit, integration)                      │ │
│  │  • Build Docker images                                │ │
│  │  • Security scan (Trivy, Snyk)                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Stage 2: Push                                         │ │
│  │  • Tag image (git SHA, semantic version)              │ │
│  │  • Push to Azure Container Registry                   │ │
│  │  • Sign image (Notary/Cosign)                         │ │
│  └───────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Stage 3: Deploy (Dev/Staging/Prod)                   │ │
│  │  • Update Kubernetes manifests (Kustomize/Helm)       │ │
│  │  • Apply to AKS cluster (kubectl/ArgoCD)              │ │
│  │  • Run smoke tests                                    │ │
│  │  • Promote to production (manual approval)            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Azure Kubernetes Service (AKS)                  │
│                    (Dev / Staging / Prod)                    │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 GitHub Actions Workflow

**Backend CI/CD** (`.github/workflows/backend-ci-cd.yml`):

```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'asset-pulse-api/**'
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: assetpulseacr.azurecr.io
  IMAGE_NAME: backend-api
  AKS_CLUSTER: asset-pulse-aks-prod
  AKS_RESOURCE_GROUP: asset-pulse-prod

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'
      
      - name: Run tests
        run: |
          cd asset-pulse-api
          go test ./... -v -race -coverprofile=coverage.out
          go tool cover -html=coverage.out -o coverage.html
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./asset-pulse-api/coverage.out

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      
      - name: Login to ACR
        uses: azure/docker-login@v1
        with:
          login-server: ${{ env.REGISTRY }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
      
      - name: Build and push Docker image
        run: |
          cd asset-pulse-api
          docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} .
          docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest .
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
      
      - name: Security scan (Trivy)
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  deploy-dev:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: development
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Set AKS context
        uses: azure/aks-set-context@v3
        with:
          resource-group: ${{ env.AKS_RESOURCE_GROUP }}
          cluster-name: ${{ env.AKS_CLUSTER }}
      
      - name: Deploy to AKS (Dev)
        run: |
          kubectl set image deployment/backend-api \
            backend-api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n development
          kubectl rollout status deployment/backend-api -n development

  deploy-prod:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/checkout@v4
      
      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
      
      - name: Set AKS context
        uses: azure/aks-set-context@v3
        with:
          resource-group: ${{ env.AKS_RESOURCE_GROUP }}
          cluster-name: ${{ env.AKS_CLUSTER }}
      
      - name: Deploy to AKS (Prod) - Canary
        run: |
          # Update canary deployment (10% traffic)
          kubectl set image deployment/backend-api-canary \
            backend-api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n production
          kubectl rollout status deployment/backend-api-canary -n production
          
          # Wait for smoke tests (manual or automated)
          sleep 300
          
          # Full rollout
          kubectl set image deployment/backend-api \
            backend-api=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -n production
          kubectl rollout status deployment/backend-api -n production
```

### 8.3 Deployment Strategies

#### Blue-Green Deployment (Zero Downtime)

```yaml
# Blue deployment (current production)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api-blue
  labels:
    app: backend-api
    version: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend-api
      version: blue
  template:
    metadata:
      labels:
        app: backend-api
        version: blue
    spec:
      containers:
      - name: backend-api
        image: assetpulseacr.azurecr.io/backend-api:v1.2.0

---
# Green deployment (new version)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api-green
  labels:
    app: backend-api
    version: green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend-api
      version: green
  template:
    metadata:
      labels:
        app: backend-api
        version: green
    spec:
      containers:
      - name: backend-api
        image: assetpulseacr.azurecr.io/backend-api:v1.3.0

---
# Service (switch between blue and green)
apiVersion: v1
kind: Service
metadata:
  name: backend-api
spec:
  selector:
    app: backend-api
    version: blue  # Switch to "green" for cutover
  ports:
  - port: 8080
    targetPort: 8080
```

**Rollback Process**:
```bash
# Instant rollback by switching service selector
kubectl patch service backend-api -p '{"spec":{"selector":{"version":"blue"}}}'
```

### 8.4 Database Migrations

**Liquibase/Flyway for PostgreSQL**:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration-v1-3-0
spec:
  template:
    spec:
      containers:
      - name: flyway
        image: flyway/flyway:9-alpine
        args:
          - migrate
        env:
        - name: FLYWAY_URL
          value: "jdbc:postgresql://asset-pulse-postgres-prod.postgres.database.azure.com:5432/asset_pulse_prod"
        - name: FLYWAY_USER
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: username
        - name: FLYWAY_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-credentials
              key: password
        volumeMounts:
        - name: migrations
          mountPath: /flyway/sql
      volumes:
      - name: migrations
        configMap:
          name: db-migrations-v1-3-0
      restartPolicy: Never
```

**Migration Strategy**:
1. Backward-compatible migrations (add columns, not drop)
2. Run migration job before deployment
3. Zero-downtime: old and new code work with same schema
4. Deferred cleanup (drop unused columns after rollback window)

---

## 9. Disaster Recovery & Business Continuity

### 9.1 Recovery Objectives

| Metric | Target | Rationale |
|--------|--------|-----------|
| **RTO** (Recovery Time Objective) | 4 hours | Maximum downtime tolerance |
| **RPO** (Recovery Point Objective) | 5 minutes | Maximum data loss tolerance |
| **Availability SLA** | 99.9% | ~8.76 hours downtime/year |

### 9.2 Disaster Recovery Strategy

#### Scenario 1: AKS Cluster Failure (Single Zone)

**Impact**: Pods in one availability zone unavailable

**Mitigation**:
- Multi-zone deployment (3 zones)
- Pod anti-affinity rules (spread pods across zones)
- Automatic pod rescheduling to healthy zones

**Recovery**: Automatic (0 RTO)

#### Scenario 2: AKS Cluster Failure (Region-wide)

**Impact**: Entire Southeast Asia region unavailable

**Mitigation**:
- **Active-Passive DR**: Secondary AKS cluster in East Asia (passive)
- Geo-replicated PostgreSQL (async replication to East Asia)
- Azure Front Door automatic failover to secondary region
- Regular DR drills (quarterly)

**Recovery Process**:
1. Detect region failure (Azure Monitor alerts)
2. Verify data replication lag (should be < 5 minutes)
3. Promote secondary PostgreSQL to primary
4. Update DNS/Front Door to route to East Asia cluster
5. Scale up secondary AKS cluster

**Recovery Time**: ~2 hours (manual promotion)

#### Scenario 3: Database Corruption/Deletion

**Impact**: Data loss or corruption

**Mitigation**:
- Point-in-time recovery (PITR) enabled
- Daily full backups retained for 30 days
- Soft delete for critical tables (logical delete with `deleted_at`)

**Recovery Process**:
1. Identify corruption timestamp
2. Restore from PITR to timestamp - 5 minutes
3. Restore to separate database instance
4. Validate data integrity
5. Promote restored database to primary

**Recovery Time**: ~3 hours

### 9.3 Backup Strategy

**Automated Backups**:

| Component | Frequency | Retention | Location |
|-----------|-----------|-----------|----------|
| PostgreSQL (Azure managed) | Continuous (PITR) | 30 days | Same region + Geo-replica |
| PostgreSQL (pg_dump) | Weekly | 90 days | Azure Blob (GRS) |
| Redis (RDB snapshot) | Every 15 minutes | 7 days | Same region |
| Kubernetes manifests | On every change | Infinite | Git repository |
| Secrets/ConfigMaps | Daily | 30 days | Encrypted blob storage |

**Backup Verification**:
- Monthly restore test to staging environment
- Automated integrity checks (checksums)

### 9.4 Data Replication

**PostgreSQL Replication**:

```
┌────────────────────────────────────────────────────────────┐
│                  Primary Region (Southeast Asia)            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  PostgreSQL Primary (Zone-Redundant HA)              │ │
│  │  • Synchronous replication to standby (same region)  │ │
│  │  • Asynchronous replication to DR region             │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
                           │
                           │ Async replication
                           ▼
┌────────────────────────────────────────────────────────────┐
│                   DR Region (East Asia)                     │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  PostgreSQL Replica (Read-only)                      │ │
│  │  • Can be promoted to primary in DR scenario         │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

**Replication Lag Monitoring**:
```sql
SELECT 
  now() - pg_last_xact_replay_timestamp() AS replication_lag
FROM pg_stat_replication;
```

Alert if lag > 30 seconds.

---

## 10. Scalability & Performance

### 10.1 Horizontal Pod Autoscaling (HPA)

**Backend API HPA**:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "1000"
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300  # Wait 5 min before scale down
      policies:
      - type: Percent
        value: 50  # Scale down max 50% at a time
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0  # Immediate scale up
      policies:
      - type: Percent
        value: 100  # Double replicas if needed
        periodSeconds: 15
```

### 10.2 Cluster Autoscaler

**AKS Node Pool Autoscaling**:
- Application node pool: 3-10 nodes
- Worker node pool: 2-8 nodes
- Scale up trigger: Pod pending due to insufficient resources
- Scale down trigger: Node utilization < 50% for 10 minutes

### 10.3 Performance Optimization

#### Backend API Optimization

**Go Concurrency**:
```go
// Parallel LLM calls for multiple apps
func (uc *RecommendationUsecase) JDMatchUsecase(
    ctx context.Context,
    jobDescription string,
) ([]entities.Recommendation, error) {
    // Split job description analysis into parallel goroutines
    var wg sync.WaitGroup
    results := make(chan []entities.Recommendation, 3)
    
    // Goroutine 1: Extract skills
    wg.Add(1)
    go func() {
        defer wg.Done()
        skills := extractSkills(ctx, jobDescription)
        results <- matchSkillsToApps(ctx, skills)
    }()
    
    // Goroutine 2: Extract responsibilities
    wg.Add(1)
    go func() {
        defer wg.Done()
        responsibilities := extractResponsibilities(ctx, jobDescription)
        results <- matchResponsibilitiesToApps(ctx, responsibilities)
    }()
    
    // Goroutine 3: Check peer patterns
    wg.Add(1)
    go func() {
        defer wg.Done()
        peers := findSimilarEmployees(ctx, department)
        results <- getPeerApplications(ctx, peers)
    }()
    
    // Wait and aggregate
    go func() {
        wg.Wait()
        close(results)
    }()
    
    recommendations := aggregateRecommendations(results)
    return recommendations, nil
}
```

**Database Query Optimization**:
- Prepared statements (SQL injection prevention + performance)
- Connection pooling (PgBouncer)
- Query result caching (Redis)
- Batch inserts for usage events

**Redis Caching Strategy**:
- Cache LLM responses: 24 hours (reduce API costs)
- Cache user sessions: 8 hours (JWT validation)
- Cache app catalog: 1 hour (frequently accessed, rarely changes)
- Cache-aside pattern for database queries

#### Frontend Optimization

**Next.js Performance**:
- Static generation for public pages (login, documentation)
- Incremental Static Regeneration (ISR) for dashboards
- Image optimization (Next.js Image component)
- Code splitting (lazy loading)
- CDN for static assets (Azure CDN)

**Bundle Size**:
- Target: < 200 KB initial JS bundle
- Tree shaking (remove unused code)
- Dynamic imports for large libraries

### 10.4 Load Testing

**Performance Targets**:
- Concurrent users: 1000+
- API response time (p95): < 500ms
- API response time (p99): < 2s
- LLM recommendation generation: < 10s
- Database queries: < 100ms (p95)

**Load Testing Tools**:
- **k6** (Grafana Labs): Load testing scripts
- **Artillery**: Distributed load testing
- **Azure Load Testing**: Managed service

**Test Scenarios**:
1. **Baseline**: 100 users, 5 req/sec, 5 minutes
2. **Normal load**: 500 users, 25 req/sec, 15 minutes
3. **Peak load**: 1000 users, 50 req/sec, 15 minutes
4. **Spike test**: 0 → 1000 users in 1 minute
5. **Soak test**: 500 users, 25 req/sec, 4 hours

**Example k6 Script**:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 500 },  // Ramp up to 500 users
    { duration: '5m', target: 500 },  // Stay at 500 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<2000'],
    http_req_failed: ['rate<0.01'],  // Error rate < 1%
  },
};

export default function () {
  // Authenticate
  const loginRes = http.post('https://asset-pulse.scb.co.th/api/v1/auth/login', {
    username: 'test@scb.co.th',
    password: 'test123',
  });
  
  const token = loginRes.json('access_token');
  
  // Call JD match recommendation
  const recRes = http.post(
    'https://asset-pulse.scb.co.th/api/v1/recommendations/jd-match',
    JSON.stringify({
      job_title: 'Senior Data Analyst',
      job_description: 'Responsible for creating dashboards...',
      department: 'Analytics',
      company_code: 'SCB',
    }),
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  
  check(recRes, {
    'recommendation status is 200': (r) => r.status === 200,
    'recommendation count > 0': (r) => r.json('recommendations').length > 0,
  });
  
  sleep(1);
}
```

---

## 11. Cost Optimization

### 11.1 Estimated Monthly Cost (Production)

| Service | Configuration | Monthly Cost (USD) |
|---------|--------------|-------------------|
| **AKS** | 3 system nodes (D4s_v5) | $350 |
| **AKS** | 3-10 app nodes (D8s_v5, avg 5 nodes) | $1,250 |
| **AKS** | 2-8 worker nodes (E4s_v5, avg 4 nodes) | $550 |
| **Azure Database for PostgreSQL** | D4ds_v4, 512 GB, HA | $650 |
| **Azure Cache for Redis** | Premium P1 (6 GB) | $250 |
| **Azure Container Registry** | Premium (geo-replication) | $40 |
| **Azure OpenAI** | GPT-4o (10K recs/month) | $800 |
| **Azure Front Door** | Standard + WAF | $150 |
| **Azure Key Vault** | Standard (1000 operations/month) | $5 |
| **Azure Blob Storage** | 500 GB (GRS) | $25 |
| **Azure Monitor** | 50 GB logs, Application Insights | $200 |
| **Azure Load Balancer** | Standard | $20 |
| **Bandwidth** | 500 GB egress | $50 |
| **Total** | | **~$4,340/month** |

**Annual Cost**: ~$52,000 USD (~1.8M THB)

### 11.2 Cost Optimization Strategies

#### 1. Right-Sizing Resources

**Action**: Start with smaller node sizes, scale based on actual usage
- Initial: D4s_v5 (4 vCPU) → Potential downgrade to D2s_v5 (2 vCPU)
- **Savings**: ~30% on VM costs

#### 2. Azure Reserved Instances

**Action**: Purchase 1-year or 3-year reserved instances for base capacity
- 1-year RI: 20% discount
- 3-year RI: 40% discount
- Apply to: AKS nodes, PostgreSQL

**Estimated Savings**: $700/month (1-year RI)

#### 3. Spot Instances for Worker Nodes

**Action**: Use Azure Spot VMs for batch/worker jobs (non-critical workloads)
- Worker node pool: 50% spot instances
- Discount: 60-90% vs. on-demand

**Estimated Savings**: $200/month

#### 4. LLM Cost Optimization

**Strategy**:
- Cache LLM responses (Redis): 24-hour TTL
- Use GPT-4o-mini for simple tasks (10x cheaper)
- Batch processing during off-peak hours
- Fallback to rule-based recommendations (zero LLM cost)

**Example Impact**:
- Cache hit rate 70% → 70% cost reduction
- GPT-4o-mini for 50% of queries → 45% cost reduction on those queries
- **Estimated Savings**: $400/month

#### 5. Database Cost Optimization

**Strategy**:
- Use read replicas for analytics queries (offload primary)
- Archive old data (usage_events > 24 months) to Blob Storage
- Burstable tier for non-production environments

**Estimated Savings**: $100/month

#### 6. Auto-Scaling & Scheduled Scaling

**Strategy**:
- Scale down non-prod environments after hours
  - Dev: Off from 8 PM - 8 AM (50% reduction)
  - Staging: Weekends only
- Production: Scale down to minimum replicas during off-peak (2 AM - 6 AM)

**Estimated Savings**: $150/month (non-prod), $50/month (prod)

#### 7. Log Retention Optimization

**Strategy**:
- Reduce log retention from 90 days to 30 days (non-compliance logs)
- Archive older logs to Blob Storage (Cool tier)
- Use sampling for high-volume logs

**Estimated Savings**: $50/month

### 11.3 Cost Monitoring

**Azure Cost Management**:
- Daily cost alerts (email if > $150/day)
- Budget: $5,000/month with 80%, 90%, 100% alerts
- Cost allocation tags:
  - `Environment: production|staging|development`
  - `CostCenter: IT`
  - `Project: asset-pulse`

**FinOps Dashboard** (Grafana):
- Cost per request (total monthly cost / API requests)
- Cost per recommendation (LLM costs / recommendations generated)
- Infrastructure cost breakdown
- Cost trend (daily/weekly/monthly)

---

## 12. Implementation Roadmap

### 12.1 Phase 1: Infrastructure Setup (Week 1-2)

**Objective**: Provision Azure infrastructure and AKS cluster

**Tasks**:
- [ ] Create Azure subscription and resource groups
- [ ] Provision VNet with subnets (Terraform/Bicep)
- [ ] Create AKS cluster with node pools
- [ ] Setup Azure Database for PostgreSQL Flexible Server
- [ ] Setup Azure Cache for Redis
- [ ] Setup Azure Container Registry
- [ ] Configure private endpoints and network policies
- [ ] Setup Azure Key Vault and secrets
- [ ] Configure monitoring (Azure Monitor, Application Insights)

**Deliverables**:
- Infrastructure-as-Code (IaC) repository
- AKS cluster ready
- Database schema deployed (`0001_initial_tables.sql`)

### 12.2 Phase 2: Backend MVP (Week 3-6)

**Objective**: Deploy core backend API with authentication and Feature 3 (JD Matching)

**Tasks**:
- [ ] Setup CI/CD pipeline (GitHub Actions)
- [ ] Build and push Docker images to ACR
- [ ] Deploy backend API to AKS (development namespace)
- [ ] Implement authentication (JWT, Azure AD SSO)
- [ ] Implement RBAC middleware
- [ ] Create LLM client (OpenAI integration)
- [ ] Implement Feature 3: JD → License Matching
- [ ] Implement Feature 4: Purchase Templates
- [ ] Implement basic approval workflow
- [ ] Integration testing

**Deliverables**:
- Backend API deployed to dev environment
- API endpoints: `/auth/login`, `/recommendations/jd-match`, `/templates`
- Postman collection for API testing

### 12.3 Phase 3: Frontend MVP (Week 7-9)

**Objective**: Deploy frontend with HR workflow

**Tasks**:
- [ ] Setup Next.js project structure
- [ ] Build authentication pages (login, role selection)
- [ ] Build Employee/HR dashboard
- [ ] Build new hire form (Feature 3 UI)
- [ ] Build AI recommendations display
- [ ] Build approval queue
- [ ] Integrate with backend API
- [ ] Deploy to AKS (development namespace)

**Deliverables**:
- Frontend deployed to dev environment
- End-to-end HR onboarding workflow functional

### 12.4 Phase 4: Production Readiness (Week 10-11)

**Objective**: Harden system for production launch

**Tasks**:
- [ ] Load testing (k6 scripts)
- [ ] Security audit and penetration testing
- [ ] Setup Azure Front Door with WAF
- [ ] Configure production environment (AKS namespace)
- [ ] Database backup and restore testing
- [ ] Disaster recovery drill
- [ ] Production deployment (blue-green)
- [ ] User acceptance testing (UAT)

**Deliverables**:
- Production environment ready
- Security sign-off
- Performance benchmarks met
- Runbook documentation

### 12.5 Phase 5: Feature Expansion (Week 12-16)

**Objective**: Implement remaining features (1, 2, 5, 6)

**Tasks**:
- [ ] Feature 5: Seat Optimization (with reallocation)
- [ ] Feature 1: Cross-Subsidiary Software Match
- [ ] Feature 2: Group Consolidation Recommendations
- [ ] Feature 6: Pay-per-Use Optimization
- [ ] CTO Dashboard with analytics
- [ ] Manager Dashboard with team insights
- [ ] Reporting module

**Deliverables**:
- All 6 core features deployed
- Multi-role dashboards functional
- Analytics and reporting available

### 12.6 Phase 6: Optimization & Scale (Week 17-20)

**Objective**: Optimize performance, cost, and scale to all subsidiaries

**Tasks**:
- [ ] Performance tuning (database queries, API latency)
- [ ] Cost optimization (reserved instances, LLM caching)
- [ ] Rollout to 25+ subsidiaries
- [ ] Training and documentation
- [ ] Support and monitoring
- [ ] Continuous improvement based on feedback

**Deliverables**:
- System optimized for production scale
- All subsidiaries onboarded
- Support documentation and runbooks

---

## 13. Appendices

### Appendix A: Technology Alternatives Considered

| Component | Chosen | Alternatives Considered | Rationale |
|-----------|--------|------------------------|-----------|
| Container Orchestration | AKS | EKS, GKE, OpenShift | Azure-native, integrated with Azure services |
| Database | Azure PostgreSQL | Azure SQL, Cosmos DB | Open-source, pgvector support, cost-effective |
| Backend Language | Go | Node.js, Python | Performance, concurrency, compiled binary |
| Frontend Framework | Next.js | Nuxt.js, Angular | React ecosystem, SSR, strong community |
| API Gateway | NGINX Ingress | Azure API Management, Kong | Open-source, flexible, cost-effective |
| Monitoring | Prometheus + Grafana | DataDog, New Relic | Open-source, Kubernetes-native |
| LLM Provider | Azure OpenAI | OpenAI API, Anthropic | Azure integration, enterprise SLA, data residency |

### Appendix B: Security Checklist

- [ ] Network isolation (private endpoints, NSGs)
- [ ] Secrets in Azure Key Vault (not in code/config)
- [ ] TLS 1.2/1.3 for all connections
- [ ] RBAC for Kubernetes and application
- [ ] Pod security policies/admission controllers
- [ ] Container image scanning (Trivy, Snyk)
- [ ] WAF enabled (Azure Front Door)
- [ ] DDoS protection enabled
- [ ] Audit logging enabled (90-day retention)
- [ ] Regular security updates (AKS, OS patches)
- [ ] Penetration testing (quarterly)
- [ ] PDPA compliance (data privacy)

### Appendix C: Operational Runbooks

**Runbook 1: Responding to High Error Rate Alert**
1. Check Grafana dashboard for error breakdown
2. Review Application Insights for exception details
3. Check recent deployments (rollback if needed)
4. Review Azure Monitor for infrastructure issues
5. Scale up pods if resource-constrained
6. Engage on-call engineer if unresolved in 30 minutes

**Runbook 2: Database Failover**
1. Verify primary database is unavailable
2. Check replication lag on standby
3. Promote standby to primary (Azure portal or CLI)
4. Update connection string in Key Vault
5. Restart backend pods to pick up new connection
6. Verify application health

**Runbook 3: Scaling for High Traffic**
1. Monitor HPA metrics (CPU, memory, request rate)
2. If HPA at max replicas, scale node pool
3. If node pool at max, enable burst to spot instances
4. If LLM rate-limited, enable fallback to rule-based
5. Monitor cost impact in real-time

### Appendix D: Acronyms & Glossary

| Term | Definition |
|------|------------|
| **AKS** | Azure Kubernetes Service |
| **ACR** | Azure Container Registry |
| **HPA** | Horizontal Pod Autoscaler |
| **RBAC** | Role-Based Access Control |
| **NSG** | Network Security Group |
| **PITR** | Point-in-Time Recovery |
| **RTO** | Recovery Time Objective |
| **RPO** | Recovery Point Objective |
| **SLA** | Service Level Agreement |
| **WAF** | Web Application Firewall |
| **LLM** | Large Language Model |
| **pgvector** | PostgreSQL extension for vector embeddings |
| **FinOps** | Financial Operations (cloud cost management) |

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Solution Architect | _______________ | _______________ | _______________ |
| Technical Lead | _______________ | _______________ | _______________ |
| Security Lead | _______________ | _______________ | _______________ |
| CTO | _______________ | _______________ | _______________ |

---

**End of Solution Architecture Document v1.0**

