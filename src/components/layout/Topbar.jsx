import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import styles from './Topbar.module.css';
import { Form, InputGroup } from 'react-bootstrap';

const Topbar = ({ role }) => {
  const location = useLocation();
  
  // Format role name for breadcrumb
  const roleName = role === 'team' ? 'Team Member' : role.charAt(0).toUpperCase() + role.slice(1);
  
  // Get page name from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  let pageNameRaw = pathParts[pathParts.length - 1] || 'Overview';
  
  if (pageNameRaw.toLowerCase() === 'dashboard') {
    pageNameRaw = 'Overview';
  }
  
  const pageName = pageNameRaw.charAt(0).toUpperCase() + pageNameRaw.slice(1).replace('-', ' ');

  return (
    <header className={styles.topbar}>
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbPage} style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--cf-text-primary)' }}>{pageName}</span>
      </div>

      <div className={styles.actions}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={16} />
          <Form.Control 
            type="text" 
            placeholder="Search..." 
            className={styles.searchInput} 
          />
        </div>
        
        <button className={styles.notificationBtn}>
          <Bell size={20} />
          <span className={styles.notificationDot}></span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
