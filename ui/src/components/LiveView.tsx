import React, { useState } from 'react';
import Urbit from '@urbit/http-api';

interface MetaImage{
  image: string;
  tags: string[];
  time: number;
}
interface IMetaImage{
  metaImage: MetaImage;
}

const api = new Urbit('', '', window.desk);
api.ship = window.ship;

export const LiveView : React.FC<IMetaImage> = (props:IMetaImage) => {

  const {metaImage} = props;

  function pokeBasketTag() {
    const tagInput = document.getElementById('tag-input')! as HTMLInputElement;

    if (tagInput.value ==='') return;
    if (metaImage.image==='') return;

    api.poke({
        app: 'basket',
        mark: 'basket-action',
        json: {'tag-image':{
              'image':metaImage.image,
              'tag':tagInput.value,
        }}
      });

      tagInput.value='';
    return;
  }

  function pokeBasket() {

    const imageInput = document.getElementById('image-input')! as HTMLInputElement;

    if (imageInput.value ==='') return;

    api.poke({
        app: 'basket',
        mark: 'basket-action',
        json: {'set-image':{
              'image':imageInput.value,
              'meta':null,
        }}
      });

      imageInput.value='';
    }


  return (
    <div 
    className="flex items-center text-center"
    style={{
      height:'100vh',
      width:'100vw',
    }}
>

     {metaImage.image==='' ? (
      <p className="m-auto"
      >please set an image</p>
     ) : (
      <img src={metaImage.image}
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
    {/* {metaImage.image!=='' &&  */}
    {true && 
    <div className="tag-row"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'flex-start',
      }}
    >
      <div className="bg-white tag-row-input inline-block border mx-4 ">
        <input id={"tag-input"} type="text"
          onKeyDown={(e: any) => {
            if (e.key == 'Enter') {
              pokeBasketTag()
            }
        }}
          placeholder="tag"
          className=" pl-1 w-32 py-1 ml-1 \
                    disable-input-select"
          />
        {/* + / add tag icon */}
        <span
          className="pl-4 pr-2 inline-block hover:cursor-pointer text-gray-500"
          onClick={pokeBasketTag}
        >
          +
        </span>
      </div>
      {metaImage.tags.length > 0 && 
        <div className="inline-block">
          {metaImage.tags.map((tag:string) => (
            <div
              key={tag}
              className="bg-white inline-block border p-1 px-2 mr-1"
            >
              {/* x / delete icon
              <div
                className="inline"
                // onClick={handleKillTag}
                id={tag}
              >
              <svg xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1 inline-block hover:cursor-pointer"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                strokeWidth="2"
              
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              </div> */}

              <span className=' text-gray-600'>
                {tag}
              </span>
            </div>
        ))}
        </div>
      }
    </div>
    }
    <div className="pt-1 m-4 mt-1"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'flex-start',
      }}
    >
      <input id={"image-input"} type="text"
          className="w-full p-2 border"
          placeholder="image url"
          onKeyDown={(e: any) => {
            if (e.key == 'Enter') {
              pokeBasket()
            }
        }}
        />
        <button id={"image-input-button"} className="bg-white hover:cursor-pointer ml-2 py-2 px-4 border"
          onClick={() => {
            pokeBasket()
          }}
        >
          set
        </button>
    </div>
  </div>
</div>
  );
};
