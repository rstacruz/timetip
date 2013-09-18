# timewriter

Minimal time log tracker. Runs on top of Node.js.

## Install

Install via npm:

    npm install -g timewriter

To make things easier, add this to your `~/.profile`. (optional)

    alias t="timewriter --file ~/.timelogs"

### Logging

Log a task by typing `t <thing-to-do>`. (By convention, the first word is 
    ideally the project name).  For instance:

    $ t Jsconf email speakers

And stop it using:

    $ t stop

You may also issue a reason to stop:

    $ t stop coffee break

### Managing

Now view the status:

    $ t

    today  >  September 18, 2013

              3:14pm  Jsconf email speakers              [45m]
              3:59pm  -- coffee break --                 [10m]
              4:09pm  Jsconf check ticket sales          [14m]
      now  >  4:25pm  Errands grocery                    [4m+]

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

### Looking up

View entries from any date by using `t <date>`. It supports natural language 
parsing:

    $ t yesterday
    $ t aug 2

Or view a range by using `t <date> - <date>`:

    $ t last monday - last friday
    $ t aug 2 - aug 10
    $ t last month - now

Or all:

    $ t all

### Export

Need your data parsed elsewhere? No problem, use `--format json`:

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
