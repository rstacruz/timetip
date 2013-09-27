timetip-extras(1) -- extra tips and tricks for Timetip
======================================================

## TIPS

### Tmux status bar

There's a crappy Tmux status bar reporter using:

    $ t -R tmux

You can show it in your Tmux status bar using:

    # ~/.tmux.conf
    set -g status-right '  #(timetip -R tmux)  '

### Vim highlighting

Want to syntax-highlight your time logs properly? Add this on top of your 
`~/.timelogs`:

    # = vim:ft=dosini

It's not a file comment, but rather a key of `#` with a value of `vim:...`. It's
a hack since comments (`;`) are stripped out when logging tasks :)

### Multiple time logs

You may prefer to keep 2 (or more) time sheets: say, one for work and one for
home.

One way to accomplish this is to keep `~/.timelogs` as a symlink instead of a
file, and simply switch out the file it links to as you need them. Here's a
small bash script:

    # ~/.profile
    alias t="timetip"
    alias t-home="ln -nfs ~/Dropbox/Time/home.txt ~/.timelogs ; t"
    alias t-work="ln -nfs ~/Dropbox/Time/work.txt ~/.timelogs ; t"

You can now simply:

    $ t-home             # ..switch to the 'home' sheet
    $ t Do dishes        # ..logs a task to the 'home' sheet
    
    $ t-work             # ..switch to the 'work' sheet
    $ t Client meeting   # ..logs a task to the 'work' sheet

### Multiple time logs (alternative)

You can also set up 2 aliases that log to different files.

    # ~/.profile
    alias t-home="timetip --file ~/Dropbox/Timesheets/home.txt"
    alias t-work="timetip --file ~/Dropbox/Timesheets/work.txt"

You can then:

    $ t-home Do dishes            # ..log to the 'home' sheet
    $ t-work Client meeting       # ..log to the 'work' sheet
    
    $ t-home                      # ..view entries in 'home'
    $ t-work                      # ..view entries in 'work'

### Integration with pomo.js

Want to see a timer while you work? Try [pomo.js]. You can do `t Start things ;
pomojs -d 30 ; t stop` to use a timer with timetip.

Bonus: you can set up a bash function for this.

    # ~/.profile
    t-pomo() {
      t $@
      pomojs -d 30 $@
      t stop
    }

[pomo.js]: https://github.com/rstacruz/pomo.js
