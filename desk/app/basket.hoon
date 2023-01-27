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
  =images:store
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
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?+    path  (on-peek:def path)
    [%x %images ~]
    =/  jimg=json
      =,  enjs:format
      %-  pairs
      %+  turn
        ~(tap by images)
        |=  [image=cord meta=metadata:store]
        ^-  [cord json]
        :-  image
        %-  pairs
        :~
          ['time' (sect:enjs time.meta)]
          :-  'tags' 
            :-  %a
            %+  turn  ~(tap in tags.meta)
              |=  tag=term
              [%s tag]
        ==
      ``json+!>(jimg)
  ==
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+  mark  (on-poke:def mark vase)
      %noun
    `this
    ::
      %basket-action
    =/  act  !<(action:store vase)
    :: ?-  -.act
      :: ::
          :: %set-image
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
        ?.  (~(has in present.u.current-room) src.bowl)
            `this
        :: src.bowl is in our room
        ::
        ?.  =(src.bowl our.bowl)
          :: other attempting to set our
          :: if src is creator: set and update frontend
          ?:  =(src.bowl creator.u.current-room)
            =.  images  (put-image:hc act)
            :_  this  [(publish act) ~]
          :: if we are creator: set, update frontend, and poke everyone
          ?:  =(our.bowl creator.u.current-room)
            =.  images  (put-image:hc act)
            :_  this
            :-  (publish act)
            (poke-room:hc u.current-room act)
          :: else: do nothing
          `this
        :: us attempting to set self
        :: creator can set-self, everyone else has to fwd to creator
        ::
        :: if we are creator: set, update frontend, and poke everyone
        ?:  =(our.bowl creator.u.current-room)
          =.  images  (put-image:hc act)
          :_  this
          :-  (publish act)
          (poke-room:hc u.current-room act)
        :: else: fwd to creator
        :_  this
          (poke-creator:hc u.current-room act)
      ==
    :: ==
  ==
++  on-watch
  |=  =path
  ::
  ^-  (quip card _this)
  ?>  =(src.bowl our.bowl)
  ?+    path
    (on-watch:def path)
      [%frontend ~]
    `this
  ==
--
:: ::
:: :: helper core
:: ::
|_  bowl=bowl:gall
++  publish
  |=  [act=action:store]
  (fact:agentio basket-action+!>(act) ~[/frontend])
++  put-image
  |=  [act=action:store]
  ^-  images:store
  ?-  -.act
      %tag-image
  =/  old-meta=(unit metadata:store)
      (~(get by images) image.act)
  ?~  old-meta  images
  %+  ~(put by images)
  image.act
  [(~(put in tags.u.old-meta) tag.act) now.bowl]
  ::
      %set-image
  =/  new-meta=metadata:store
    ?~  meta.act
      [*(set term) now.bowl]
    u.meta.act
  =/  old-meta=(unit metadata:store)
      (~(get by images) image.act)
  ?~  old-meta
    :: we have a new image
    %+  ~(put by images)
    image.act
    new-meta
  :: we have a repeat image, merge metadata
    %+  ~(put by images)
    image.act
    [(~(uni in tags.u.old-meta) tags.new-meta) time.u.old-meta]
  ==
++  poke-creator
  |=  [=room:rooms act=action:store]
  :_  ~
  %+  poke:pass:agentio
      [creator.room %basket]
      :-  %basket-action
      !>  act
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
