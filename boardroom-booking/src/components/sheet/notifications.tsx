"use client"

import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Bell, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTitle } from '../ui/sheet';

interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsProps {
  notifications?: NotificationItem[];
  onMarkAsRead?: (id: string) => void;
  onClearNotification?: (id: string) => void;
}

const notificationTypes = {
  info: {
    icon: <Info className="h-5 w-5 text-cyan-500" />,
    borderColor: 'border-cyan-500',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    borderColor: 'border-yellow-500',
  },
  success: {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    borderColor: 'border-green-500',
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    borderColor: 'border-red-500',
  },
  default: {
    icon: <Bell className="h-5 w-5 text-gray-500" />,
    borderColor: 'border-gray-500',
  }
};

export default function Notifications({ 
  notifications = [], 
  onMarkAsRead,
  onClearNotification
}: NotificationsProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: 'info' | 'warning' | 'success' | 'error') => {
    return notificationTypes[type]?.icon || notificationTypes.default.icon;
  };

  const getNotificationBorderColor = (type: 'info' | 'warning' | 'success' | 'error') => {
    return notificationTypes[type]?.borderColor || notificationTypes.default.borderColor;
  };

  const markAsRead = (id: string) => {
    onMarkAsRead?.(id);
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        onMarkAsRead?.(notification.id);
      }
    });
  };

  const clearNotification = (id: string) => {
    onClearNotification?.(id);
  };

  return (
    <div>
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] bg-gray-50 p-0 flex flex-col">
          <div className="p-6 pb-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </SheetTitle>
              {unreadCount > 0 && (
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-sm text-cyan-600 hover:text-cyan-800"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                You have {unreadCount} unread message{unreadCount > 1 ? 's' : ''}.
              </p>
            )}
          </div>
          
          <div className="flex-grow overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold text-gray-800 mb-1">No new notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`relative rounded-lg p-4 pl-5 bg-white shadow-sm border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                      getNotificationBorderColor(notification.type)
                    } ${!notification.read ? 'bg-cyan-50/50' : 'bg-white'}`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    {!notification.read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                    )}
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm text-gray-800">{notification.title}</h4>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                        className="h-7 w-7 rounded-full shrink-0 -mt-1 -mr-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-sm shadow-cyan-200/60 transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:scale-105 cursor-pointer relative"
        aria-label="Notifications"
        onClick={() => setIsNotificationsOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}
