import { Repository } from '@octokit/webhooks-types';
import { Deployment, ProjectConfig } from './project-config';
import { resolveHome } from './utils/resolve-home';
import { AppConfig } from './app-config';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

const APP_CONFIG = AppConfig.getInstance();

export class Project {
  config: ProjectConfig;
  repo_path: string;
  repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
    this.repo_path = path.resolve(
      resolveHome(APP_CONFIG.deploy_url),
      `${repository.name}-${repository.id}`
    );
    this.config = new ProjectConfig(this.repo_path);
  }

  exec(cmd?: string, deployment?: Deployment) {
    if (!cmd) return;
    child_process.execSync(cmd, {
      cwd: path.resolve(this.repo_path, deployment?.path ?? ''),
    });
  }

  updateRepo() {
    if (!fs.existsSync(this.repo_path)) {
      console.log(
        `Cloning repository ${this.repository.full_name} to ${this.repo_path}`
      );

      child_process.execSync(
        `git clone '${this.repository.ssh_url}' '${this.repo_path}'`
      );

      this.initRepo();
    } else {
      console.log(`Pulling new changes from ${this.repository.full_name}`);

      this.exec(`git reset --hard`);
      this.exec(`git clean -n -f`);
      this.exec(`git pull`);

      this.initRepo();
    }
  }

  initRepo() {
    for (const deployment_name in this.config.deployments) {
      const deployment = this.config.deployments[deployment_name];
      console.log(deployment);
      this.install(deployment);
      this.build(deployment);
    }
  }

  install(deployment: Deployment) {
    console.log(`Installing ${this.repository.full_name}`);
    this.exec(deployment.actions?.install, deployment);
  }

  build(deployment: Deployment) {
    console.log(`Building ${this.repository.full_name}`);
    this.exec(deployment.actions?.build, deployment);
  }
}
