require '../setup'

describe 'Helpers', ->
  Helpers = require('../../lib/helpers')

  describe 'sortedPush()', ->
    {sortedPush} = Helpers

    it 'empty', ->
      obj = {}
      result = sortedPush(obj, 'a', 2)

      expect(result).eql
        a: 2

    it 'inserting at beginning', ->
      obj = { b: 2, d: 2 }
      result = sortedPush(obj, 'a', 2)

      expect(Object.keys(result)).eql \
        [ 'a', 'b', 'd' ]

    it 'inserting into middle', ->
      obj = { a: 2, b: 2, d: 2 }
      result = sortedPush(obj, 'c', 2)

      expect(Object.keys(result)).eql \
        [ 'a', 'b', 'c', 'd' ]

    it 'inserting into end', ->
      obj = { a: 2, b: 2, d: 2 }
      result = sortedPush(obj, 'z', 2)

      expect(Object.keys(result)).eql \
        [ 'a', 'b', 'd', 'z' ]
