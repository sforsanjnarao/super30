sequenceDiagram
    participant External as User/Webhook
    participant API as API Server
    participant Kafka as Queue
    participant Worker as Background Worker
    participant DB as Database

    Note over External, DB: STEP 1: TRIGGER
    External->>API: Hits Webhook URL
    API->>DB: Create "Running" Status
    API->>Kafka: Add Job #1 (Start Node)
    API-->>External: Respond "OK" (Connection Closed)

    Note over External, DB: STEP 2: EXECUTION A
    Worker->>Kafka: Picks up Job #1
    Worker->>Worker: Runs Logic (e.g., AI)
    Worker->>DB: Check: Who is next?
    DB-->>Worker: "Node B is next"
    Worker->>Kafka: Add Job #2 (Node B) using Output of A

    Note over External, DB: STEP 3: EXECUTION B
    Worker->>Kafka: Picks up Job #2
    Worker->>Worker: Runs Logic (e.g., Telegram)
    Worker->>DB: Check: Who is next?
    DB-->>Worker: "Nobody"

    Note over External, DB: STEP 4: FINISH
    Worker->>DB: Mark Status "Completed"