require '../setup'

describe 'Color', ->
  color = require('../../lib/color')

  it '.blue', ->
    color.blue('hi').should.eq '\x1b[34mhi\x1b[0m'

  it '.color(word, msg)', ->
    color('blue', 'hi').should.eq '\x1b[34mhi\x1b[0m'

  it '.color(num, msg)', ->
    color(32, 'hi').should.eq '\x1b[32mhi\x1b[0m'

  it '.color("num", msg)', ->
    color("32", 'hi').should.eq '\x1b[32mhi\x1b[0m'

  describe '.use', ->
    it '.use(num)', ->
      blue = color.use(32)
      blue('hi').should.eq '\x1b[32mhi\x1b[0m'

    it '.use("num")', ->
      blue = color.use('33')
      blue('hi').should.eq '\x1b[33mhi\x1b[0m'

    it '.use(word)', ->
      blue = color.use('blue')
      blue('hi').should.eq '\x1b[34mhi\x1b[0m'

  describe '.ansi', ->
    it '.ansi(word)', ->
      color.ansi('blue').should.eq 34

    it '.ansi(words)', ->
      color.ansi('bold blue').should.eq "1;34"

    it '.ansi(num)', ->
      color.ansi(340).should.eq 340

    it '.ansi("num")', ->
      color.ansi("340").should.eq "340"
