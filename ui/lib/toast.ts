import { notification } from 'antd';

interface NotificationProps {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  description?: string | null;
}

const showNotification = ({ type, message, description = null }: NotificationProps): void => {
  notification[type]({
    message,
    description,
    placement: 'bottomRight',
  });
};

export default showNotification;
