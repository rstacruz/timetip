require './setup'

describe 'Color', ->
  color = require('../lib/color')

  it '.blue', ->
    expect(color.blue('hi')).eql \
      '\x1b[34mhi\x1b[0m'

  it '.color("blue", "hi")', ->
    expect(color('blue', 'hi')).eql \
      '\x1b[34mhi\x1b[0m'

  it '.color(32, "hi")', ->
    expect(color(32, 'hi')).eql \
      '\x1b[32mhi\x1b[0m'

  it '.color("32", "hi")', ->
    expect(color("32", 'hi')).eql \
      '\x1b[32mhi\x1b[0m'
