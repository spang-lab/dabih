import {
  Controller,
  Tags,
  Route,
  Get,
  Security,
  OperationId,
} from '@tsoa/runtime';

import { Job } from '../types';

import list from './list';

@Route('job')
@Tags('Job')
@Security('api_key', ['dabih:admin'])
@Security('jwt', ['dabih:admin'])
export class JobController extends Controller {
  /**
   * List all jobs
   */
  @Get('list')
  @OperationId('listJobs')
  public listJobs(): Promise<Job[]> {
    return list();
  }
}
