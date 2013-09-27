timetip
=======

Deliciously-minimal time tracker for the command-line. Built on Node.js.  

![Screenshot](https://github.com/rstacruz/timetip/raw/master/support/screenshot.png)

 - **Frictionless time logging.**  
 [>](#get-started) Start by typing `t shopping in the grocery`.

 - **Everything in the terminal.**  
  [>](#install) It's a Node.js command-line app that runs anywhere Node can.
  Even Windows!

 - **Natural language parsing.**   
 [>](#--help) All commands are composed in such a way as if you're talking to timetip.  
 Examples: `t stop` or `t Meeting 3 minutes ago`.

 - **For humans who love text editors.**  
 [>](#storage) Logs are stored in a simple human-editable format that you're
 encouraged to edit yourself.

 - **Portable data.**  
 [>](#exporting) Export to json painlessly. You can also use it as an
 [npm package](#programmatic-usage) to parse out your files.

[![Status](https://travis-ci.org/rstacruz/timetip.png)](https://travis-ci.org/rstacruz/timetip)

See the [man page] for more usage notes and examples.

## Install

Install it via npm:

    npm install -g timetip

To make things easier, add this to your `~/.profile`. (optional)

    alias t="timetip"

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
  2:22pm     ⋅ coffee break                                             8m
  2:30pm     Jsconf check ticket sales                               1h 5m
  3:35pm     ⋅ break                                                   14m
  3:49pm  ✓  Errands grocery                                        ⋅⋅ now
~~~

## Storage

Everything is stored in a human-editable format into `~/.timelogs` (use `--file`
    to change the location). You're encouraged to add, edit, delete and
rearrange entries using your favorite text editor.

~~~ ini
$ cat ~/.timelogs

[2013-09-16 mon]
1:14pm = Misc write emails
2:42pm = Misc balance checkbook
3:00pm =

[2013-09-18 wed]
3:14pm = Jsconf email speakers
3:59pm = -- coffee break
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
[time_log.js]: lib/time_log.js
[man page]: http://rstacruz.github.io/timetip/timetip.1.html
