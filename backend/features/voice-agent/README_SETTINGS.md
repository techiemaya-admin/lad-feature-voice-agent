# Voice Agent Settings Repository

This repository provides a comprehensive API for managing voice agents and voice voices in the voice-agent feature.

## Overview

The `SettingsRepository` class handles all database operations for:
- **Voice Agents**: AI voice assistants with instructions, prompts, and voice assignments
- **Voice Voices**: Voice profiles with provider configurations and sample URLs

## Database Schema

### voice_agents Table
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | bigint | NO | Primary key |
| tenant_id | uuid | YES | Tenant identifier for multi-tenancy |
| name | varchar | NO | Agent name |
| gender | text | YES | Agent gender |
| language | varchar | YES | Language code (e.g., 'en') |
| agent_instructions | text | YES | Detailed agent instructions |
| system_instructions | text | YES | System-level instructions |
| outbound_starter_prompt | text | YES | Prompt for outbound calls |
| inbound_starter_prompt | text | YES | Prompt for inbound calls |
| voice_id | uuid | YES | Foreign key to voice_agent_voices |
| created_at | timestamp | YES | Creation timestamp |
| updated_at | timestamp | YES | Last update timestamp |

### voice_agent_voices Table
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | uuid | NO | Primary key |
| tenant_id | uuid | YES | Tenant identifier for multi-tenancy |
| description | text | YES | Voice description |
| gender | text | YES | Voice gender |
| accent | text | YES | Voice accent |
| provider | text | YES | Voice provider (e.g., 'sarvam', 'openai') |
| voice_sample_url | text | YES | Sample audio URL |
| provider_voice_id | text | YES | Provider-specific voice ID |
| provider_config | jsonb | YES | Provider configuration |
| created_at | timestamp | YES | Creation timestamp |
| updated_at | timestamp | YES | Last update timestamp |

## API Endpoints

### Voice Agent Management

#### Get All Voice Agents
```
GET /api/voice-agent/settings/agents?schema={schema}&page={page}&limit={limit}
```

#### Get Voice Agent by ID
```
GET /api/voice-agent/settings/agents/{agentId}?schema={schema}
```

#### Create Voice Agent
```
POST /api/voice-agent/settings/agents?schema={schema}
Content-Type: application/json

{
  "name": "Agent Name",
  "gender": "female",
  "language": "en",
  "agent_instructions": "Detailed instructions...",
  "system_instructions": "System instructions...",
  "outbound_starter_prompt": "Outbound prompt...",
  "inbound_starter_prompt": "Inbound prompt...",
  "voice_id": "voice-uuid"
}
```

#### Update Voice Agent
```
PUT /api/voice-agent/settings/agents/{agentId}?schema={schema}
Content-Type: application/json

{
  "name": "Updated Agent Name",
  "language": "es"
}
```

#### Delete Voice Agent
```
DELETE /api/voice-agent/settings/agents/{agentId}?schema={schema}
```

#### Search Voice Agents
```
GET /api/voice-agent/settings/agents/search?schema={schema}&q={searchTerm}&limit={limit}
```

### Voice Voices Management

#### Get All Voice Voices
```
GET /api/voice-agent/settings/voices?schema={schema}&page={page}&limit={limit}
```

#### Get Voice by ID
```
GET /api/voice-agent/settings/voices/{voiceId}?schema={schema}
```

#### Create Voice
```
POST /api/voice-agent/settings/voices?schema={schema}
Content-Type: application/json

{
  "description": "Professional Female Voice",
  "gender": "female",
  "accent": "indian",
  "provider": "sarvam",
  "voice_sample_url": "https://example.com/sample.mp3",
  "provider_voice_id": "voice-id",
  "provider_config": {
    "model": "sarvam-v2",
    "language": "en",
    "stability": 0.8
  }
}
```

#### Update Voice
```
PUT /api/voice-agent/settings/voices/{voiceId}?schema={schema}
Content-Type: application/json

{
  "description": "Updated description",
  "provider_config": {
    "stability": 0.9
  }
}
```

#### Delete Voice
```
DELETE /api/voice-agent/settings/voices/{voiceId}?schema={schema}
```

#### Get Voices by Provider
```
GET /api/voice-agent/settings/voices/provider/{provider}?schema={schema}
```

#### Search Voice Voices
```
GET /api/voice-agent/settings/voices/search?schema={schema}&q={searchTerm}&limit={limit}
```

#### Get Agents Using Voice
```
GET /api/voice-agent/settings/voices/{voiceId}/agents?schema={schema}
```

## Usage Examples

### Creating a Complete Voice Agent

```javascript
const settingsRepo = new SettingsRepository(pool);

// 1. Create a voice profile
const voice = await settingsRepo.createVoice(tenantId, {
  description: 'Kavitha - Professional Female Voice',
  gender: 'female',
  accent: 'indian',
  provider: 'sarvam',
  voice_sample_url: 'https://example.com/kavitha.mp3',
  provider_voice_id: 'kavitha-professional',
  provider_config: {
    model: 'sarvam-v2',
    language: 'en',
    stability: 0.8,
    similarity_boost: 0.9
  }
}, schema);

// 2. Create agent with the voice
const agent = await settingsRepo.createVoiceAgent(tenantId, {
  name: 'Mira Singh (G Links)',
  gender: 'female',
  language: 'en',
  agent_instructions: 'You are Mira Singh...',
  system_instructions: 'Core constraints...',
  outbound_starter_prompt: 'Hello, this is Mira...',
  inbound_starter_prompt: '...',
  voice_id: voice.id
}, schema);
```

### Searching and Filtering

```javascript
// Search agents by name or description
const agents = await settingsRepo.searchVoiceAgents('Mira', tenantId, schema, 20);

// Get voices by provider
const sarvamVoices = await settingsRepo.getVoicesByProvider('sarvam', tenantId, schema);

// Get agents using a specific voice
const agentsWithVoice = await settingsRepo.getAgentsByVoiceId(voiceId, tenantId, schema);
```

## Error Handling

The repository includes comprehensive error handling:

- **Validation**: Required fields are validated before creation
- **Foreign Key Constraints**: Voices cannot be deleted if used by agents
- **Multi-tenancy**: All operations are tenant-isolated
- **Schema Sanitization**: Schema names are sanitized to prevent SQL injection

## Integration

The settings repository is integrated into the main voice-agent routes:

1. **Repository**: `backend/features/voice-agent/repositories/settings.repository.js`
2. **Controller**: `backend/features/voice-agent/controllers/SettingsController.js`
3. **Routes**: Integrated in `backend/features/voice-agent/routes/index.js`
4. **Example**: `backend/features/voice-agent/examples/settingsExample.js`

## Sample Data

Based on your provided sample, here's how to create the "Mira Singh" agent:

```javascript
const agentData = {
  name: 'Mira Singh(G Links)(new)Sarvam-test-kavitha',
  gender: 'female',
  language: 'en',
  agent_instructions: `Education Counselor - G Links International
Identity
You're Mira Singh, an education counselor at G Links International...`,
  system_instructions: `## Core conversation constraints
# never mention that you are an agent...`,
  outbound_starter_prompt: `"The prospect just answered an outbound call...`,
  inbound_starter_prompt: "......",
  voice_id: "19bee4af-57a8-44dc-9d01-3af74e5f7d37"
};
```

## Security

- All endpoints require JWT authentication
- Tenant isolation ensures data privacy
- Schema validation prevents SQL injection
- Input validation on all required fields
