# timewriter

Minimal time log tracker. Runs on top of Node.js.

### Install

Install via NPM:

    npm install -g timewriter

To make things easier, add this to your `~/.profile`:

    alias t="timewriter --file ~/.timelogs"

### Usage

Log a task by typing `t PROJECT [TASK]`. For instance:

    $ t Jsconf email speakers

And stop it using:

    $ t stop

You may also issue a reason to stop:

    $ t stop coffee break

Now view the status:

    $ t

    today  >  sept 18, 2013
              3:14pm Jsconf email speakers        [45m]
              3:59pm -- coffee break --

