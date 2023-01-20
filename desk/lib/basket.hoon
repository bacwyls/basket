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
    %set-image
     %-  pairs
      :~
      ['image' %s image.act]
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
        [%set-image so]
      ==
    --
  --
--