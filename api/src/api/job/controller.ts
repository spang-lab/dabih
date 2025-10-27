import {
  Controller,
  Tags,
  Route,
  Get,
  Security,
  OperationId,
} from '@tsoa/runtime';

import { Job, Scope } from '../types';

import list from './list';

@Route('job')
@Tags('Job')
@Security('api_key', [Scope.ADMIN])
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
