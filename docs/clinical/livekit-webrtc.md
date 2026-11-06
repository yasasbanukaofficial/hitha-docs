---
id: livekit-webrtc
title: Server Integration
sidebar_label: Server Integration
slug: /clinical/livekit-webrtc
---

# Server Integration

Now that you have your HITHA API Key, you can move on to integrating HITHA's REST APIs with your server code. This diagram walks you through the flow request of starting a Voice & Video Consultation call via HITHA.

<div className="dyte-diagram-container">
  <img src="/img/diagrams/server-integration-flow.svg" alt="HITHA Voice & Video Server Integration Flow Diagram" width="100%" />
</div>

It all starts with creating a meeting which is needed to start a live video call. After a meeting has been created on HITHA's server, you can now add participants to the meeting. Each participant is given an `authToken` which is necessary for your client side to further interact with the meeting.

---

## 1. Create a Meeting

To initiate a consultation room, send a `POST` request to `/v2/meetings` from your backend server.

```bash
curl --request POST \
  --url https://api.hitha.lk/v2/meetings \
  --header 'Authorization: Basic <YOUR_API_KEY>' \
  --header 'Content-Type: application/json' \
  --data '{
    "title": "Dr. Perera Telehealth Consultation",
    "record_on_start": false
  }'
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "title": "Dr. Perera Telehealth Consultation",
    "status": "LIVE",
    "created_at": "2026-11-06T11:20:00.000Z"
  }
}
```

---

## 2. Add Participants to the Meeting

Once you receive the `meeting_id`, register both the patient and doctor participants to generate unique session authentication tokens.

```bash
curl --request POST \
  --url https://api.hitha.lk/v2/meetings/497f6eca-6276-4993-bfeb-53cbbbba6f08/participants \
  --header 'Authorization: Basic <YOUR_API_KEY>' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "Patient John Doe",
    "preset_name": "group_call_participant",
    "custom_participant_id": "patient_99214"
  }'
```

#### Response

```json
{
  "success": true,
  "data": {
    "id": "participant_c4b92c",
    "name": "Patient John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 3. Client Setup & Live Media Handshake

Send the received `authToken` down to your Flutter Mobile App or Web Client. The HITHA SDK establishes a persistent bidirectional WebRTC connection with the LiveKit SFU media cluster for real-time video, audio, and encrypted diagnostic telemetry.
