/* eslint-env jest */

import models from '../src/modules/db'

describe('db module test', () => {
  test('models', () => {
    const expected = [
      'User',
      'Hobby'
    ]

    expect(Object.keys(models)).toEqual(expect.arrayContaining(expected))
  })
})
