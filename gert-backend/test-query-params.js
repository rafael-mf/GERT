const {
  isValidValue,
  sanitizeSearchTerm,
  parseIntSafe,
  parseBooleanSafe,
  parseDateSafe,
  getPaginationParams
} = require('./src/utils/query-params.util');

console.log('=== TESTE DE VALIDAÇÃO DE QUERY PARAMS ===\n');

// Teste 1: isValidValue
console.log('--- TESTE 1: isValidValue ---');
const testValues = [
  { value: 'teste', expected: true },
  { value: '', expected: false },
  { value: '  ', expected: false },
  { value: 'undefined', expected: false },
  { value: 'null', expected: false },
  { value: undefined, expected: false },
  { value: null, expected: false },
  { value: 0, expected: true },
  { value: 123, expected: true },
  { value: false, expected: true },
];

testValues.forEach(({ value, expected }) => {
  const result = isValidValue(value);
  const status = result === expected ? '✓' : '✗';
  console.log(`${status} isValidValue(${JSON.stringify(value)}) = ${result} (esperado: ${expected})`);
});
console.log('');

// Teste 2: sanitizeSearchTerm
console.log('--- TESTE 2: sanitizeSearchTerm ---');
const searchTests = [
  { value: '  termo  ', expected: 'termo' },
  { value: '', expected: null },
  { value: 'undefined', expected: null },
  { value: 'null', expected: null },
  { value: undefined, expected: null },
  { value: 'busca válida', expected: 'busca válida' },
];

searchTests.forEach(({ value, expected }) => {
  const result = sanitizeSearchTerm(value);
  const status = result === expected ? '✓' : '✗';
  console.log(`${status} sanitizeSearchTerm(${JSON.stringify(value)}) = ${JSON.stringify(result)} (esperado: ${JSON.stringify(expected)})`);
});
console.log('');

// Teste 3: parseIntSafe
console.log('--- TESTE 3: parseIntSafe ---');
const intTests = [
  { value: '123', expected: 123 },
  { value: '0', expected: 0 },
  { value: 'abc', expected: null },
  { value: '', expected: null },
  { value: 'undefined', expected: null },
  { value: undefined, expected: null },
  { value: 456, expected: 456 },
];

intTests.forEach(({ value, expected }) => {
  const result = parseIntSafe(value);
  const status = result === expected ? '✓' : '✗';
  console.log(`${status} parseIntSafe(${JSON.stringify(value)}) = ${result} (esperado: ${expected})`);
});
console.log('');

// Teste 4: parseBooleanSafe
console.log('--- TESTE 4: parseBooleanSafe ---');
const boolTests = [
  { value: true, expected: true },
  { value: 'true', expected: true },
  { value: '1', expected: true },
  { value: 1, expected: true },
  { value: false, expected: false },
  { value: 'false', expected: false },
  { value: '0', expected: false },
  { value: 0, expected: false },
  { value: undefined, expected: false },
  { value: '', expected: false },
];

boolTests.forEach(({ value, expected }) => {
  const result = parseBooleanSafe(value);
  const status = result === expected ? '✓' : '✗';
  console.log(`${status} parseBooleanSafe(${JSON.stringify(value)}) = ${result} (esperado: ${expected})`);
});
console.log('');

// Teste 5: getPaginationParams
console.log('--- TESTE 5: getPaginationParams ---');
const paginationTests = [
  { input: { page: '2', limit: '20' }, expected: { page: 2, limit: 20, offset: 20 } },
  { input: { page: 'abc', limit: 'xyz' }, expected: { page: 1, limit: 10, offset: 0 } },
  { input: {}, expected: { page: 1, limit: 10, offset: 0 } },
  { input: { page: '0', limit: '0' }, expected: { page: 1, limit: 1, offset: 0 } },
  { input: { page: '5', limit: '200' }, expected: { page: 5, limit: 100, offset: 400 } }, // Limite máximo 100
];

paginationTests.forEach(({ input, expected }) => {
  const result = getPaginationParams(input);
  const matches = JSON.stringify(result) === JSON.stringify(expected);
  const status = matches ? '✓' : '✗';
  console.log(`${status} getPaginationParams(${JSON.stringify(input)}):`);
  console.log(`   Resultado: ${JSON.stringify(result)}`);
  console.log(`   Esperado:  ${JSON.stringify(expected)}`);
});
console.log('');

console.log('=== TESTES CONCLUÍDOS ===');
