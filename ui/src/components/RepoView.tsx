import React, { useState, useEffect } from 'react';


const api = window.urbit;

interface MetaData {
  tags: string[];
  time: number;
}
interface MetaImage {
  url: string;
  meta: MetaData;
}

interface IRepoView {
  basketEvent: any;
  setIsLiveView: any;
}


export const RepoView: React.FC<IRepoView> = (props: IRepoView) => {
  const api = window.urbit;

  let { basketEvent, setIsLiveView } = props;

  const [images, setImages] = useState<MetaImage[]>(new Array<MetaImage>)

  useEffect(() => {
    let e: any = basketEvent;
    if (e['untag-image'] || e['forget-image']) {
      loadImages()
    }
  }, [basketEvent])

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const gotImages = await api.scry({
      app: 'basket',
      path: '/images'
    });

    let mims: MetaImage[] = gotImages;

    mims.sort((a: MetaImage, b: MetaImage) => {
      return b.meta.time - a.meta.time;
    })

    setImages(mims);
  }

  async function searchImages() {

    let searchTags: string[];
    const searchInput = document.getElementById('search-input')! as HTMLInputElement;

    if (!searchInput.value) {
      loadImages();
      return;
    }
    searchTags = searchInput.value.split(',').map(function (item) {
      return item.trim();
    });
    // console.log('using searchtags', searchTags)

    const gotImages = await api.scry({
      app: 'basket',
      path: '/images'
    });

    let mims: MetaImage[] = new Array<MetaImage>;

    for (var i = 0; i < gotImages.length; i++) {
      let mim: MetaImage = gotImages[i]
      const found: Boolean = mim.meta.tags.some(r => searchTags.indexOf(r) >= 0)
      if (found) {
        mims.push(mim);
      }
    }

    mims.sort((a: MetaImage, b: MetaImage) => {
      return b.meta.time - a.meta.time;
    })

    setImages(mims);
  }

  return (
    <div
      className='text-center'
      style={{
        height: 'calc(100vh - 40px)',
        marginTop: '50px'
      }}
    >
      <div className='w-full'>
        {images.length === 0 ? (<p>theres nothing here...</p>) : (
          <div className="inline-block pb-20">
            {images.slice(0, 50).map((image: MetaImage, imageIndex: any) => (
              <div
                key={imageIndex}
                className="mb-2 py-1"
              >
                <div
                  className="border"
                  style={{
                    position: 'relative',
                  }}
                >
                  <img src={image.url}
                    className=""
                    style={{
                      display: 'block',
                      position: 'relative',
                      maxHeight: '40vh'
                    }}
                  />
                  <div
                    className="p-1 flex flex-row"
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '0px',
                    }}
                  >
                    <div className="p-1 flex-1 border bg-white hover:cursor-pointer"
                      onClick={() => {
                        api.poke({
                          app: 'basket',
                          mark: 'basket-action',
                          json: {
                            'forget-image': {
                              image: image.url,
                            }
                          }
                        });
                      }}
                    >
                      forget
                    </div>
                    <div className="p-1 flex-1 border bg-white hover:cursor-pointer"
                      onClick={() => {
                        api.poke({
                          app: 'basket',
                          mark: 'basket-action',
                          json: {
                            'set-image': {
                              image: image.url,
                              meta: image.meta,
                            }
                          }
                        });
                        setIsLiveView(true);
                      }}
                    >
                      show
                    </div>
                  </div>

                  <div
                    className="p-1 flex flex-row overflow-x-scroll"
                    style={{
                      position: 'absolute',
                      bottom: '0px',
                      maxWidth: '100%'
                    }}
                  >
                    {image.meta.tags.map((tag: string, tagIndex: any) => (
                      <div
                        key={tagIndex}
                        className="flex flex-row flex-init bg-white inline-block border px-1 mr-1"
                      >
                        <div
                          className="inline"
                          onClick={() => {
                            api.poke({
                              app: 'basket',
                              mark: 'basket-action',
                              json: {
                                'untag-image': {
                                  image: image.url,
                                  tag: tag,
                                }
                              }
                            });
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1 inline-block hover:cursor-pointer"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            strokeWidth="2"

                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>

                        <span className=' text-gray-600'
                          style={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {tag}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-1 mt-1 w-full"
        style={{
          margin: '16px',
          width: 'calc(100% - 32px)',
          position: 'fixed',
          bottom: '0px',
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'flex-end',
          justifyContent: 'flex-start',
        }}
      >
        <input id={"search-input"} type="text"
          className="flex-1 p-2 border"
          placeholder="tags, go, here"
          autoComplete='off'
          onKeyDown={(e: any) => {
            if (e.key == 'Enter') {
              searchImages()
            }
          }}
        />
        <button id={"image-input-button"} className=" bg-white hover:cursor-pointer ml-2 py-2 px-4 border"
          onClick={() => {
            searchImages()
          }}
        >
          search
        </button>
      </div>
    </div>
  );
};
