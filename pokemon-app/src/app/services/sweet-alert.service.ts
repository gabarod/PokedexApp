import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() {
    // Configure default SweetAlert2 settings
    Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    });
  }

  /**
   * Show a success message
   */
  success(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    });
  }

  /**
   * Show an error message
   */
  error(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-danger'
      }
    });
  }

  /**
   * Show a warning message
   */
  warning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    });
  }

  /**
   * Show an info message
   */
  info(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    });
  }

  /**
   * Show a confirmation dialog
   */
  confirm(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary'
      }
    });
  }

  /**
   * Show a Pokemon capture success
   */
  pokemonCaptured(pokemonName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: '🎉 Pokemon Captured!',
      text: `${pokemonName} has been added to your Pokédex!`,
      icon: 'success',
      confirmButtonText: 'Awesome!',
      background: '#f0f9ff',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    });
  }

  /**
   * Show a team creation success
   */
  teamCreated(teamName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title: '⚡ Team Created!',
      text: `Team "${teamName}" is ready for battle!`,
      icon: 'success',
      confirmButtonText: 'Great!',
      background: '#f0f9ff',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    });
  }

  /**
   * Show a battle result
   */
  battleResult(winner: string, probability: number): Promise<SweetAlertResult> {
    const isHighProbability = probability >= 70;
    
    return Swal.fire({
      title: `🏆 ${winner} Wins!`,
      text: `Victory probability: ${probability}%`,
      icon: isHighProbability ? 'success' : 'info',
      confirmButtonText: 'Battle Again',
      background: isHighProbability ? '#f0f9ff' : '#fffbeb',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    });
  }

  /**
   * Show a loading indicator
   */
  showLoading(title: string = 'Loading...'): void {
    Swal.fire({
      title,
      text: 'Please wait while we process your request',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Hide the loading indicator
   */
  hideLoading(): void {
    Swal.close();
  }

  /**
   * Show a custom Pokemon-themed alert
   */
  pokemonAlert(
    title: string, 
    text: string, 
    icon: SweetAlertIcon = 'info',
    pokemonImage?: string
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon,
      imageUrl: pokemonImage,
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Pokemon',
      confirmButtonText: 'Got it!',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      customClass: {
        confirmButton: 'btn btn-primary'
      }
    });
  }

  /**
   * Show a toast notification
   */
  toast(title: string, icon: SweetAlertIcon = 'success'): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon,
      title
    });
  }

  /**
   * Input dialog for custom data
   */
  input(
    title: string, 
    inputPlaceholder: string = '',
    inputValue: string = ''
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      input: 'text',
      inputPlaceholder,
      inputValue,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a value!';
        }
        return null;
      }
    });
  }
}