import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';
import { groupStoreAction } from '@urbit/api';
import { LiveView } from './components/LiveView';
import { RepoView } from './components/RepoView';

const api = new Urbit('', '', window.desk);
api.ship = window.ship;


interface MetaImage{
  image: string;
  tags: string[];
  time: number;
}

export function App() {

  const [metaImage, setMetaImage] = useState<MetaImage>({image:'', tags:['test', '123', 'weras'], time:0});
  const [basketEvent, setBasketEvent] = useState<any>({});
  const [isLiveView, setIsLiveView] = useState(true);
  const [hasRealm, setHasRealm] = useState(true);
  const [inRoom, setInRoom] = useState(true);
  const [isRoomCreator, setIsRoomCreator] = useState(false);

  useEffect(() => {
    let e = basketEvent;
    if(e['set-image']) {
      let upd = e['set-image'];
      let mim = {
        image:upd.image,
        tags:upd.tags ? upd.tags : [],
        time:upd.time? upd.time: 0,
      }

      setMetaImage(mim);
      return;
    }
    if(e['tag-image']) {
      let upd = e['tag-image'];
      if(metaImage.image!==upd.image) return;
      let newTags : string[] = metaImage.tags.slice();
      newTags.push(upd.tag)
      let mim : MetaImage = {
        image:metaImage.image,
        tags: newTags,
        time:metaImage.time,
      }
      setMetaImage(mim);
    } 
  }, [basketEvent])

  useEffect(() => {
    async function init() {
    api.subscribe({
          app: "basket",
          path: "/frontend",
          event: (e:any)=>{
            console.log('basket event', e)
            setBasketEvent(e)
            
          },
          quit:(e:any)=>{console.log('basket quit', e)},
          err: (e:any)=>{console.log('basket err', e)}
      })

     

      try {
        const gotRoomsSession = await api.scry({
          app: 'rooms-v2',
          path: '/session',
        });
        console.log('got rooms session', gotRoomsSession)
        if(!gotRoomsSession.session.current) {
          setInRoom(false)
        } else {
          if(api.ship === gotRoomsSession.session.rooms[gotRoomsSession.session.current].creator.slice(1)) {
            setIsRoomCreator(true);
          }
        }
      } catch (error) {
        console.error('bad rooms scry');
        setHasRealm(false);
      }

    }

    init();
  }, []);


  return (
    <main className="flex items-center justify-center"
      style={{
        maxHeight:'100vh'
      }}
    >

    <div className="view-picker bg-white flex flex-row w-1/4 text-center border">
      <div className={`flex-1 hover:cursor-pointer p-1 ${isLiveView ? 'font-bold' : ''}`}
        onClick={()=> {
          setIsLiveView(true)
        }}
      >
        live
      </div>
      <div className={`flex-1 hover:cursor-pointer p-1 ${!isLiveView ? 'font-bold' : ''}`}
        onClick={()=> {
          setIsLiveView(false)
        }}
      >
        repo
      </div>
    </div>

    {!hasRealm || !inRoom ? 
      <div className="flex items-center"
        style={{
          height:'100vh',
        }}
      >
      {!hasRealm && <p>sorry, you need Realm to use 🧺 basket</p>}
      {!inRoom && <p>you need to be in a room to use 🧺 basket. please exit basket and open it again when you're in a room. </p>}
      </div>
    : (
      <div>
      {isLiveView ? (
      <LiveView metaImage={metaImage} />
      ) : (
        
      <RepoView />
        )}
        </div>
    ) }
    </main>
  );
}
