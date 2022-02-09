import { gql, GraphQLClient } from 'graphql-request';
import Section from '../components/Section';
import NavBar from  '../components/NavBar'
import Link from  'next/Link';
import Image from  'next/Image'
import disneyLogo from '../public/disney-button.png'
import marvelLog from '../public/marvel-button.png'
import natgeoLogo from '../public/natgeo-button.png'
import starWLogo from '../public/star-wars-button.png'
import pixarLogo from '../public/pixar.png'

export const getStaticProps = async () => {

  const url = process.env.ENDPOINT
  const graphQLClient = new GraphQLClient(url,
    {
      headers: {
        "Authorization":process.env.GRAPH_CMS_TOKEN
      }
    })

  const videosQuery = gql`
    query{
      videos{
        createdAt,
        id,
        title,
        description,
        seen,
        slug,
        tags,
        thumbnail{
          url
        },
        mp4{
          url
        }
      }
    }
  `

  const accountQuery = gql `
    query{
      account(where:{id: "ckzeqjsu82nto0b24dqbtxowv"}){
        username
        avatar{
          url
        }
      }
    }
  `

  const data = await graphQLClient.request(videosQuery)
  const videos = data.videos
  const dataAccount = await graphQLClient.request(accountQuery)
  const account = dataAccount.account

  return {
    props: {
      videos,
      account
    }
  }
}


const Home =  ({ videos, account }) => {

  const randomVideo = (videos)=>{
      return videos[Math.floor(Math.random() * videos.length)]
  }

  const filterVideos = (videos,genre) => {
    return videos.filter((video)=>video.tags.includes(genre))
  }

  const unSeenVideos = (videos) => {
    return videos.filter((video)=> video.seen == false || video.seen == null)
  }

  return (
    <>
      <NavBar account={account}/>
      <div className="app">
          <div className="main-video">
              <img src={randomVideo(videos).thumbnail.url} alt={randomVideo(videos).title}/>
          </div>
          <div className="video-feed">
            <Link href="#disney"><div className="franchise" id="disney">
              <Image src={disneyLogo}/>
            </div>
            </Link>
            <Link href="#pixar"><div className="franchise" id="pixar">
              <Image src={pixarLogo}/>
            </div>
            </Link>
            <Link href="#star-wars"><div className="franchise" id="star-wars">
              <Image src={starWLogo}/>
            </div>
            </Link>
            <Link href="#national-geographic"><div className="franchise" id="national-geographic">
              <Image src={natgeoLogo}/>
            </div>
            </Link>
            <Link href="#marvel"><div className="franchise" id="marvel">
              <Image src={marvelLog}/>
            </div>
            </Link>
          </div>

            <Section genre={'Recommended for you'} videos={unSeenVideos(videos)}/>
            <Section genre={'Family'} videos={filterVideos(videos,'family')}/>
            <Section genre={'Classic'} videos={filterVideos(videos,'classic')}/>
            <Section genre={'Drama'} videos={filterVideos(videos,'drama')}/>
            <Section genre={'Thriller'} videos={filterVideos(videos,'thriller')}/>
            <Section id="disney" genre={'Disney'} videos={filterVideos(videos,'disney')}/>
            <Section id="marvel" genre={'Marvel'} videos={filterVideos(videos,'marvel')}/>
            <Section id="pixar" genre={'Pixar'} videos={filterVideos(videos,'pixar')}/>
            <Section id ="national-geographic" genre={'National Geographic'} videos={filterVideos(videos,'national-geographic')}/>
            <Section id= "star-wars" genre={'Star Wars'} videos={filterVideos(videos,'star-wars')}/>
      </div>
    </>
  )
}

export default Home