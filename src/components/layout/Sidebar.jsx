import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Upload, 
  History, 
  Info, 
  Calendar, 
  User,
  LogOut,
  FolderOpen,
  MessageSquare,
  FileCheck,
  Award,
  Zap,
  Bell,
  FileText,
  Star,
  Clock
} from 'lucide-react';
import { users } from '../../data/mockData';
import styles from './Sidebar.module.css';
import { Badge } from 'react-bootstrap';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const user = users[role];

  // Define links based on role
  const getLinks = () => {
    switch(role) {
      case 'team':
        return [
          { name: 'Overview', path: '/team/dashboard', icon: LayoutDashboard },
          { name: 'My Team', path: '/team/my-team', icon: Users },
          { name: 'Team Members', path: '/team/members', icon: Users }, // Assuming this based on screenshot "Team Members" under "My Team"? Actually it's just "Team Members"
          { name: 'Submission Manage...', path: '/team/submissions', icon: Upload },
          { name: 'Submission History', path: '/team/history', icon: History },
          { name: 'Notice Board', path: '/team/notices', icon: Bell },
          { name: 'Deadlines & Schedule', path: '/team/schedule', icon: Calendar },
          { name: 'Profile', path: '/team/profile', icon: User },
        ];
      case 'mentor':
        return [
          { name: 'Overview', path: '/mentor/dashboard', icon: LayoutDashboard },
          { name: 'Assigned Categories', path: '/mentor/categories', icon: FolderOpen },
          { name: 'Assigned Teams', path: '/mentor/teams', icon: Users },
          { name: 'Submission Review', path: '/mentor/review', icon: FileCheck },
          { name: 'Notice Board', path: '/mentor/notices', icon: Bell },
          { name: 'Profile', path: '/mentor/profile', icon: User },
        ];
      case 'judge':
        return [
          { name: 'Overview', path: '/judge/dashboard', icon: LayoutDashboard },
          { name: 'Assigned Submissions', path: '/judge/submissions', icon: FileCheck },
          { name: 'Notice Board', path: '/judge/notices', icon: Info },
          { name: 'Profile', path: '/judge/profile', icon: User },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Zap size={20} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">SEAL Hackathon 2026</h5>
            <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>FPT University</small>
          </div>
        </div>
        
        <div className="mt-4 mb-2 px-3">
          <Badge bg={
            role === 'team' ? 'primary' : 
            role === 'mentor' ? 'purple' : 'success'
          } className={styles.roleBadge}>
            {user.role}
          </Badge>
        </div>
      </div>

      <nav className={styles.nav}>
        {links.map((link, index) => (
          <NavLink 
            key={index} 
            to={link.path} 
            className={({ isActive }) => 
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <link.icon className={styles.icon} size={18} />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>{user.initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
