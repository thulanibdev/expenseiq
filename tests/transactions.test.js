import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseAmount, toCSV } from '../lib/transactions.js'
test('amounts must be positive finite numbers that can be represented as cents', () => {
  for (const amount of ['', ' ', '-3', '0', 'NaN', 'Infinity', '1e100', '0.001']) assert.equal(parseAmount(amount), null, amount)
  assert.equal(parseAmount('12.345'), 12.35)
  assert.equal(parseAmount('0.10'), 0.1)
})
test('CSV preserves commas, quotes and line breaks and neutralises text formulas', () => {
  assert.equal(toCSV([['Description', 'Amount'], ['Food, "coffee"\nand cake', 12.5]]), '"Description","Amount"\r\n"Food, ""coffee""\nand cake","12.5"')
  assert.equal(toCSV([['=SUM(A1)', -2]]), '"\'=SUM(A1)","-2"')
})
