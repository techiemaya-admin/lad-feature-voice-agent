# Voice Agent Settings API - Curl Commands

## Configuration Variables
```bash
# Replace these with your actual values
BASE_URL="http://localhost:3004"
JWT_TOKEN="your-jwt-token-here"
TENANT_ID="your-tenant-id"
```

## Voice Agent Management

### Get All Voice Agents
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/agents" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Get Voice Agent by ID
```bash
AGENT_ID="40"
curl -X GET "${BASE_URL}/api/voice-agent/settings/agents/${AGENT_ID}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Create Voice Agent
```bash
curl -X POST "${BASE_URL}/api/voice-agent/settings/agents" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mira Singh(G Links)(new)Sarvam-test-kavitha",
    "gender": "female",
    "language": "en",
    "agent_instructions": "Education Counselor - G Links International\nIdentity\nYou'\''re Mira Singh, an education counselor at G Links International (KHDA-approved, 15+ years, 12,000+ students helped). Your goal: book free counseling sessions and qualify leads through warm, professional guidance.\n\nCommunication Style\n* Calm, steady tone throughout - no excitement spikes or pitch changes\n* Use natural filler words throughout: \"hmm,\" \"um,\" \"ah,\" \"you know,\" \"actually,\" \"I mean,\" \"so,\" \"well,\" \"like\"\n* Professional but conversational, not scripted\n* One question at a time, always wait for responses\n* Use lead'\''s name only when known, not repeatedly\n* Keep calls 3-5 minutes",
    "system_instructions": "## Core conversation constraints\n# never mention that you are an agent , ai or sales person . You are simply a consultant ( actual human)\n* **First utterance:** must be crisp and confident. No filler in the very first line.\n* **Turn length:** prefer very short spoken turns — aim for **≤ 2 sentences** per turn whenever possible.\n* **Human tone:** use light, natural fillers sparingly after the first utterance.\n* **No placeholders aloud:** never say template placeholders.",
    "outbound_starter_prompt": "\"The prospect just answered an outbound call. Immediately say hello, introduce yourself as \"Mira from G links, We help students with admissions and career guidance\". In the same utterance, offer a one-sentence value reminder and ask a single, specific question which may be \"current plans for higher education. Keep the whole turn under two sentences.\" only if its not previously known",
    "inbound_starter_prompt": "......",
    "voice_id": "19bee4af-57a8-44dc-9d01-3af74e5f7d37"
  }'
```

### Update Voice Agent
```bash
AGENT_ID="40"
curl -X PUT "${BASE_URL}/api/voice-agent/settings/agents/${AGENT_ID}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Mira Singh",
    "language": "en",
    "agent_instructions": "Updated instructions for Mira Singh..."
  }'
```

### Delete Voice Agent
```bash
AGENT_ID="40"
curl -X DELETE "${BASE_URL}/api/voice-agent/settings/agents/${AGENT_ID}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Search Voice Agents
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/agents/search?q=Mira&limit=20" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

## Voice Voices Management

### Get All Voice Voices
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices?page=1&limit=50" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Get Voice by ID
```bash
VOICE_ID="19bee4af-57a8-44dc-9d01-3af74e5f7d37"
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices/${VOICE_ID}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Create Voice
```bash
curl -X POST "${BASE_URL}/api/voice-agent/settings/voices" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Kavitha - Professional Female Voice",
    "gender": "female",
    "accent": "indian",
    "provider": "sarvam",
    "voice_sample_url": "https://example.com/voice-sample.mp3",
    "provider_voice_id": "kavitha-professional",
    "provider_config": {
      "model": "sarvam-v2",
      "language": "en",
      "stability": 0.8,
      "similarity_boost": 0.9
    }
  }'
```

### Update Voice
```bash
VOICE_ID="19bee4af-57a8-44dc-9d01-3af74e5f7d37"
curl -X PUT "${BASE_URL}/api/voice-agent/settings/voices/${VOICE_ID}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated Kavitha Voice Description",
    "provider_config": {
      "stability": 0.9,
      "similarity_boost": 0.95
    }
  }'
```

### Delete Voice
```bash
VOICE_ID="19bee4af-57a8-44dc-9d01-3af74e5f7d37"
curl -X DELETE "${BASE_URL}/api/voice-agent/settings/voices/${VOICE_ID}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Get Voices by Provider
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices/provider/sarvam" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Search Voice Voices
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices/search?q=female&limit=20" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Get Agents Using Voice
```bash
VOICE_ID="19bee4af-57a8-44dc-9d01-3af74e5f7d37"
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices/${VOICE_ID}/agents" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

## Complete Workflow Example

### Step 1: Create a Voice
```bash
curl -X POST "${BASE_URL}/api/voice-agent/settings/voices" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Kavitha - Professional Female Voice",
    "gender": "female",
    "accent": "indian",
    "provider": "sarvam",
    "voice_sample_url": "https://storage.googleapis.com/voice-samples/kavitha.mp3",
    "provider_voice_id": "kavitha-professional-v2",
    "provider_config": {
      "model": "sarvam-v2",
      "language": "en",
      "stability": 0.8,
      "similarity_boost": 0.9,
      "style": "professional"
    }
  }'
```

### Step 2: Create Agent with Voice (replace VOICE_ID from Step 1)
```bash
curl -X POST "${BASE_URL}/api/voice-agent/settings/agents" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mira Singh (G Links) - Kavitha Voice",
    "gender": "female",
    "language": "en",
    "agent_instructions": "Education Counselor - G Links International\nIdentity\nYou'\''re Mira Singh, an education counselor at G Links International (KHDA-approved, 15+ years, 12,000+ students helped).",
    "system_instructions": "## Core conversation constraints\n# never mention that you are an agent , ai or sales person.",
    "outbound_starter_prompt": "Hello, this is Mira from G Links. We help students with admissions and career guidance. What are your current plans for higher education?",
    "inbound_starter_prompt": "Hello, thank you for calling G Links. How can I help you today?",
    "voice_id": "REPLACE_WITH_VOICE_ID_FROM_STEP_1"
  }'
```

### Step 3: Verify Creation
```bash
# Get all agents to see the new one
curl -X GET "${BASE_URL}/api/voice-agent/settings/agents" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"

# Get all voices to see the new one
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

## Error Handling Examples

### Missing Required Fields
```bash
curl -X POST "${BASE_URL}/api/voice-agent/settings/agents" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female"
  }'
# Expected: 400 Bad Request - Missing required fields: name, voice_id
```

### Invalid Agent ID
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/agents/999999" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
# Expected: 404 Not Found - Voice agent not found
```

### Delete Voice Used by Agent
```bash
curl -X DELETE "${BASE_URL}/api/voice-agent/settings/voices/19bee4af-57a8-44dc-9d01-3af74e5f7d37" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
# Expected: 400 Bad Request - Cannot delete voice: it is being used by one or more agents
```

## Testing Script

Save this as a bash script to test all endpoints:
```bash
#!/bin/bash

# Configuration
BASE_URL="http://localhost:3004"
JWT_TOKEN="your-jwt-token-here"

echo "Testing Voice Agent Settings API..."

# Test 1: Get all agents
echo "1. Getting all agents..."
curl -s -X GET "${BASE_URL}/api/voice-agent/settings/agents" \
  -H "Authorization: Bearer ${JWT_TOKEN}" | jq .

# Test 2: Get all voices
echo -e "\n2. Getting all voices..."
curl -s -X GET "${BASE_URL}/api/voice-agent/settings/voices" \
  -H "Authorization: Bearer ${JWT_TOKEN}" | jq .

# Test 3: Search agents
echo -e "\n3. Searching agents..."
curl -s -X GET "${BASE_URL}/api/voice-agent/settings/agents/search?q=Mira" \
  -H "Authorization: Bearer ${JWT_TOKEN}" | jq .

echo -e "\nAPI testing complete!"
```

## Notes:
- Replace `your-jwt-token-here` with actual JWT token from authentication
- Replace `your-tenant-id` with actual tenant ID
- Schema is now automatically determined from tenant context
- Use `jq .` for pretty JSON output in bash scripts
- All endpoints require valid JWT authentication
    "gender": "female",
    "language": "en",
    "agent_instructions": "Education Counselor - G Links International\nIdentity\nYou'\''re Mira Singh, an education counselor at G Links International (KHDA-approved, 15+ years, 12,000+ students helped). Your goal: book free counseling sessions and qualify leads through warm, professional guidance.\n\nCommunication Style\n* Calm, steady tone throughout - no excitement spikes or pitch changes\n* Use natural filler words throughout: \"hmm,\" \"um,\" \"ah,\" \"you know,\" \"actually,\" \"I mean,\" \"so,\" \"well,\" \"like\"\n* Professional but conversational, not scripted\n* One question at a time, always wait for responses\n* Use lead'\''s name only when known, not repeatedly\n* Keep calls 3-5 minutes",
    "system_instructions": "## Core conversation constraints\n# never mention that you are an agent , ai or sales person . You are simply a consultant ( actual human)\n* **First utterance:** must be crisp and confident. No filler in the very first line.\n* **Turn length:** prefer very short spoken turns — aim for **≤ 2 sentences** per turn whenever possible.\n* **Human tone:** use light, natural fillers sparingly after the first utterance.\n* **No placeholders aloud:** never say template placeholders.",
    "outbound_starter_prompt": "\"The prospect just answered an outbound call. Immediately say hello, introduce yourself as \"Mira from G links, We help students with admissions and career guidance\". In the same utterance, offer a one-sentence value reminder and ask a single, specific question which may be \"current plans for higher education. Keep the whole turn under two sentences.\" only if its not previously known",
    "inbound_starter_prompt": "......",
    "voice_id": "19bee4af-57a8-44dc-9d01-3af74e5f7d37"
  }'
```

### Update Voice Agent
```bash
AGENT_ID="40"
curl -X PUT "${BASE_URL}/api/voice-agent/settings/agents/${AGENT_ID}?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Mira Singh",
    "language": "en",
    "agent_instructions": "Updated instructions for Mira Singh..."
  }'
```

### Delete Voice Agent
```bash
AGENT_ID="40"
curl -X DELETE "${BASE_URL}/api/voice-agent/settings/agents/${AGENT_ID}?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Search Voice Agents
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/agents/search?schema=${SCHEMA}&q=Mira&limit=20" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

## Voice Voices Management

### Get All Voice Voices
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices?schema=${SCHEMA}&page=1&limit=50" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Get Voice by ID
```bash
VOICE_ID="19bee4af-57a8-44dc-9d01-3af74e5f7d37"
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices/${VOICE_ID}?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Create Voice
```bash
curl -X POST "${BASE_URL}/api/voice-agent/settings/voices?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Kavitha - Professional Female Voice",
    "gender": "female",
    "accent": "indian",
    "provider": "sarvam",
    "voice_sample_url": "https://example.com/voice-sample.mp3",
    "provider_voice_id": "kavitha-professional",
    "provider_config": {
      "model": "sarvam-v2",
      "language": "en",
      "stability": 0.8,
      "similarity_boost": 0.9
    }
  }'
```

### Update Voice
```bash
VOICE_ID="19bee4af-57a8-44dc-9d01-3af74e5f7d37"
curl -X PUT "${BASE_URL}/api/voice-agent/settings/voices/${VOICE_ID}?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated Kavitha Voice Description",
    "provider_config": {
      "stability": 0.9,
      "similarity_boost": 0.95
    }
  }'
```

### Delete Voice
```bash
VOICE_ID="19bee4af-57a8-44dc-9d01-3af74e5f7d37"
curl -X DELETE "${BASE_URL}/api/voice-agent/settings/voices/${VOICE_ID}?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Get Voices by Provider
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices/provider/sarvam?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Search Voice Voices
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices/search?schema=${SCHEMA}&q=female&limit=20" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

### Get Agents Using Voice
```bash
VOICE_ID="19bee4af-57a8-44dc-9d01-3af74e5f7d37"
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices/${VOICE_ID}/agents?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

## Complete Workflow Example

### Step 1: Create a Voice
```bash
curl -X POST "${BASE_URL}/api/voice-agent/settings/voices?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Kavitha - Professional Female Voice",
    "gender": "female",
    "accent": "indian",
    "provider": "sarvam",
    "voice_sample_url": "https://storage.googleapis.com/voice-samples/kavitha.mp3",
    "provider_voice_id": "kavitha-professional-v2",
    "provider_config": {
      "model": "sarvam-v2",
      "language": "en",
      "stability": 0.8,
      "similarity_boost": 0.9,
      "style": "professional"
    }
  }'
```

### Step 2: Create Agent with Voice (replace VOICE_ID from Step 1)
```bash
curl -X POST "${BASE_URL}/api/voice-agent/settings/agents?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mira Singh (G Links) - Kavitha Voice",
    "gender": "female",
    "language": "en",
    "agent_instructions": "Education Counselor - G Links International\nIdentity\nYou'\''re Mira Singh, an education counselor at G Links International (KHDA-approved, 15+ years, 12,000+ students helped).",
    "system_instructions": "## Core conversation constraints\n# never mention that you are an agent , ai or sales person.",
    "outbound_starter_prompt": "Hello, this is Mira from G Links. We help students with admissions and career guidance. What are your current plans for higher education?",
    "inbound_starter_prompt": "Hello, thank you for calling G Links. How can I help you today?",
    "voice_id": "REPLACE_WITH_VOICE_ID_FROM_STEP_1"
  }'
```

### Step 3: Verify Creation
```bash
# Get all agents to see the new one
curl -X GET "${BASE_URL}/api/voice-agent/settings/agents?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"

# Get all voices to see the new one
curl -X GET "${BASE_URL}/api/voice-agent/settings/voices?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

## Error Handling Examples

### Missing Required Fields
```bash
curl -X POST "${BASE_URL}/api/voice-agent/settings/agents?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "female"
  }'
# Expected: 400 Bad Request - Missing required fields: name, voice_id
```

### Invalid Agent ID
```bash
curl -X GET "${BASE_URL}/api/voice-agent/settings/agents/999999?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
# Expected: 404 Not Found - Voice agent not found
```

### Delete Voice Used by Agent
```bash
curl -X DELETE "${BASE_URL}/api/voice-agent/settings/voices/19bee4af-57a8-44dc-9d01-3af74e5f7d37?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json"
# Expected: 400 Bad Request - Cannot delete voice: it is being used by one or more agents
```

## Testing Script

Save this as a bash script to test all endpoints:
```bash
#!/bin/bash

# Configuration
BASE_URL="http://localhost:3004"
JWT_TOKEN="your-jwt-token-here"
SCHEMA="lad_dev"

echo "Testing Voice Agent Settings API..."

# Test 1: Get all agents
echo "1. Getting all agents..."
curl -s -X GET "${BASE_URL}/api/voice-agent/settings/agents?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" | jq .

# Test 2: Get all voices
echo -e "\n2. Getting all voices..."
curl -s -X GET "${BASE_URL}/api/voice-agent/settings/voices?schema=${SCHEMA}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" | jq .

# Test 3: Search agents
echo -e "\n3. Searching agents..."
curl -s -X GET "${BASE_URL}/api/voice-agent/settings/agents/search?schema=${SCHEMA}&q=Mira" \
  -H "Authorization: Bearer ${JWT_TOKEN}" | jq .

echo -e "\nAPI testing complete!"
```

## Notes:
- Replace `your-jwt-token-here` with actual JWT token from authentication
- Replace `your-tenant-id` with actual tenant ID
- Replace `lad_dev` with your actual schema name
- Use `jq .` for pretty JSON output in bash scripts
- All endpoints require valid JWT authentication
- Schema parameter is required for all endpoints
