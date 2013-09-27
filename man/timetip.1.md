timetip(1) -- simple time tracker and time sheet manager
========================================================

## SYNOPSIS

`timetip` [<shorthand>]  \
`timetip` <command> [<args...>]

## DESCRIPTION

Deliciously-minimal time tracker for the command-line, with a very simple
command-line interface. Timetip is able to log your tasks, as well as query
them and display it nicely.

## COMMANDS

Below is a full list of commands you can use in their proper form.

 * `start` <new-task-name> :
   Start working on <task>. See [TASKS][].

 * `stop` [<reason>] :
   Stops working. you may optionally give a <reason> to be logged.

 * `show` [<date>|<range>|all] :
   Show entries for the given <date> or <range>, or show all entries. When no 
   arguments are given, 'today' is assumed. See [DATES][] for details on the
   possible formats.

 * `edit` :
   Opens the time log in your default text editor.

 * `dates` :
   Lists down which dates have time entries in them.

 * `summary` [<date>|<range>|all] :
   Shows the summary for a given <date> or <range>. When no arguments are given, 
   'all' is assumed.

## SHORTHANDS

The shorthand syntax is a shortened form of the [COMMANDS][] above to help you
do the most common tasks.

 * `timetip` <new-task-name> :
   Starts working on the <task> you're doing. (same as `start`)

 * `timetip` <date>|<range> :
   Shows entries for the given <date>. (`show`)

 * `timetip` :
   Shows entries for today. (`show`)

 * `timetip -` [<reason>] :
   Stops working, and logs your <reason> for the break. (`stop`)

Here are some examples of the shorthand syntax:

    $ timetip Meeting        <->  timetip start Meeting
    $ timetip yesterday      <->  timetip show yesterday
    $ timetip - lunch        <->  timetip stop lunch

## OPTIONS

These are general options that work with almost all of the commands.

  * `-R`, `--reporter` <name> :
    Use the reporter <name>. See [REPORTERS][] for more info.

  * `-u`, `--use` <path> :
    Load the JavaScript file in <path> as a plugin. This is useful for making
    your own custom reporters or commands.

  * `-f`, `--file` <path> :
    Use the file in <path> as the time sheet file. See [FILE FORMAT][].

  * `--no-color` :
    Disables the use of color in outputs.

  * `-h`, `--help` :
    Displays a help screen.

  * `-V`, `--version` :
    Displays version information and exits.

## TASKS

Tasks are started with the `timetip start` command. The convention is that the 
first word is always the project name -- this is simply for the convenience of 
having summaries.

    $ timetip start Meeting with Dan

The `start` keyword is optional. You may omit it and just type the task name out
(as long as it doesn't clash with any of the internal commands).

    $ timetip Jsconf send out emails
    $ timetip Errands go to the grocery
    $ timetip Calls return the call of Amy's secretary

### Times and offsets

You may specify a time as well. This is useful for when you started working 
without logging it first.

    $ timetip start Meeting 11:53am

You can also specify the time as an offset in the form of `<duration> ago`.

    $ timetip start Meeting 15m ago
    $ timetip start Meeting 3 minutes ago

And of course, these conventions work with the [SHORTHANDS][] too:

    $ timetip Meeting 3m ago

### Finishing tasks (and breaks)

When you're done with a task, simply terminate it with `stop`.

    $ timetip stop

This creates a "break", and timetip will keep track of how long your break times are.
You can also specify a reason for your break.

    $ timetip stop lunch break

You can also use `-` (hyphen), which is an alias for `stop`.

    $ timetip -
    $ timetip - coffee

Specifying times and offsets work just as well.

    $ timetip stop 3m ago
    $ timetip stop phone call with dad 5m ago
    $ timetip stop 11:20pm

## DATES

The <date> strings are parsed as natural language dates. They can be simple
dates (eg: `March 5`), or any reasonable format that can be figured out
unambiguously (eg: `last thursday`). Some examples:

    $ timetip today
    $ timetip september 2
    $ timetip jan 20
    $ timetip yesterday
    $ timetip 1 month ago
    $ timetip 23 days ago

Ranges, often used for `show`, and  can be in the following formats:

  * <date> - <date>
  * since <date>

Examples:

    $ timetip mar 2 - mar 5
    $ timetip since last week
    $ timetip last mon - last thu

## FILE FORMAT

It's an ini file. It is designed to be human-editable and human-readable, and 
you are encouraged to edit your time sheets outside of `timetip`. Files are 
saved to `~/.timelogs` by default, and looks like this:

    [2013-09-16 mon]
    1:14pm = Misc write emails
    2:42pm = Misc balance checkbook
    3:00pm =
    
    [2013-09-18 wed]
    3:14pm = Jsconf email speakers
    3:59pm = -- coffee break
    4:09pm = Jsconf check ticket sales
    4:25pm = Errands grocery

The format boils down to these:

  * Dates are headings in the format of `[yyyy-mm-dd dom]`
  * Tasks are in the format `<time> = <project>`
  * Breaks are in the format of `<time> = `
  * Breaks with reasons are in the format of `<time> = -- <reason>`

Note that comments (beginning in `;`) are going to be stripped.

## REPORTERS

You can use custom reporters to change the display format. By default, it comes
with the following reporters:

  * `default` - Default reporter for terminal viewing.
  * `json` - Exports your data to JSON.
  * `tmux` - Displays a tmux status.

You can export your data using the `json` reporter:

    $ timetip --reporter json
      {
        "date": "2013-09-26",
        "entries": [
          { "type": "task",
            "project": "Meeting",
            "task": "skype with Dan",
            "duration": 30000000,
            "date": "2013-09-26T02:40:00.000Z",
            "endDate": "2013-09-26T02:40:00.000Z" }, ...
        ]
      }
          

## EXAMPLES

Here are some ways to start or stop a task:

  * $ `timetip` Meeting with John :
    Starts working on "Meeting with John".

  * $ `timetip` Meeting 3m ago :
    Starts working on "Meeting" and gives it a timestamp that's 3 minutes ago
    from now.

  * $ `timetip stop` :
    Stops the current task.

  * $ `timetip stop` lunch break :
    Stops the current task, and logs the reason for your break.

  * $ `timetip summary` :
    Shows a summary of project hours.

  * $ `timetip summary` since last month :
    Summarizes the last month's hours.
