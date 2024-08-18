import showNotification from '@/lib/toast';
import { cn } from '@/lib/utils';
import { Dialog, Transition } from '@headlessui/react';
import { RefreshCcw, RefreshCw } from 'lucide-react';
import React, {
  Fragment,
  useEffect,
  useState,
  type SelectHTMLAttributes,
} from 'react';

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

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string; disabled?: boolean }[];
}

export const Select = ({ className, options, ...restProps }: SelectProps) => {
  return (
    <select
      {...restProps}
      className={cn(
        'bg-light-secondary dark:bg-dark-secondary px-3 py-2 flex items-center overflow-hidden border border-light-200 dark:border-dark-200 dark:text-white rounded-lg text-sm',
        className,
      )}
    >
      {options.map(({ label, value, disabled }) => {
        return (
          <option key={value} value={value} disabled={disabled}>
            {label}
          </option>
        );
      })}
    </select>
  );
};

const LoginDialog = ({
  isOpen,
  setIsOpen,
  isRegister,
  setIsRegisterOpen,
  isLogged,
  setIsLogged
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isRegister: boolean;
  setIsRegisterOpen: (isRegister: boolean) => void;
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
}) => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isUpdating, setIsUpdating ] = useState(false);
  const [ username, setUsername ] = useState();
  const [ password, setPassword ] = useState();
  const [ error, setError ] = useState('');

  useEffect(() => {
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsUpdating(true)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await res.json();
    if (res.status === 200) {
      document.cookie = `token=${data.token}; path=/; max-age=3600; Secure; HttpOnly`;
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', JSON.stringify(data.user.name));
      setError('')

      showNotification({
        type: 'success',
        message: data.message,
        // description: 'You have successfully logged in.',
      });
      
      setIsOpen(false)
      setIsLogged(true)
    } else {
      setError(data.message)
    }

    setIsUpdating(false)
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/50 dark:bg-black/50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-200"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-light-secondary dark:bg-dark-secondary border border-light-200 dark:border-dark-200 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-xl font-medium leading-6 dark:text-white">
                  Login
                </Dialog.Title>
                {!isLoading && (
                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Username
                      </p>
                      <Input
                        name='username'
                        type="text"
                        placeholder=""
                        defaultValue={username}
                        onChange={(e:any) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <p className="text-black/70 dark:text-white/70 text-sm">
                        Password
                      </p>
                      <Input
                        name='password'
                        type="password"
                        placeholder=""
                        defaultValue={password}
                        onChange={(e:any) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}
                {isLoading && (
                  <div className="w-full flex items-center justify-center mt-6 text-black/70 dark:text-white/70 py-6">
                    <RefreshCcw className="animate-spin" />
                  </div>
                )}
                <div className="w-full mt-6 space-y-2">
                  {error && (
                    <p className="text-xs" style={{ color: 'red' }}>{error}</p>  
                  )}
                  <p className="text-xs text-black/50 dark:text-white/50">
                    Don&apos;t have an account yet? you can <a href="#" className='text-white' onClick={() => {
                      setIsOpen(false)
                      setIsRegisterOpen(true)
                    }}>register here</a>.
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="bg-[#24A0ED] flex flex-row items-center space-x-2 text-white disabled:text-white/50 hover:bg-opacity-85 transition duration-100 disabled:bg-[#ececec21] rounded-full px-4 py-2"
                    disabled={isLoading || isUpdating}
                  >
                    {isUpdating ? (
                      <RefreshCw size={20} className="animate-spin" />
                    ) : (
                      <button type='button'>Submit</button>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginDialog;
