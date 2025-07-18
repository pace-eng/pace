/**
 * 顶部导航栏组件
 * 
 * 这是一个Level 2任务的典型示例：
 * - 需要人机协作整合多个功能
 * - 复杂的交互逻辑
 * - 用户体验优化
 */

import React from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User, 
  Moon, 
  Sun,
  Plus,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

/**
 * 顶部导航栏组件
 * 
 * 功能特性：
 * - 侧边栏切换按钮
 * - 全局搜索框
 * - 通知中心
 * - 用户菜单
 * - 主题切换
 * - 快速操作按钮
 */
export function Header({ onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // 初始化主题
  React.useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(darkMode);
    updateTheme(darkMode);
  }, []);

  // 更新主题
  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', dark.toString());
  };

  // 切换主题
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    updateTheme(newDarkMode);
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    console.log('搜索:', query);
    // 这里可以实现全局搜索逻辑
  };

  // 处理快速新建任务
  const handleQuickAdd = () => {
    console.log('快速新建任务');
    // 这里可以打开快速新建任务的模态框
  };

  return (
    <header className=\"bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm\">
      <div className=\"flex items-center justify-between px-4 py-3 md:px-6\">
        {/* 左侧：侧边栏切换和搜索 */}
        <div className=\"flex items-center space-x-4 flex-1\">
          {/* 侧边栏切换按钮 */}
          <Button
            variant=\"ghost\"
            size=\"icon\"
            onClick={onToggleSidebar}
            className=\"lg:hidden\"
            aria-label=\"切换侧边栏\"
          >
            <Menu className=\"w-5 h-5\" />
          </Button>

          {/* 全局搜索框 */}
          <div className=\"hidden md:block flex-1 max-w-md\">
            <SearchInput
              placeholder=\"搜索任务、项目或标签...\"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              className=\"w-full\"
            />
          </div>
        </div>

        {/* 右侧：操作按钮和用户菜单 */}
        <div className=\"flex items-center space-x-2\">
          {/* 移动端搜索按钮 */}
          <Button
            variant=\"ghost\"
            size=\"icon\"
            className=\"md:hidden\"
            aria-label=\"搜索\"
          >
            <Search className=\"w-5 h-5\" />
          </Button>

          {/* 快速新建按钮 */}
          <Button
            onClick={handleQuickAdd}
            size=\"sm\"
            leftIcon={<Plus className=\"w-4 h-4\" />}
            className=\"hidden sm:flex\"
          >
            新建
          </Button>

          {/* 主题切换 */}
          <Button
            variant=\"ghost\"
            size=\"icon\"
            onClick={toggleTheme}
            aria-label={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
          >
            {isDarkMode ? (
              <Sun className=\"w-5 h-5\" />
            ) : (
              <Moon className=\"w-5 h-5\" />
            )}
          </Button>

          {/* 通知中心 */}
          <div className=\"relative\">
            <Button
              variant=\"ghost\"
              size=\"icon\"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label=\"通知\"
              className=\"relative\"
            >
              <Bell className=\"w-5 h-5\" />
              {/* 通知徽章 */}
              <span className=\"absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white\">
                3
              </span>
            </Button>

            {/* 通知下拉菜单 */}
            {showNotifications && (
              <NotificationDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* 用户菜单 */}
          <div className=\"relative\">
            <Button
              variant=\"ghost\"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className=\"flex items-center space-x-2 px-3\"
            >
              <div className=\"w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium\">
                U
              </div>
              <span className=\"hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200\">
                用户
              </span>
            </Button>

            {/* 用户下拉菜单 */}
            {showUserMenu && (
              <UserDropdown onClose={() => setShowUserMenu(false)} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * 通知下拉菜单组件
 */
interface NotificationDropdownProps {
  onClose: () => void;
}

function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const notifications = [
    {
      id: '1',
      title: '任务即将到期',
      message: '\"完成项目报告\" 将在 2 小时后到期',
      time: '5分钟前',
      unread: true,
    },
    {
      id: '2',
      title: '新的协作邀请',
      message: '张三邀请你加入 \"移动应用开发\" 项目',
      time: '1小时前',
      unread: true,
    },
    {
      id: '3',
      title: '任务已完成',
      message: '\"API接口设计\" 已被标记为完成',
      time: '3小时前',
      unread: false,
    },
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-notification-dropdown]')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      data-notification-dropdown
      className=\"absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50\"
    >
      {/* 头部 */}
      <div className=\"flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700\">
        <h3 className=\"text-lg font-semibold text-gray-900 dark:text-white\">
          通知
        </h3>
        <Button variant=\"ghost\" size=\"sm\">
          全部标记为已读
        </Button>
      </div>

      {/* 通知列表 */}
      <div className=\"max-h-96 overflow-y-auto\">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer',
              notification.unread && 'bg-blue-50 dark:bg-blue-900/10'
            )}
          >
            <div className=\"flex items-start space-x-3\">
              {notification.unread && (
                <div className=\"w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0\" />
              )}
              <div className=\"flex-1 min-w-0\">
                <h4 className=\"text-sm font-medium text-gray-900 dark:text-white truncate\">
                  {notification.title}
                </h4>
                <p className=\"text-sm text-gray-600 dark:text-gray-300 mt-1\">
                  {notification.message}
                </p>
                <p className=\"text-xs text-gray-500 dark:text-gray-400 mt-2\">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部 */}
      <div className=\"p-4 border-t border-gray-200 dark:border-gray-700\">
        <Button variant=\"ghost\" size=\"sm\" className=\"w-full\">
          查看全部通知
        </Button>
      </div>
    </div>
  );
}

/**
 * 用户下拉菜单组件
 */
interface UserDropdownProps {
  onClose: () => void;
}

function UserDropdown({ onClose }: UserDropdownProps) {
  const menuItems = [
    {
      icon: <User className=\"w-4 h-4\" />,
      label: '个人资料',
      action: () => console.log('个人资料'),
    },
    {
      icon: <Settings className=\"w-4 h-4\" />,
      label: '设置',
      action: () => console.log('设置'),
    },
    {
      icon: <HelpCircle className=\"w-4 h-4\" />,
      label: '帮助中心',
      action: () => console.log('帮助中心'),
    },
    {
      icon: <LogOut className=\"w-4 h-4\" />,
      label: '退出登录',
      action: () => console.log('退出登录'),
      danger: true,
    },
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-user-dropdown]')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      data-user-dropdown
      className=\"absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50\"
    >
      {/* 用户信息 */}
      <div className=\"p-4 border-b border-gray-200 dark:border-gray-700\">
        <div className=\"flex items-center space-x-3\">
          <div className=\"w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium\">
            U
          </div>
          <div>
            <p className=\"text-sm font-medium text-gray-900 dark:text-white\">
              用户名
            </p>
            <p className=\"text-xs text-gray-600 dark:text-gray-300\">
              user@example.com
            </p>
          </div>
        </div>
      </div>

      {/* 菜单项 */}
      <div className=\"py-2\">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.action();
              onClose();
            }}
            className={cn(
              'w-full flex items-center space-x-3 px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
              item.danger 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-700 dark:text-gray-200'
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}