timetip(1) -- time manager
==========================

## SYNOPSIS

`timetip` [<command>] [<args...>]

## DESCRIPTION

Deliciously-minimal time tracker for the command-line, with a very simple
command-line interface. Timetip is able to log your tasks, as well as query
them and display it nicely.

## SHORTHANDS

Here are all the commands you need to get started. These are shortened form of
the [COMMANDS][] below to help you do the most common tasks.

 * `timetip` <new-task-name> :
   Starts working on the <task> you're doing. (Alias: `start`)

 * `timetip` <date>|<range> :
   Shows entries for the given <date>. (Alias: `show`)

 * `timetip` :
   Shows entries for today. (Alias: `show today`)

 * `timetip -` [<reason>] :
   Stops working, and logs your <reason> for the break. (Alias: `stop`)

## COMMANDS

Below is a full list of commands you can use in their proper form:

 * `timetip start` <new-task-name> :
   Start working on <task>.

 * `timetip stop` [<reason>] :
   Stops working. Optionally, you may give a <reason>.

 * `timetip show` [<date>|<range>|all] :
   Show entries for the given <date> or <range>, or show `all` entries. When no 
   arguments are given, `today` is assumed. See [DATES AND RANGES][] for details 
   on the possible formats.

 * `timetip edit` :
   Opens the time log in your default text editor.

 * `timetip summary` [<date>|<range>|all] :
   Shows the summary for a given <date> or <range>. When no arguments are given, 
   shows the summary for all entries in the time sheet.

## OPTIONS

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

## DATES AND RANGES

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
It's an ini file. It looks like this:

    [2013-01-01 mon]
    2:45pm = Meeting with John
    3:00pm =
    3:10pm = -- lunch

Note that comments (beginning in `;`) are going to be stripped.

## REPORTERS

You can use custom reporters to change the display format. By default, it comes
with the following reporters:

  * `default` - Default reporter for terminal viewing.
  * `json` - Exports your data to JSON.
  * `tmux` - Displays a tmux status.

You can export your data using the `json` reporter:

    $ timetip --reporter json

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

## SEE ALSO

timetip-extras(1)
