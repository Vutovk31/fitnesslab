import { makeForm } from './diary-preview.mjs';

// Manual transcription only; no recognition, nutrition estimates or writes.
export function transcriptForm(text, line, date, timezone) {
  if (typeof text !== 'string' || text.length > 8000) throw new RangeError('Текст не должен превышать 8000 символов');
  const lines = text.split(/\r\n|\n|\r/);
  if (!Number.isSafeInteger(line) || line < 1 || line > lines.length) throw new RangeError('Укажите существующий номер строки');
  const parts = lines[line - 1].split(';').map(s => s.trim());
  if (parts.length > 2 || !parts[0] || parts[0].length > 300) throw new RangeError('Формат: продукт; количество и единица');
  const form = { ...makeForm(date, timezone), name: parts[0] };
  if (parts.length === 2) {
    const match = /^(\d+(?:[.,]\d+)?)\s*(г|мл|шт\.?)$/u.exec(parts[1]);
    if (!match || !Number.isFinite(Number(match[1].replace(',', '.'))) || Number(match[1].replace(',', '.')) <= 0) throw new RangeError('Количество: например 150 г, 200 мл или 0,5 шт.');
    const unit = match[2] === 'г' ? 'g' : match[2] === 'мл' ? 'ml' : 'piece';
    Object.assign(form, { amount: match[1], unit, basis_unit: unit, basis_amount: unit === 'piece' ? '1' : '100' });
  }
  return form;
}
