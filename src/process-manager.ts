import pm2 from 'pm2';

pm2.connect((err) => {
  if (err) {
    console.error(err);
  }
});

export class ProcessManager {
  private static instance: ProcessManager;

  static getInstance() {
    if (ProcessManager.instance) {
      ProcessManager.instance = new ProcessManager();
    }
    return ProcessManager.instance;
  }
}
