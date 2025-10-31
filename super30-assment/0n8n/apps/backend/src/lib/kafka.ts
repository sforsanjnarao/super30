import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'workflow-app',
  brokers: ['localhost:9092'], // Make sure this matches your docker-compose
});
