import Urbit from '@urbit/http-api';
import React, { useState, useEffect} from 'react';


const api = new Urbit('', '', window.desk);
api.ship = window.ship;

interface MetaData {
  tags:string[];
  time:number;
}
interface MetaImage{
  url:string;
  meta:MetaData;
}

export const RepoView = () => {
    const [images, setImages] = useState<MetaImage[]>(new Array<MetaImage>)
  
    useEffect(() => {
      async function init() {
        const gotImages = await api.scry({
          app: 'basket',
          path: '/images'
        });

        let mims : MetaImage[] = new Array<MetaImage>;
        for (var key in gotImages) {
          let mim : MetaImage = {
            url: key,
            meta: {
              tags:gotImages[key].tags,
              time:gotImages[key].time,
            }
          }
          mims.push(mim);
        }

        mims.sort((a:MetaImage, b:MetaImage) => {
          return b.meta.time - a.meta.time;
        })

        setImages(mims);

        console.log('got images!', gotImages)
        
        // console.log(csv)
        // download('metrics.csv', csv)
      }
  
      init();
    }, []);


  return (
    <div
    style={{
      height:'calc(100vh - 50px)',
      marginTop:'50px'
    }}
    >
     
    {/* <p className=""
    >
      repo view
    </p> */}
    {Object.keys(images).length > 0 && 
        <div className="inline-block">
          {images.map((image:MetaImage) => (
            <div
              key={image.url}
              className="mb-2 py-1"
            >

              <div
                className="border"
                style={{
                  position:'relative',
                }}
              >
              <img src={image.url}
                className=""
                style={{
                  display:'block',
                  position:'relative',
                  maxHeight:'40vh'
                }}
              />
                <div
                className="p-1 flex flex-row"
                style={{
                  position:'absolute',
                  left:'0px',
                  top:'0px',
                }}
                >
                  <div className="p-1 flex-1 border bg-white hover:cursor-pointer"
                  >
                    forget
                  </div>
                  <div className="p-1 flex-1 border bg-white hover:cursor-pointer"
                    onClick={()=>{
                      api.poke({
                        app: 'basket',
                        mark: 'basket-action',
                        json: {'set-image':{
                            image:image.url,
                            meta:image.meta,
                        }}
                      });
                    }}
                  >
                    share
                  </div>
                </div>

                <div
                className="p-1 flex flex-row"
                style={{
                  position:'absolute',
                  bottom:'0px',
                }}
                >
                {image.meta.tags.map((tag:string) => (
                  <div
                    key={tag}
                    className="bg-white inline-block border px-1 mr-1"
                  >
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
                    </div>

                    <span className=' text-gray-600'>
                      {tag}
                    </span>
                  </div>
                  ))}
                </div>

              </div>

              
            </div>
          ))}
        </div>
      }
    </div>
  );
};
