# LAD Microservices Architecture

## 🎯 Overview
Converting LAD-Backend from monolithic to microservices architecture for better scalability, independent deployment, and team autonomy.

## 📋 Microservices Breakdown

### Core Services (Always Available)
1. **auth-service** - Authentication & authorization
2. **user-service** - User management
3. **billing-service** - Subscription, plans, credits
4. **api-gateway** - Request routing, rate limiting, CORS

### Feature Services (Optional based on subscription)
5. **campaigns-service** - Multi-channel campaigns
6. **apollo-leads-service** - Lead generation & enrichment
7. **voice-agent-service** - Voice calls & AI agents
8. **deals-pipeline-service** - Sales pipeline & CRM
9. **social-integration-service** - LinkedIn, Instagram integration
10. **ai-icp-assistant-service** - AI-powered ICP analysis
11. **lead-enrichment-service** - Data enrichment
12. **overview-service** - Analytics & dashboards

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
│  - Route requests to services                               │
│  - Authentication middleware                                 │
│  - Rate limiting & CORS                                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼─────┐         ┌──────▼──────┐
│   Core    │         │   Feature   │
│ Services  │         │  Services   │
└───────────┘         └─────────────┘

Core Services:           Feature Services:
├─ auth-service         ├─ campaigns-service
├─ user-service         ├─ apollo-leads-service  
├─ billing-service      ├─ voice-agent-service
                        ├─ deals-pipeline-service
                        ├─ social-integration-service
                        ├─ ai-icp-assistant-service
                        ├─ lead-enrichment-service
                        └─ overview-service
```

## 📊 Service Details

### 1. API Gateway
**Purpose**: Single entry point for all client requests
**Port**: 3000
**Routes**:
- `/api/auth/*` → auth-service
- `/api/users/*` → user-service
- `/api/billing/*` → billing-service
- `/api/campaigns/*` → campaigns-service
- `/api/apollo-leads/*` → apollo-leads-service
- etc.

**Responsibilities**:
- Request routing
- Authentication validation
- Feature flag checking
- Rate limiting
- CORS handling
- Load balancing

### 2. Auth Service
**Port**: 3001
**Database**: Shared PostgreSQL (users, tenants tables)
**Endpoints**:
- POST /login
- POST /register
- POST /logout
- POST /refresh-token
- GET /verify

### 3. User Service
**Port**: 3002
**Database**: Shared PostgreSQL (users table)
**Endpoints**:
- GET /profile
- PUT /profile
- GET /settings
- GET /users (admin)
- POST /users (admin)

### 4. Billing Service
**Port**: 3003
**Database**: Shared PostgreSQL (billing tables)
**Endpoints**:
- GET /plans
- POST /subscribe
- GET /usage
- POST /credits/deduct
- GET /credits/balance
- POST /stripe/webhook

### 5. Campaigns Service
**Port**: 3004
**Database**: PostgreSQL (campaigns, campaign_leads, campaign_steps)
**Dependencies**: apollo-leads-service, social-integration-service
**Endpoints**:
- GET /campaigns
- POST /campaigns
- GET /campaigns/:id
- POST /campaigns/:id/start
- POST /campaigns/:id/pause

### 6. Apollo Leads Service
**Port**: 3005
**Database**: PostgreSQL (leads table)
**External APIs**: Apollo.io
**Endpoints**:
- POST /search
- POST /enrich
- POST /reveal-email
- POST /reveal-phone

### 7. Voice Agent Service
**Port**: 3006
**Database**: PostgreSQL (voice_agents, call_logs)
**External APIs**: Unipile/Twilio
**Endpoints**:
- POST /call
- GET /agents
- POST /agents
- GET /call-logs

### 8. Deals Pipeline Service
**Port**: 3007
**Database**: PostgreSQL (pipelines, deals, stages)
**Endpoints**:
- GET /pipelines
- POST /pipelines
- GET /deals
- POST /deals
- PUT /deals/:id/stage

### 9. Social Integration Service
**Port**: 3008
**Database**: PostgreSQL (social_accounts)
**External APIs**: LinkedIn, Instagram
**Endpoints**:
- POST /linkedin/connect
- POST /linkedin/message
- POST /instagram/follow
- POST /instagram/dm

### 10. AI ICP Assistant Service
**Port**: 3009
**Database**: PostgreSQL (icp_profiles)
**External APIs**: Google Gemini
**Endpoints**:
- POST /analyze
- GET /profiles
- POST /generate-criteria

### 11. Lead Enrichment Service
**Port**: 3010
**Database**: PostgreSQL (enrichment_cache)
**Endpoints**:
- POST /enrich
- GET /status/:id

### 12. Overview Service
**Port**: 3011
**Database**: Read from all tables
**Endpoints**:
- GET /dashboard
- GET /analytics
- GET /reports

## 🗄️ Database Strategy

### Option 1: Shared Database (Recommended for migration)
- Single PostgreSQL instance
- Each service has its own schema
- Easier migration from monolith
- Use views for cross-service data

### Option 2: Database per Service
- Each service has own PostgreSQL instance
- Better isolation
- More complex to manage
- Use API calls for cross-service data

### Recommendation: Start with Option 1, migrate to Option 2 later

## 🔐 Authentication Flow

```
1. Client → API Gateway → Auth Service (login)
2. Auth Service → Returns JWT token
3. Client → API Gateway (with JWT) → Feature Service
4. API Gateway validates JWT with Auth Service (or verify locally)
5. Feature Service processes request
```

## 💬 Inter-Service Communication

### Synchronous (HTTP/REST)
- For immediate responses
- Example: Campaigns → Apollo Leads (search)

### Asynchronous (Message Queue - Future)
- For background tasks
- Example: Campaign execution, lead processing
- Tools: RabbitMQ, Redis Pub/Sub

## 📦 Shared Libraries

Create `@lad/shared` package for:
- Database connection utilities
- Logger
- Authentication middleware
- Credit guard middleware
- Schema helpers
- Common types/interfaces

## 🚀 Deployment Strategy

### Development
```bash
docker-compose up
```

### Production (Google Cloud Run)
- Each service deployed independently
- Auto-scaling per service
- Independent CI/CD pipelines

## 📁 Repository Structure

### Option 1: Monorepo (Recommended)
```
lad-microservices/
├── services/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── campaigns-service/
│   └── ...
├── shared/
│   └── @lad-shared/
├── docker-compose.yml
└── package.json
```

### Option 2: Multi-repo
- Separate Git repo for each service
- Shared library as npm package

## 🔄 Migration Plan

### Phase 1: Setup Infrastructure
1. Create API Gateway
2. Setup shared library package
3. Configure Docker & docker-compose

### Phase 2: Extract Core Services
1. Auth Service
2. User Service
3. Billing Service

### Phase 3: Extract Feature Services (Priority order)
1. Campaigns Service (highest usage)
2. Apollo Leads Service
3. Voice Agent Service
4. Deals Pipeline Service
5. Social Integration Service
6. AI ICP Assistant Service
7. Lead Enrichment Service
8. Overview Service

### Phase 4: Testing & Validation
1. Integration tests
2. Load testing
3. Migration testing

### Phase 5: Deployment
1. Deploy to staging
2. Gradual rollout to production
3. Monitor and optimize

## 📊 Benefits

✅ **Independent Scaling**: Scale heavy services (campaigns, voice) separately
✅ **Independent Deployment**: Deploy features without affecting others
✅ **Team Autonomy**: Each team owns a service
✅ **Technology Flexibility**: Use different tech stacks per service
✅ **Fault Isolation**: One service failure doesn't crash entire system
✅ **Faster Development**: Parallel development on different services

## ⚠️ Challenges

⚠️ **Increased Complexity**: More services to manage
⚠️ **Network Latency**: Inter-service calls add overhead
⚠️ **Data Consistency**: Distributed transactions are hard
⚠️ **Debugging**: Harder to trace requests across services
⚠️ **DevOps Overhead**: More deployment pipelines

## 🎯 Success Metrics

- Service response time < 200ms
- Independent deployment success rate > 95%
- Service uptime > 99.9%
- Cross-service call latency < 50ms
- Developer satisfaction score > 8/10

## 📚 Next Steps

1. Review and approve architecture
2. Setup shared library package
3. Create API Gateway template
4. Extract first service (Auth)
5. Implement service-to-service communication
6. Setup monitoring & logging
7. Create deployment pipelines
