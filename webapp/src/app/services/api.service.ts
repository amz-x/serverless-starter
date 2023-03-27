import { Injectable } from '@angular/core';

// AWS Amplify API
import { API } from '@aws-amplify/api';

// Constants
import { API_NAME } from '../constants/amplify.config';

// Interfaces
import { Task } from '@interfaces';

@Injectable()
export class APIService {

  private _API      = API;

  constructor() {}

  /* --- Tasks --- */

  /**
   * GET /v1/tasks
   */
  async getTasks(): Promise<Task[]> {
    return await this._API.get(API_NAME, `/tasks`, {});
  }

  /**
   * PUT /v1/tasks/:id
   */
  async createTask(body = {}): Promise<Task> {
    return await this._API.post(API_NAME, `/tasks`, {
      body: { ...body }
    });
  }

  /**
   * GET /v1/tasks/:id
   */
  async getTask(id: string | null): Promise<Task | null> {
    // Validate
    if (id === null) {
      return null;
    }

    // Get Task
    return await this._API.get(API_NAME, `/tasks/${id}`, {});
  }

  /**
   * PUT /v1/tasks/:id
   */
  async updateTask(id: string, body = {}): Promise<Task> {
    return await this._API.put(API_NAME, `/tasks/${id}`, {
      body: { ...body }
    });
  }

  /**
   * DELETE /v1/tasks/:id
   */
  async deleteTask(id: string): Promise<Task> {
    return await this._API.del(API_NAME, `/tasks/${id}`, {});
  }
}
