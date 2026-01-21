# Lite Data Excavator API Documentation

## Overview

This document provides comprehensive information for frontend developers integrating with the Lite Data Excavator API. The API is built with Express.js and provides authentication, conversation management, and chat functionality.

## Base Configuration

- **Base URL**: `http://localhost:5000` (configurable via PORT environment variable)
- **API Prefix**: `/api`
- **Authentication**: Token-based with 8-day expiration
- **Rate Limiting**: 100 requests per 5 minutes per IP

## Authentication

### Token-Based Authentication

All protected endpoints require authentication. Tokens can be provided in three ways:

1. **Authorization Header (Recommended)**:

   ```
   Authorization: Bearer <token>
   ```

2. **Custom Header**:

   ```
   token: <token>
   ```

3. **Request Body**:
   ```json
   {
     "token": "<token>"
   }
   ```

### Authentication Endpoints

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response**:

```json
{
  "token": "uuid-string",
  "success": true
}
```

#### Token Refresh

```http
POST /api/auth/token
Authorization: Bearer <token>
```

**Response**:

```json
{
  "token": "new-uuid-string",
  "success": true
}
```

#### Get Current User

```http
GET /api/auth/whoami
Authorization: Bearer <token>
```

**Response**:

```json
{
  "userDetails": {
    "username": "string",
    "uuid": "string"
  },
  "success": true
}
```

## Chat API

### Send Message

```http
POST /api/chat/
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationUuid": "uuid-string-or-null",
  "message": "string"
}
```

**Response**:

```json
{
  "answer": {
    "uuid": "message-uuid",
    "conversationUuid": "conversation-uuid",
    "role": "assistant",
    "content": "AI response content"
  },
  "success": true
}
```

### Get All Conversations

```http
GET /api/chat/conversations
Authorization: Bearer <token>
```

**Response**:

```json
{
  "conversations": [
    {
      "id": 1,
      "uuid": "conversation-uuid",
      "owner_uuid": "user-uuid",
      "title": "string"
    }
  ],
  "success": true
}
```

### Get Conversation Messages

```http
GET /api/chat/conversations/:conversationUuid/messages
Authorization: Bearer <token>
```

**Response**:

```json
{
  "messages": [
    {
      "id": 1,
      "uuid": "message-uuid",
      "conversation_uuid": "conversation-uuid",
      "role": "user|assistant",
      "content": "string"
    }
  ],
  "success": true
}
```

## Error Handling

### HTTP Status Codes

- `400` - Validation errors
- `401` - Authentication errors
- `404` - Resource not found
- `500` - Internal server errors

### Error Response Format

**Standard Error**:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Validation Error**:

```json
{
  "errors": [
    {
      "location": "body",
      "msg": "Username is required",
      "path": "username",
      "type": "field"
    }
  ]
}
```

## Frontend Integration Examples

### JavaScript/TypeScript Example

```typescript
class ChatAPI {
  private baseURL = 'http://localhost:5000/api';
  private token: string | null = null;

  async login(username: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.success) {
      this.token = data.token;
      localStorage.setItem('chatToken', data.token);
    }
    return data;
  }

  private async authenticatedFetch(
    endpoint: string,
    options: RequestInit = {}
  ) {
    if (!this.token) {
      this.token = localStorage.getItem('chatToken');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('chatToken');
      this.token = null;
      throw new Error('Authentication expired');
    }

    return response.json();
  }

  async sendMessage(conversationUuid: string | null, message: string) {
    return this.authenticatedFetch('/chat/', {
      method: 'POST',
      body: JSON.stringify({ conversationUuid, message }),
    });
  }

  async getConversations() {
    return this.authenticatedFetch('/chat/conversations');
  }

  async getMessages(conversationUuid: string) {
    return this.authenticatedFetch(
      `/chat/conversations/${conversationUuid}/messages`
    );
  }
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface Conversation {
  id: number;
  uuid: string;
  owner_uuid: string;
  title: string;
}

interface Message {
  id: number;
  uuid: string;
  conversation_uuid: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useChatAPI() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('chatToken')
  );
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();
      if (!data.success && response.status === 401) {
        localStorage.removeItem('chatToken');
        setToken(null);
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    if (!token) return;
    const data = await apiCall('/chat/conversations');
    if (data.success) {
      setConversations(data.conversations);
    }
  };

  const sendMessage = async (
    conversationUuid: string | null,
    message: string
  ) => {
    return apiCall('/chat/', {
      method: 'POST',
      body: JSON.stringify({ conversationUuid, message }),
    });
  };

  const getMessages = async (conversationUuid: string) => {
    return apiCall(`/chat/conversations/${conversationUuid}/messages`);
  };

  useEffect(() => {
    if (token) {
      loadConversations();
    }
  }, [token]);

  return {
    token,
    conversations,
    loading,
    sendMessage,
    getMessages,
    loadConversations,
  };
}
```

## Best Practices

### 1. Token Management

- Store tokens securely (localStorage for web apps, secure storage for mobile)
- Implement automatic token refresh before expiration
- Handle token expiration gracefully by redirecting to login

### 2. Error Handling

- Always check the `success` field in responses
- Implement retry logic for network errors
- Provide user-friendly error messages

### 3. Request Optimization

- Implement request debouncing for typing indicators
- Use WebSocket or polling for real-time updates (not currently supported)
- Cache conversation lists to reduce API calls

### 4. Security

- Never expose tokens in URLs or error messages
- Implement CSRF protection if using cookies
- Validate user input before sending to API

## Development Notes

### Environment Setup

```bash
# Start the API server
npm start

# Development mode with hot reload
npm run dev

# Environment variables
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2
```

### Testing

Use tools like Postman or curl to test endpoints:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Send message
curl -X POST http://localhost:5000/api/chat/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"conversationUuid":null,"message":"Hello"}'
```

## Future Enhancements

The API is planned to include:

- WebSocket support for real-time messaging
- File upload capabilities
- Advanced conversation search and filtering
- User profile management
- API versioning
- Comprehensive OpenAPI/Swagger documentation

## Support

For questions or issues with the API implementation, refer to the source code in the `/src` directory or check the existing issue tracker.
