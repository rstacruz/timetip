require './setup'
chai.should()

describe 'Formatter', ->
  beforeEach ->
    @f = require '../lib/formatter'

  describe 'strings', ->
    it '%s', ->
      @f("Hello %s", "John").should.eql \
        "Hello John"

    it '%s %s', ->
      @f("Hey %s & %s", "Tegan", "Sara").should.eql \
        "Hey Tegan & Sara"

    it '%s', ->
      @f("Hey %s & %s", "Tegan", "Sara").should.eql \
       "Hey Tegan & Sara"

    it '%s int', ->
      @f("Hey %s", 112).should.eql \
       "Hey 112"

  describe 'floats', ->
    it '%f', ->
      @f("%f", 3.1415926535).should.eql \
        "3.1415926535"

    it '%.2f (precision)', ->
      @f("%.2f", 3.1415926535).should.eql \
        "3.14"

    it '%.2f (precision, rounding)', ->
      @f("%.3f", 3.1415926535).should.eql \
        "3.142"

    it '%.2f (precision, padding)', ->
      @f("%.4f", 3.1).should.eql \
        "3.1000"

    it '%10.2f (precision, spacing)', ->
      @f("%10.2f", 3.1415).should.eql \
        "      3.14"

    it '%010.2f (precision, 0 spacing)', ->
      @f("%010.2f", 3.1415).should.eql \
        "0000003.14"

  describe 'integers', ->
    it '%i', ->
      @f("There are %i people", 12).should.eql \
        "There are 12 people"

    it '%d', ->
      @f("%d", 12).should.eql \
        "12"

    it '% 4i', ->
      @f("% 4i", 12).should.eql \
        "  12"

    it '%-4i', ->
      @f("%-4i", 12).should.eql \
        "12  "

    it '%04i', ->
      @f("%04i", 12).should.eql \
        "0012"

    it '%+i', ->
      @f("%+i", 12).should.eql \
        "+12"

    it '%+4i', ->
      @f("%+4i", 12).should.eql \
        " +12"

  describe 'hash tables', ->
    it '%(x)i', ->
      @f("it's %(temp)i*C", {temp: 4}).should.eql \
        "it's 4*C"

    it 'multiple', ->
      @f("from %(me)s to %(you)s", {me: 'R', you: 'K'}).should.eql \
        "from R to K"

  describe 'char', ->
    it '%c 36', ->
      @f("%c", 36).should.eql \
        "$"
    it '%c 0x7f', ->
      @f("%c", 0x7f).should.eql \
        "\x7f"

  describe 'ansi', ->
    it '%s', ->
      @f("%-10s", "Hey").should.eql \
        "Hey       "

    it '%s with codes', ->
      @f("%-10s", "Hey\x1b[0m").should.eql \
        "Hey\x1b[0m       "
