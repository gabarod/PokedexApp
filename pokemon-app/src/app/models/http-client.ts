import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

// HTTP client injection token for standalone components
export const provideHttpClient = () => inject(HttpClient);