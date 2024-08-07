'use client';

import DiscoverCard from '@/components/DiscoverCard';
import { Compass } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  focusMode: string;
}

const Page = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      setChats(data.chats);
      setLoading(false);
    };

    fetchChats();
  }, []);

  const cards = [
    {
      title: 'The history of Diwali',
      description: 'Diwali, also known as Deepavali, is a significant festival in Hinduism, Jainism, Sikhism, and Buddhism...',
      imageUrl: 'https://images.unsplash.com/photo-1722486110900-cfb036cf1830?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      views: 1136,
      likes: 114,
    },
    {
      title: 'What is tipflation?',
      description: 'Tipflation, also referred to as tip creep, describes the recent widespread expansion of tipping...',
      imageUrl: 'https://images.unsplash.com/photo-1722486110900-cfb036cf1830?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      views: 158,
      likes: 29,
    },
    {
      title: 'Why do we perceive smaller numbers better?',
      description: 'The human brain perceives smaller numbers better due to a combination...',
      imageUrl: 'https://images.unsplash.com/photo-1722486110900-cfb036cf1830?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      views: 128,
      likes: 20,
    },
    {
      title: 'Iceland volcano eruption',
      description: 'The town of Grindavik, located on the...',
      imageUrl: 'https://images.unsplash.com/photo-1722486110900-cfb036cf1830?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      views: 250,
      likes: 55,
    },
  ];

  return loading ? (
    <div className="flex flex-row items-center justify-center min-h-screen">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-light-200 fill-light-secondary dark:text-[#202020] animate-spin dark:fill-[#ffffff3b]"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100.003 78.2051 78.1951 100.003 50.5908 100C22.9765 99.9972 0.997224 78.018 1 50.4037C1.00281 22.7993 22.8108 0.997224 50.4251 1C78.0395 1.00281 100.018 22.8108 100 50.4251ZM9.08164 50.594C9.06312 73.3997 27.7909 92.1272 50.5966 92.1457C73.4023 92.1642 92.1298 73.4365 92.1483 50.6308C92.1669 27.8251 73.4392 9.0973 50.6335 9.07878C27.8278 9.06026 9.10003 27.787 9.08164 50.594Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4037 97.8624 35.9116 96.9801 33.5533C95.1945 28.8227 92.871 24.3692 90.0681 20.348C85.6237 14.1775 79.4473 9.36872 72.0454 6.45794C64.6435 3.54717 56.3134 2.65431 48.3133 3.89319C45.869 4.27179 44.3768 6.77534 45.014 9.20079C45.6512 11.6262 48.1343 13.0956 50.5786 12.717C56.5073 11.8281 62.5542 12.5399 68.0406 14.7911C73.527 17.0422 78.2187 20.7487 81.5841 25.4923C83.7976 28.5886 85.4467 32.059 86.4416 35.7474C87.1273 38.1189 89.5423 39.6781 91.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  ) : (
    <div>
      <div className="fixed z-40 top-0 left-0 right-0 lg:pl-[104px] lg:pr-6 lg:px-8 px-4 py-4 lg:py-6 border-b border-light-200 dark:border-dark-200">
        <div className="flex flex-row items-center space-x-2 max-w-screen-lg lg:mx-auto">
          <Compass />
          <h2 className="text-black dark:text-white lg:text-3xl lg:font-medium">
            Discover
          </h2>
        </div>
      </div>
      {chats.length === 0 && (
        <div className="flex flex-row items-center justify-center min-h-screen">
          <p className="text-black/70 dark:text-white/70 text-sm">
            No chats found.
          </p>
        </div>
      )}
      {chats.length > 0 && (
        <div className="flex flex-col pt-16 lg:pt-24 bg-gray-800">
          <div className="container mx-auto p-4">
          {cards.map((card, index) => (
            <DiscoverCard
              key={index}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              views={card.views}
              likes={card.likes}
              isFirst={index === 0 ? true : false}
            />
          ))}
        </div>
        </div>
      )}
    </div>
  );
};

export default Page;
