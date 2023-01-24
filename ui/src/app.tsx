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

      imageInput.value='';
    }

  return (
    <main className="flex items-center justify-center"
      style={{
        maxHeight:'100vh'
      }}
    >
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
      <div 
          className="items-center text-center input-box-wrap"
          style={{
            height:'100vh',
            width:'100vw',
          }}
      >
      
           {image==='' ? (
            <p
            style={{
              margin: '50% auto'
            }}
            >please set an image</p>
           ) : (
            <img src={image}
              style={{
                height:'100vh',
                objectFit:'contain'  
              }}
              className=''
              />
           )
           }

        <div
          className="input-box"
          style={{
            position: 'fixed',
            bottom: 5,
            // left: 5,
            width:'100%',

          }}
        >
          <div className="pt-1 m-4 "
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignSelf: 'flex-end',
              justifyContent: 'flex-start',
            }}
          >
            <input id={"image-input"} type="text"
                className="w-full p-2 bg-white border border-black"
                placeholder="image url"
                onKeyDown={(e: any) => {
                  if (e.key == 'Enter') {
                    pokeBasket()
                  }
              }}
              />
              <button className="hover:cursor-pointer ml-2 py-2 px-4 font-bold border border-black bg-white text-black"
                onClick={() => {
                  pokeBasket()
                }}
              >
                set
              </button>
          </div>
        </div>
      </div>
    ) }
    </main>
  );
}
