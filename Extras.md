# Extras

## Integration with pomo.js

You can do `t Start things && pomojs -d 30 ; t stop` to use a timer with 
timetap.

## Tmux status bar

There's a crappy Tmux status bar reporter using:

    $ t -R tmux > ~/.timetip_stat

And you can run it continuously (save this as a bash script):

    while true; do t -R tmux > ~/.timetip_stat; sleep 30; done

When that script is running continuously, you can show it in your Tmux status 
bar using:

~~~ sh
# ~/.tmux.conf
set -g status-right '  #(cat ~/.timetip_stat)  '
~~~


