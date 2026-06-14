import { Queue } from "bullmq";
import { redisConnection } from "./redisconnection.queue.js";

export const imageTransformQueue = new Queue("image-processing", {
  connection: redisConnection,
  concurrency: 5, // Number of concurrent jobs to process by single worker 
});
