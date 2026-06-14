import { Worker } from "bullmq";
import { redisConnection } from "../Queues/redisconnection.queue.js";
import { transformgetimageservice } from "../Services/image.service.js";
import { log } from "node:console";
export const workerStratengine = () => {
  const worker = new Worker(
    "image-processing",
    async (job) => {
      try {
        console.log("hyyy in the job worker im ");

        const res = await transformgetimageservice(job.data);
        console.log("HARSHHHHHHH      hyyy in the job worker im res ", res);
        return res;
      } catch (error) {
        console.error("WORKER ERROR =>", error);
        throw error;
      }
    },
    {
      connection: redisConnection,
    },
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.log("JOB FAILED");
    console.log("Job Id:", job.id);
    console.log("Reason:", err);
  });
};
