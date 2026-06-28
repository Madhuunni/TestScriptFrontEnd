import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

export interface HandlerResponse {
  result?: unknown;
  results?: unknown;
  response?: unknown;
  message?: unknown;
  [key: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class TestScriptService {
  private readonly http = inject(HttpClient);

  submitPrompt(prompt: string): Observable<string> {
    return this.http
      .post<HandlerResponse | string>(environment.handlerUrl, { prompt })
      .pipe(map((response) => this.formatResponse(response)));
  }

  private formatResponse(response: HandlerResponse | string): string {
    if (typeof response === 'string') {
      return response;
    }

    const preferredValue = response.results ?? response.result ?? response.response ?? response.message;

    if (preferredValue !== undefined) {
      return this.stringifyValue(preferredValue);
    }

    return this.stringifyValue(response);
  }

  private stringifyValue(value: unknown): string {
    return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
  }
}
