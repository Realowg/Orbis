'use client';

import DeleteChat from '@/components/DeleteChat';
import { formatTimeDifference } from '@/lib/utils';
import { BookOpenText, ClockIcon, Delete, GalleryHorizontalEnd, GalleryVerticalEnd, Layers3, PlusCircle, PlusSquare, RefreshCw, ScanEye, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import TextArea from '@/components/TextArea';
import SelectInput from '@/components/SelectInput';
import showNotification from '@/lib/toast';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ className, ...restProps }: InputProps) => {
  return (
    <input
      {...restProps}
      className={cn(
        'bg-light-secondary dark:bg-dark-secondary px-3 py-2 flex items-center overflow-hidden border border-light-200 dark:border-dark-200 dark:text-white rounded-lg text-sm',
        className,
      )}
    />
  );
};

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  focusMode: string;
}

const Page = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [ error, setError ] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedOption, setSelectedOption] = useState('draft');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
  }, []);

  const submitHandle = async () => {
    setIsUpdating(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/article`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()),
        category,
        summary,
        status: selectedOption
      })
    });

    const data = await res.json();
    if (res.status === 200) {
      showNotification({
        type: 'success',
        message: data.message,
      });
      window.location.href = '/article';
    } else {
      setError(data.message)
      showNotification({
        type: 'warning',
        message: 'required fields',
      });
    }
    setIsUpdating(false)
  }

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
        <div className='flex flex-row items-center justify-between max-w-screen-lg lg:mx-auto'>
          <div className='flex flex-row items-center space-x-2'>
            <GalleryHorizontalEnd />
            <h2 className="text-black dark:text-white lg:text-3xl lg:font-medium">
              Add Article
            </h2>
          </div>
          <div>
            <Link href={'/article'} >
              <Undo2 
                className="cursor-pointer"
              />
            </Link>
          </div>
       </div>
      </div>
      
      <div className="flex flex-col pt-16 lg:pt-24">
        <div className="flex flex-col space-y-1">
          <p className="text-black/70 dark:text-white/70 text-sm">
            Title
          </p>
          <Input
            required={true}
            type="text"
            placeholder=""
            defaultValue={title}
            onChange={(e:any) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1 mt-5">
          <p className="text-black/70 dark:text-white/70 text-sm">
            Content
          </p>
          <TextArea
            rows={5}
            placeholder=""
            defaultValue={content}
            onChange={(e:any) => setContent(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1 mt-5">
          <p className="text-black/70 dark:text-white/70 text-sm">
            Tags
          </p>
          <Input
            type="text"
            placeholder="Technology, AI, Business"
            defaultValue={tags}
            onChange={(e:any) => setTags(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1 mt-5">
          <p className="text-black/70 dark:text-white/70 text-sm">
            Category
          </p>
          <Input
            type="text"
            placeholder=""
            defaultValue={category}
            onChange={(e:any) => setCategory(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1 mt-5">
          <p className="text-black/70 dark:text-white/70 text-sm">
            Status
          </p>
          <SelectInput
            name="select"
            value={selectedOption}
            onChange={handleSelectChange}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'archived', label: 'Archived' }
            ]}
          />
        </div>
        <div className="flex flex-col space-y-1 mt-5">
          <p className="text-black/70 dark:text-white/70 text-sm">
            Summary
          </p>
          <TextArea
            rows={5}
            placeholder=""
            defaultValue={summary}
            onChange={(e:any) => setSummary(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-1 mt-5">
          <button
            onClick={submitHandle}
            type='button'
            className="bg-[#24A0ED] flex flex-row items-center justify-center space-x-2 text-white disabled:text-white/50 hover:bg-opacity-85 transition duration-100 disabled:bg-[#ececec21] rounded-full px-4 py-2"
          >
            {isUpdating ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;