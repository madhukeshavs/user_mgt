import { CronJob } from 'cron';


export const createEntry = new CronJob('*/2 * * * *', () => {
    console.log("Cron job is running every 2 minutes", new Date().toLocaleString());
});

export const callCronJob = () => {
    createEntry.start();
    console.log("Cron job started successfully!");
}
