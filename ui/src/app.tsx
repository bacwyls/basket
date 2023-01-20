import React, { useEffect, useState } from 'react';
import Urbit from '@urbit/http-api';
import { groupStoreAction } from '@urbit/api';

const api = new Urbit('', '', window.desk);
api.ship = window.ship;


export function App() {

  const [image, setImage] = useState('');
  const [hasRealm, setHasRealm] = useState(true);
  const [inRoom, setInRoom] = useState(true);
  const [isRoomCreator, setIsRoomCreator] = useState(false);

  useEffect(() => {
    async function init() {
    api.subscribe({
          app: "basket",
          path: "/frontend",
          event: (e:any)=>{
            console.log('basket event', e)
            if(!e['set-image']) return
            setImage(e['set-image'].image)
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


  function pokeBasket() {

    const imageInput = document.getElementById('image-input')! as HTMLInputElement;
    api.poke({
        app: 'basket',
        mark: 'basket-action',
        json: {'set-image':imageInput.value}
      });
    }

  return (
    <main className="flex items-center justify-center max-h-screen">
    {!hasRealm || !inRoom ? 
      <div>
      {!hasRealm && <p>sorry, you need Realm to use 🧺basket</p>}
      {!inRoom && <p>you need to be in a room to use 🧺basket. please exit basket and open it again when you're in a room. </p>}
      </div>
    : (
      <div className="w-full p-1">
        <img src={image} 
          className='pb-1 w-full max-h-screen'
          />
        {isRoomCreator &&
        <div className=""
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'flex-end',
            justifyContent: 'flex-start',
            width:'100%',
          }}
        >
          <input id={"image-input"} type="text"
              className="w-full p-2 bg-white border border-black"
              placeholder="image url"
            />
            <button className="hover:cursor-pointer ml-2 py-2 px-4 font-bold border border-black"
                        onClick={pokeBasket}
                  >set</button>
        </div>
       }
      </div>
    ) }
    </main>
  );
}
