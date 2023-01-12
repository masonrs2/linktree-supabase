"use client"
import React, { useEffect, useState } from 'react'
import supabase from '../utils/supabaseClient'
import pfp from '../assets/pfp.jpeg'
import Image from 'next/image'
import Link from 'next/link'
import { BsCheck2All } from 'react-icons/bs'
import ImageUploading, { ImageListType } from 'react-images-uploading'

const page = () => {
  const [isAuthentificated, setIsAuthentificated] = useState(false)
  const [user, setUser] = useState()
  const [userId, setUserId] = useState()
  const [username, setUsername] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [links, setLinks] = useState()
  const [svg, setSvg] = useState('')
  const [images, setImages] = useState([])
  
  const onChange = (imageList) => {
    setImages(imageList)
  }

  const addNewLink = async () => {
    try{
        const { data, error } = await supabase
        .from('Links')
        .insert({
              title: title,
              url: url,
              userId: userId,
              svg: svg
            })
          .select();
    
        if(error) throw error
        console.log("data(addNewLink): ", data)
        if(links) { 
          setLinks([...data, ...links])
        }
        
    } catch (error) {
      console.log( "error", error)
    }
  }

  const uploadProfilePic = async () => {
    try {
      if(images.length > 0) { 
        const image = image[0]
  
        if(image.file && userId) {
          const { data, error } = await supabase.storage.
                from("public")
                .upload(`${userId}/${image.file.name}`, image.file , { upsert: true, })

          if(error) throw error

          const resp = await supabase.storage.from("public").getPublicUrl(data.path);
          console.log("resp", resp)
          const publicUrl = resp.data.publicUrl;
          console.log("publicUr", publicUrl)

          const updateUserResponse = await supabase
                  .from("users")
                  .update({ profile_pic_url: publicUrl })
                  .eq('id', userId);

                  if(updateUserResponse.error) throw updateUserResponse.error

        }
      }

    } catch (error) {
      console.log("error: ", error)
    }
  }


  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser()
      console.log("user: ", user)
      if(user) {
        const userId = user.data.user?.id;
        console.log("userId: ", userId)
        setIsAuthentificated(true)
        setUser(user);
        setUserId(userId);
        
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    const getLinks = async () => {
      try {
        const {data, error } = await supabase
                .from('Links')
                .select('title, url, svg')
                .eq('userId', userId)
        
        if(error) throw error
        console.log("data (getLinks): ", data)
        setLinks(data)
                
      } catch (error) { 
        console.log("error: ", error)
      }
    }
    if(userId) {
      getLinks()
    }
  }, [userId])

  return (
    <div className="w-screen h-screen">
      <div className="h-full justify-center flex ">
        <div className="flex flex-col py-20 justify-center items-center "> 
        { isAuthentificated===false && (
          <div>
            <Link href="/login">
              <button className="bg-black text-gray-300 font-semibold  px-3 py-2 w-80 rounded-md">Log in</button>
            </Link>
          </div>
        ) }
        { images.length > 0 &&
          <Image width={40} height={40} src={images[0]["data_url"]} alt="pfp" className="rounded object-contain" >
            </Image>
        }
            <h1 className="font-semibold text-xl mt-4">@mxsonrs</h1>

            { isAuthentificated && (
                <div className="flex flex-col w-full py-2">
                  {
                    links?.map((link, index) => (
                      <div key={index} className="w-full bg-white h-10 rounded-md justify-between flex flex-row items-center px-3 hover:scale-105 duration-100">
                          <Link href={link.url}>
                          <svg className="text-black w-8 h-8" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d={link.svg}/>
                          </svg>

                          </Link>
                            <p className="font-semibold ">{link.title}</p>
                            <BsCheck2All size={25} />
                        
                      </div>
                    ))
                  }
                </div>
              )
            }

            {
              isAuthentificated && (
                <div className="flex flex-col outline rounded mt-10">
                  <div className='flex px-10 justify-center items-center mt-2'>
                    <input 
                          type="text"
                          name="title"
                          id="title"
                          onChange={(e) => setTitle(e.target.value)}
                          value={title}
                          placeholder="Enter Link title"
                          className="block w-60  md:w-80 pl-3 rounded-md mt-9 shadow text-lg py-1 border outline-none border-gray-300 mr-2"
                      />
                    <input 
                          type="text"
                          name="link"
                          id="link"
                          onChange={(e) => setUrl(e.target.value)}
                          value={url}
                          placeholder="Enter Link url"
                          className="block w-60 md:w-80 pl-3 mr-2  rounded-md mt-9 shadow text-lg py-1 border outline-none border-gray-300 "
                      />
                    <input 
                          type="text"
                          name="svg"
                          id="svg"
                          onChange={(e) => setSvg(e.target.value)}
                          value={svg}
                          placeholder="Enter Icon Svg"
                          className="block w-60  md:w-80 pl-3 rounded-md mt-9 shadow text-lg py-1 border outline-none border-gray-300 "
                      />
                  </div>

                  <div className="w-full justify-center flex mt-5">
                    <button onClick={addNewLink} type="button" className="py-2 px-4  bg-black hover:bg-gray-800   focus:ring-gray-700 focus:ring-offset-indigo-200 text-gray-300 w-80 justify-center flex transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg mb-10">
                          Submit
                  </button>

                  <ImageUploading 
                    multiple
                    value={images}
                    onChange={onChange}
                    maxNumber={1}
                    dataURLKey="data_url"
                  >
                    {({onImageUpload, onImageRemoveAll, isDragging, dragProps}) => (
                      <div>
                        {images.length === 0 ? (
                          <div onClick={uploadProfilePic}>
                            <button
                              style={isDragging ? { color: "red" } : undefined}
                              onClick={onImageUpload}
                              {...dragProps}
                              className=" bg-black hover:bg-gray-800   focus:ring-gray-700 focus:ring-offset-indigo-200 text-gray-300 w-80 justify-center flex transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 h-10 flex items-center ml-3 rounded-lg mb-10"
                            >
                              Upload image
                            </button>
                          </div>
                        ) : (
                          <button onClick={onImageRemoveAll} className=" bg-black hover:bg-gray-800   focus:ring-gray-700 focus:ring-offset-indigo-200 text-gray-300 w-80 justify-center flex transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 h-10 flex items-center ml-3 rounded-lg mb-10">Remove all images</button>
                        )}
                      </div>
                    )}
                  </ImageUploading>

                  </div>
                </div>
              )
            }
        </div>
      </div>
    </div>
  )
}

export default page