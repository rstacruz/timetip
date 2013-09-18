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

## Get started

**Log** a task by typing `t <thing-to-do>`. (By convention, the first word 
    is ideally the project name).  For instance:

    $ t Jsconf email speakers

**Stop** it using `t stop`:

    $ t stop

You may also issue a reason to stop:

    $ t stop coffee break

**View the status** with simply `t`:

    $ t

    today  >  September 18, 2013

              3:14pm  Jsconf email speakers              45m
              3:59pm  -- coffee break                    10m
              4:09pm  Jsconf check ticket sales          14m
      now  >  4:25pm  Errands grocery                     4m+

## Storage

Everything is stored in a human-editable format into `~/.timelogs` (use `--file` 
    to change the location). This means you can add, edit, delete and rearrange 
entries using your favorite text editor.

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

  Usage: tw [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -f, --file <path>  the data file [~/.timelogs]

  Usage:

    tw [start] <project> [<task>]  # start working
    tw stop [<reason>]             # stop working

    tw [status]                    # show current status
    tw summary                     # summarize log for all dates

    tw <date>                      # show entries
    tw <date> - <date>             # show entries for date range

  Examples:

    tw myproject                   # start working on "myproject"
    tw stop                        # stop tracking
    tw stop lunch break            # stop tracking and log the reason
    tw 2 days ago                  # show entries from 2 days ago

[prog]: http://en.wikipedia.org/wiki/Programmer

