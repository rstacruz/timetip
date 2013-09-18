timewriter
==========

Minimal time logs tracker. Runs on Node.js. Features:

 - **Friction-free time logging.** Just type `t shopping in the grocery` to 
 [start a task](#get-started).

 - **Everything in the terminal.** It's a Node.js command-line app that runs 
anywhere Node can. (even Windows!)

 - **Built for [humans][prog] who love text editors.** Time logs are stored in a 
 [human-readable format](#storage) that you can (should!) edit yourself.

 - **Portable data.** Aside from its human-readable format, you can [easily 
 export your data](#exporting) to json or csv.

## Install

Install it via npm:

    npm install -g timewriter

To make things easier, add this to your `~/.profile`. (optional)

    alias t="timewriter --file ~/.timelogs"

*Note: the examples below assume that you have the alias above. If you choose 
not to to use it, assume that the `t` below is `timewriter`.*

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
add an offset in the format `+<minutes>`. Example:

~~~ sh
$ t Misc coffee +3
# ...starts "Misc coffee" as if you ran it 3 mins ago
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

You can use the shortcut `t --edit` to open in in your default text editor 
(*$EDITOR*).

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

**Export your data** by using `t <date> --format json`:

~~~ js
$ t all --format json
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

Or `--format csv` if you so please: (actually tab-separated; great for pasting 
    into Google Docs)

~~~ js
$ t all --format csv
task  2013-09-18     3:45pm  4:42pm   61000    Jsconf    email speakers
task  2013-09-18     4:42pm  4:5Apm   43000    Jsconf    check tickets
~~~

## --help

~~~ sh
  Usage: tw [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -f, --file <path>  the data file [~/.timelogs]
    --edit             open the data file in a text editor

  Logging tasks:

    tw start <task>             start working
    tw start <task> +<n>        start working, offset N minutes
    tw stop [<reason>]          stop working
    tw <task>                   start working (shortcut to "start")

  Viewing logs:

    tw                          show today
    tw <date>                   show entries for the date
    tw <date> - <end>           show entries for date range

  Examples:

    tw myproject stuff          start working on "Myproject stuff"
    tw stop                     stop the current task
    tw stop lunch break         stop the current task, and log the reason

    tw sept 2                   show entries september 2
    tw 4 days ago               show entries from 4 days ago
    tw yesterday                show entries from yesterday
~~~

[prog]: http://en.wikipedia.org/wiki/Programmer


