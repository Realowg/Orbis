// components/Card.js
import Image from 'next/image';

interface DiscoverCardInterface {
  title: string, 
  description: string, 
  imageUrl: string, 
  views: number, 
  likes: number,
  isFirst: boolean
}

const DiscoverCard = (props: DiscoverCardInterface) => {
  return (
    <div className={`bg-gray-800 text-white p-4 rounded-lg shadow-md `}>
      {props.isFirst ? (
        <>
          <div className="relative h-48 w-full mb-4">
            <Image src={props.imageUrl} alt={props.title} layout="fill" objectFit="cover" className="rounded-lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">{props.title}</h2>
            <p className="text-gray-400 mb-4">{props.description}</p>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>{props.views} views</span>
              <span>{props.likes} likes</span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex">
          <div className="relative h-24 w-24 mr-4">
            <Image src={props.imageUrl} alt={props.title} layout="fill" objectFit="cover" className="rounded-lg" />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">{props.title}</h2>
              <p className="text-gray-400 mb-4">{props.description}</p>
            </div>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>{props.views} views</span>
              <span>{props.likes} likes</span>
            </div>
          </div>
        </div>
      )}
      <hr className="border-gray-600 mt-4" />
    </div>
  );
};

export default DiscoverCard;
