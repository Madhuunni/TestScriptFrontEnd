import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { PromptRow } from './prompt-row.model';
import { TestScriptService } from './test-script.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly testScriptService = inject(TestScriptService);
  private nextRowId = 1;

  readonly rows: PromptRow[] = [this.createRow()];

  addPromptRow(): void {
    this.rows.push(this.createRow());
  }

  submitPrompt(row: PromptRow): void {
    const prompt = row.prompt.trim();

    if (!prompt) {
      row.error = 'Enter prompt text before submitting.';
      row.response = '';
      return;
    }

    row.isLoading = true;
    row.error = '';
    row.response = '';

    this.testScriptService
      .submitPrompt(prompt)
      .pipe(finalize(() => (row.isLoading = false)))
      .subscribe({
        next: (response) => (row.response = response),
        error: (error: unknown) => {
          row.error = this.getErrorMessage(error);
        },
      });
  }

  trackByRowId(_index: number, row: PromptRow): number {
    return row.id;
  }

  private createRow(): PromptRow {
    return {
      id: this.nextRowId++,
      prompt: '',
      response: '',
      isLoading: false,
      error: '',
    };
  }

  private getErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }

    return 'Unable to fetch test results from the handler function.';
  }
}
