import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCurrencyFormat]'
})
export class CurrencyFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = this.el.nativeElement;
    let value = inputElement.value;

    // Remove caracteres não numéricos, exceto ponto e vírgula
    value = value.replace(/[^\d]/g, '');

    // Se o valor estiver vazio, apenas retorne
    if (value === '') {
      inputElement.value = '';
      return;
    }

    // Converte para número e divide por 100 para ajustar
    const numValue = parseInt(value, 10); // Mantém o valor como inteiro (em centavos)

    // Formata como moeda
    const formattedValue = this.formatCurrency(numValue);
    
    // Atualiza o valor do input
    inputElement.value = formattedValue;
  }

  private formatCurrency(value: number): string {
    const finalValue = value / 100; // Converte para valor monetário
    return '£ ' + finalValue.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  @HostListener('focus', ['$event'])
  onFocus(event: Event): void {
    const inputElement = this.el.nativeElement;

    // Remove o prefixo "£" ao focar para permitir digitação
    inputElement.value = inputElement.value.replace('£ ', '').replace(/\./g, '').replace(',', '.');
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const inputElement = this.el.nativeElement;

    // Adiciona o prefixo "£" ao perder o foco
    let value = inputElement.value;
    value = value.replace(/[^\d.,]/g, '');

    if (value) {
      let numValue = parseFloat(value.replace(',', '.')) * 100; // Mantém como inteiro (em centavos)
      inputElement.value = this.formatCurrency(numValue);
    } else {
      inputElement.value = '';
    }
  }
}
