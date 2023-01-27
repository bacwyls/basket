/-  sur=basket
=<  [sur .]
=,  sur
|%
::
++  enjs
  =,  enjs:format
  |%
  ++  action
    |=  act=^action
    ^-  json
    %-  pairs
    :_  ~
    ^-  [cord json]
    :-  -.act
    ?-  -.act
    %forget-image
     %-  pairs
      :~
      ['image' %s image.act]
      ==
    %untag-image
     %-  pairs
      :~
      ['image' %s image.act]
      ['tag' %s tag.act]
      ==
    %tag-image
     %-  pairs
      :~
      ['image' %s image.act]
      ['tag' %s tag.act]
      ==
    %set-image
     %-  pairs
      :~
      ['image' %s image.act]
      :-  'time' 
        ?~  meta.act  ~
        (sect:enjs time.u.meta.act)
      :-  'tags' 
        ?~  meta.act  ~
        :-  %a
        %+  turn  ~(tap in tags.u.meta.act)
          |=  tag=term
          [%s tag]
      ==
    ==
  --
++  unit-ship
    |=  who=(unit @p)
    ^-  json
    ?~  who
      ~
    [%s (scot %p u.who)]
++  set-ship
  |=  ships=(set @p)
  ^-  json
  :-  %a
  %+  turn
    ~(tap in ships)
    |=  her=@p
    [%s (scot %p her)]
::
++  dejs
  =,  dejs:format
  |%
  ++  patp
    (su ;~(pfix sig fed:ag))
  ++  action
    |=  jon=json
    ^-  ^action
    =<  (decode jon)
    |%
    ++  decode
      %-  of
      :~
        [%set-image set-image]
        [%forget-image forget-image]
        [%tag-image tag-image]
        [%untag-image tag-image]
      ==
    ++  tag-image
      %-  ot
      :~  
          [%image so]
          [%tag so]
      ==
    ++  forget-image
      %-  ot
      :~  
          [%image so]
      ==
    ++  set-image
      %-  ot
      :~  
          [%image so]
          [%meta (mu meta)]
      ==
    ++  meta
      %-  ot
      :~  
          [%tags (as so)]
          [%time di]
      ==
    --
  --
--