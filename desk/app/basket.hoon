:: basket:
::  share files in a room
::
/-  store=basket, rooms=rooms-v2
/+  basket
/+  default-agent, dbug, agentio
=,  format
:: ::
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  $:
  %0
  image=cord
  ==
+$  card     card:agent:gall
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
=<
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    hc    ~(. +> bowl)
    io    ~(. agentio bowl)
::
++  on-fail   on-fail:def
++  on-peek   on-peek:def
++  on-load  on-load:def
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  `this
++  on-save
  ^-  vase
  !>(state)
++  on-init
  ^-  (quip card _this)
  `this
++  on-leave
  |=  [=path]
  `this
++  on-agent  on-agent:def
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+  mark  (on-poke:def mark vase)
      %noun
    `this
    ::
      %basket-action
    =/  act  !<(action:store vase)
    ?-  -.act
      :: ::
          %set-image
      =/  rom
        .^(view:rooms %gx [(scot %p our.bowl) %rooms-v2 (scot %da now.bowl) %session %noun ~])
      ?+  -.rom  !!
        %session
        =/  current-rid=(unit @t)
          current.session-state.rom
        ?~  current-rid
          `this
        :: we're in a room
        ::
        =/  current-room
          %-  ~(get by rooms.session-state.rom)
          u.current-rid
        ::
        ?~  current-room  `this
        ?.  =(src.bowl creator.u.current-room)
          `this
        :: src.bowl is our rooms creator
        ::
        =.  image  image.act
        ::
        :_  this
        :-  update-frontend
        :: iff we're the creator, poke everyone else in the room
        ?.  =(our.bowl creator.u.current-room)  ~
        (poke-room:hc u.current-room [%set-image image])
      ==
    ==
  ==
++  on-watch
  |=  =path
  ::
  ^-  (quip card _this)
  ?>  =(src.bowl our.bowl)
  ?+    path
    (on-watch:def path)
      [%frontend ~]
    :_  this
    [update-frontend ~]
  ==
--
:: ::
:: :: helper core
:: ::
|_  bowl=bowl:gall
++  update-frontend
  (fact:agentio basket-action+!>([%set-image image]) ~[/frontend])
++  poke-room
  |=  [=room:rooms act=action:store]
  ^-  (list card)
  =.  present.room
    (~(del in present.room) our.bowl)
  %~  tap  in  
  ^-  (set card)
  %-  ~(run in present.room)
    |=  =ship
    %+  poke:pass:agentio
        [ship %basket]
        :-  %basket-action
        !>  act
-- 
