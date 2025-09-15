import React, { useState,  useEffect } from 'react'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import { useNavigate, useParams } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import { Heart, HeartIcon, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DAteSelect from '../components/DAteSelect'
import MovieCart from '../components/MovieCart'
import Loading from '../components/Loading'

const MovieDetails = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [show, setShow] = useState(null)

  const getshow = async () => {
    const show = dummyShowsData.find( show =>show._id === id)
    if(show){
      setShow({
        movie : show,
        dateTime : dummyDateTimeData
      })
    }
  }

  useEffect(()=>{
    getshow()
  },[id])
  return show ? (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        <img src={show.movie.poster_path} alt="" className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover'/>
        <div className='relative flex flex-col gap-3'>
          <BlurCircle top='-100px' left='-100px'/>
          <p className='text-primary'>ENGLISH</p>
          <h1 className='text-4xl font-semibold text-balance max-w-96'>{show.movie.title} </h1>

          <div className='flex gap-1'>
            <StarIcon className='fill-primary text-primary w-5 h-5 '/>
            {show.movie.vote_average.toFixed(1)} IMDb Rating
          </div>

          <p className='text-gray-400 text-sm mt-2 leading-tight max-w-xl'>{show.movie.overview}</p>

          <p>
            {timeFormat(show.movie.runtime)} . {show.movie.genres.map(genre=>genre.name).join(" | ")} . {show.movie.release_date.split("-")[0]}

          </p>

          <div className='flex gap-4 mt-6'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
              <PlayCircleIcon className='w-5 h-5'/>
              Watch Trailer</button>
            <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary rounded-md hover:bg-primary-dull transition font-medium cursor-pointer active:scale-95'>Buy Tickets</a>
            <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'><Heart className={`w-5 h-5`}/></button>
          </div>
        </div>
      </div>

      <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
      <div className=' overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {show.movie.casts.slice(0,12).map((cast,index)=>(
            <div key={index} className='flex flex-col items-center text-center' >
              <img src={cast.profile_path} alt="" className='rounded-full h-20 md:h-20 aspect-square object-cover' />
              <p className='text-xs mt-3 font-medium'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>
      <DAteSelect id={id} dateTime={show.dateTime} />

      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {dummyShowsData.slice(0,4).map((movie, index) => (
          <MovieCart key={index} movie={movie}/>
        ))}
      </div>

      <div className='flex justify-center mt-20 mb-40'>
        <button onClick={()=>{
          navigate('/movies') ;scrollTo(0,0)
}} className='bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer px-10 py-3 text-sm'>Show More</button>
      </div>
    </div>
  ) : (
    <Loading className='mb-40' />
  )
}

export default MovieDetails
