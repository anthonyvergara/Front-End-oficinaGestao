import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCurrencyFormat]'
})
export class CurrencyFormatDirective {
  private previousValue: string | null = null; // Valor armazenado para detectar mudanças

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = this.el.nativeElement;
    let value = inputElement.value;

    // Remove caracteres não numéricos
    value = value.replace(/[^\d]/g, '');

    // Se o valor estiver vazio, limpa e retorna
    if (value === '') {
      inputElement.value = '';
      this.previousValue = null;
      return;
    }

    // Converte para número inteiro (em centavos) e formata
    const numValue = parseInt(value, 10);
    const formattedValue = this.formatCurrency(numValue);

    // Atualiza o valor formatado no input
    inputElement.value = formattedValue;

    // Armazena o valor formatado
    this.previousValue = formattedValue;
  }

  @HostListener('focus', ['$event'])
  onFocus(event: Event): void {
    const inputElement = this.el.nativeElement;

    // Remove o prefixo "£" ao focar para permitir edição
    const currentValue = inputElement.value;
    inputElement.value = this.removeFormatting(currentValue);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    const inputElement = this.el.nativeElement;
    const rawValue = inputElement.value;

    // Formata o valor apenas se tiver sido alterado
    if (rawValue !== this.previousValue) {
      const numValue = this.parseToNumber(rawValue);
      const formattedValue = this.formatCurrency(numValue);
      inputElement.value = formattedValue;

      // Atualiza o valor anterior com o novo valor formatado
      this.previousValue = formattedValue;
    }
  }

  private formatCurrency(value: number): string {
    const finalValue = value / 100; // Converte para valor monetário
    return '£ ' + finalValue.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private removeFormatting(value: string): string {
    // Remove prefixo e outros caracteres de formatação
    return value.replace(/[^\d.,]/g, '');
  }

  private parseToNumber(value: string): number {
    // Converte a string em um número inteiro (em centavos)
    const numericValue = parseFloat(value.replace(',', '.')) || 0;
    return Math.round(numericValue * 100);
  }
}
