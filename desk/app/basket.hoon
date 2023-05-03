:: basket:
::  share files in a room...
::
/-  store=basket, rooms=rooms-v2
/+  basket, vita-client
/+  default-agent, verb, dbug, agentio
=,  format
:: ::
|%
+$  versioned-state
  $%  state-0
      state-1
  ==
+$  state-0  $:
  %0
  =images:store
  ==
+$  state-1  $:
  %1
  =images:store
  latest=cord
  ==
+$  card     card:agent:gall
--
=|  state-1
=*  state  -
^-  agent:gall
%-  %-  agent:vita-client
      [& ~nodmyn-dosrux]
%+  verb  &
%-  agent:dbug
=<
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    hc    ~(. +> bowl)
    io    ~(. agentio bowl)
::
++  on-fail   on-fail:def
++  on-load
  |=  old-state=vase
  ^-  (quip card _this)
  =/  old  !<(versioned-state old-state)
  ?-  -.old
    %0
      =.  images  images.old
      `this
    %1  `this(state old)
  ==
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
      :-  %a
      %+  turn
        ~(tap by images)
        |=  [image=cord meta=metadata:store]
        ^-  json
        %-  pairs
        :~
          ['url' %s image]
          :-  'meta'
          %-  pairs
          :~
          ['time' (sect:enjs time.meta)]
          :-  'tags' 
            :-  %a
            %+  turn  ~(tap in tags.meta)
              |=  tag=term
              [%s tag]
          ==
        ==
      ``json+!>(jimg)
  ==
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+  mark  (on-poke:def mark vase)
      %basket-action
    =/  act  !<(action:store vase)
    ::
    =/  current-room=room:rooms
        scry-room:hc
    ::
    ?.  (~(has in present.current-room) src.bowl)
        `this
    :: src.bowl is in our room
    ::
    ?.  =(src.bowl our.bowl)
      :: other attempting to set our
      :: if src is creator: set and update frontend
      ?:  =(src.bowl creator.current-room)
        =.  state  (take-action:hc act)
        :_  this  [(publish act) ~]
      :: if we are creator: set, update frontend, and poke everyone
      ?:  =(our.bowl creator.current-room)
        =.  state  (take-action:hc act)
        :_  this
        :-  (publish act)
        (poke-room:hc current-room act)
      :: else: do nothing
      `this
    :: we are poking ourself
    ::
    :: dont forward untag or forget, just apply the action
    ?:  ?|  =(-.act %forget-image)
            =(-.act %untag-image)
        ==
      =.  state  (take-action:hc act)
      :_  this
      [(publish act) ~]
    ::
    :: creator can set-self, everyone else has to fwd to creator
    :: if we are creator: set, update frontend, and poke everyone
    ?:  =(our.bowl creator.current-room)
      =.  state  (take-action:hc act)
      :_  this
      :-  (publish act)
      (poke-room:hc current-room act)
    :: else: fwd to creator
    :_  this
      (poke-creator:hc current-room act)
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
    %+  weld
      :~  (active:vita-client bowl)
      ==
    ?:  =(latest '')  ~
    [(publish [%set-image latest (~(get by images) latest)]) ~]
  ==
--
:: ::
:: :: helper core
:: ::
|_  bowl=bowl:gall
++  publish
  |=  [act=action:store]
  (fact:agentio basket-action+!>(act) ~[/frontend])
++  take-action
  |=  [act=action:store]
  ^-  state-1
  =.  latest
    ?+  -.act  latest
      %set-image
    image.act
    ==
  =.  images
    (put-image act)
  state
++  put-image
  |=  [act=action:store]
  ^-  images:store
  ?-  -.act
        %forget-image
    ?.  =(src.bowl our.bowl)
      images
    =/  old-meta=(unit metadata:store)
        (~(get by images) image.act)
    ?~  old-meta  images
    %-  ~(del by images)
    image.act
        %untag-image
    ?.  =(src.bowl our.bowl)
      images
    =/  old-meta=(unit metadata:store)
        (~(get by images) image.act)
    ?~  old-meta  images
    %+  ~(put by images)
    image.act
    [(~(del in tags.u.old-meta) tag.act) now.bowl]
    ::
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
++  is-desk-running
  |=  =desk
  ^-  ?
  =/  =rock:tire:clay
    .^(rock:tire:clay %cx /(scot %p our.bowl)//(scot %da now.bowl)/tire)
  ?~  got-pebble=(~(get by rock) desk)  |
  =(%live zest.u.got-pebble)
++  is-agent-running
  |=  agent=@tas
  .^(? %gu /(scot %p our.bowl)/[agent]/(scot %da now.bowl)/$)
++  scry-room
  :: if no room, or if not in a room, set current-room to a bunt with self in present and creator
  ^-  room:rooms
  ?.  (is-agent-running %rooms-v2)
    filler-room
  =/  rom
    .^(view:rooms %gx [(scot %p our.bowl) %rooms-v2 (scot %da now.bowl) %session %noun ~])
  ?+  -.rom  !!
    %session
    =/  current-rid=(unit @t)
      current.session-state.rom
    ?~  current-rid
      filler-room
    :: we're in a room
    ::
    =/  get-room
      %-  ~(get by rooms.session-state.rom)
      u.current-rid
    ::
    ?~  get-room
      filler-room
    u.get-room
  ==
++  filler-room
  =|  ourset=(set ship)
  =.  ourset
    (~(put in ourset) our.bowl)
  :*
    'basket-filler-room'
    our.bowl
    our.bowl
    %public
    'title'
    ourset
    ourset
    6
    ~
  ==
-- 
