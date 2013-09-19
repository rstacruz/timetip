timetip
=======

Deliciously-minimal time tracker for the command-line. Built on Node.js.  

![Screenshot](https://github.com/rstacruz/timetip/raw/master/support/screenshot.png)

 - **Friction-free time logging.** Just type `t shopping in the grocery` to 
 [start a task](#get-started).

 - **Everything in the terminal.** It's a Node.js command-line app that runs 
anywhere Node can. (even Windows!)

 - **Built for [humans][prog]** who love text editors. Time logs are stored in a 
 [human-editable format](#storage) that you can (should!) edit yourself.

 - **Natural language parsing.** All commands are made in such a way as if 
 you're talking to timetip, eg: `t stop`, `t Doing things 3 minutes ago`.

 - **Portable data.** Aside from its human-editable format, you can [easily 
 export your data](#exporting) to json or csv. You can also use it as an [npm 
 package](#programmatic-usage) to parse out your files in Node.

*(WIP: works, but see [feature roadmap](tasks.taskpaper) for progress on getting 
    it feature-complete.)*

## Install

Install it via npm:

    npm install -g rstacruz/timetip

To make things easier, add this to your `~/.profile`. (optional)

    alias t="timetip --file ~/.timelogs"

*Note: the examples below assume that you have the alias above. If you choose 
not to to use it, assume that the `t` below is `timetip`.*

## Get started

**Log** a task by typing `t <thing-to-do>`. (By convention, the first word 
    is ideally the project name).  For instance:

~~~ sh
$ t Jsconf email speakers
# ...starts the task "Jsconf email speakers"
~~~

**Stop** it using `t stop`:

~~~ sh
$ t stop
# ...stops the current task
~~~

You may also issue a reason to stop:

~~~ sh
$ t stop coffee break
# ...stops the current task for the reason of "coffee break"
~~~

**View the status** with simply `t`:

~~~ sh
$ t

  september 18, 2013                                          total 1h 15m

  1:30pm     Jsconf email speakers                                     52m
  2:22pm     ⋅⋅ coffee break                                            8m
  2:30pm     Jsconf check ticket sales                               1h 5m
  3:35pm     ⋅⋅ break                                                   3m
  3:38pm  ✓  Errands grocery
~~~

## Catching up

Oops. Did you start working and forget to run your timer? No problem, just use 
add an offset in the format `<duration> ago`, or specify the time. Example:

~~~ sh
$ t Misc coffee 3m ago
# ...starts "Misc coffee" as if you ran it 3 mins ago

$ t Misc coffee 3 minutes ago
# ...same

$ t Misc coffee 11:52am
# ...starts it at a specific time

$ t stop 12:30pm
# ...also works for `stop`
~~~

## Storage

Everything is stored in a human-editable format into `~/.timelogs` (use `--file` 
    to change the location). This means you can (should!) add, edit, delete and 
rearrange entries using your favorite text editor.

~~~ ini
$ cat ~/.timelogs

[2013-09-16 mon]
1:14pm = Misc write emails
2:42pm = Misc balance checkbook
3:00pm = ----

[2013-09-18 wed]
3:14pm = Jsconf email speakers
3:59pm = -- coffee break --
4:09pm = Jsconf check ticket sales
4:25pm = Errands grocery
~~~

You can use `t edit` to open in in your default text editor ($EDITOR).

## Looking up entries

**View entries from any date** by using `t <date>`. It supports natural language 
parsing:

    $ t yesterday
    $ t aug 2
    $ t last friday

**Query a date range** by using `t <date> - <date>`:

    $ t last monday - last friday
    $ t aug 2 - aug 10
    $ t last month - now

Or all:

    $ t all

## Exporting

**Export your data** by using the alternative reporters (`--reporter`). The 
*json* reporter exports your data as a Json object:

~~~ js
$ t all --reporter json
{
  entries: [
    {
      type: "task",
      date: "2013-09-18T05:32:47.333Z",
      endDate: "2013-09-18T05:32:47.333Z",
      duration: 60000,
      project: "Jsconf",
      task: "Email speakers"
    }, ...
  ]
}
~~~

Or `--reporter csv` if you so please: (actually tab-separated; great for pasting 
    into Google Docs)

~~~ js
$ t all --reporter csv
task  2013-09-18     3:45pm  4:42pm   61000    Jsconf    email speakers
task  2013-09-18     4:42pm  4:5Apm   43000    Jsconf    check tickets
~~~

## --help

~~~ sh
  Usage: timetip [options]

  Options:

    -h, --help          output usage information
    -V, --version       output the version number
    -f, --file <path>   the data file [~/.timelogs]
    -R, --reporter <r>  use reporter (default|json)
    --no-color          disable colors

  Logging tasks:
    timetip start <task>           start working
    timetip stop [<reason>]        stop working

  Other commands:
    timetip show <date>            show entries for the date
    timetip show <date> - <end>    show entries for date range
    timetip edit                   open in text editor

  Shortcuts:
    timetip                        show today (alias: show today)
    timetip <task>                 start working (alias: start)
    timetip - [<reason>]           stop working (alias: stop)
    timetip <date>                 show entries for the date (alias: show)

  Examples:
    timetip myproject stuff        start working on "myproject stuff"
    timetip meeting 3m ago         start working on "meeting" 3 minutes ago
    timetip stop                   stop the current task
    timetip stop lunch break       stop the current task and log the reason

    timetip sept 2                 show entries september 2
    timetip 4 days ago             show entries from 4 days ago
    timetip yesterday              show entries from yesterday
~~~

## Programmatic usage

Want to easily parse time logs? Use it as a Node.js module. See the 
[source][time_log.js] for more details.

~~~ js
var TimeLog = require('timetip').TimeLog;

var log = new TimeLog('~/.timelogs');

var day = log.get('2013-09-02');
var day = log.get(new Date(2013, 8, 2));

day.entries
day.last
day.summary
~~~

## Acknowledgements

© 2013, Rico Sta. Cruz. Released under the [MIT License].

[MIT License]: http://www.opensource.org/licenses/mit-license.php

[prog]: http://en.wikipedia.org/wiki/Programmer
[time_log.js]: lib/time_log.js
