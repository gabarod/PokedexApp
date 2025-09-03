import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription: Subscription = new Subscription();
  private lastKey: string = '';
  private lastTranslation: string = '';

  constructor(private translationService: TranslationService) {
    // Subscribe to language changes to trigger pipe updates
    this.subscription = this.translationService.currentLang$.subscribe(() => {
      // This will cause the pipe to re-evaluate
      this.lastKey = '';
    });
  }

  transform(key: string): string {
    if (key !== this.lastKey) {
      this.lastKey = key;
      this.lastTranslation = this.translationService.translate(key);
    }
    return this.lastTranslation;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}