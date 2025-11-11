import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Footer from './Footer';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  /* Desktop: offset for fixed TopBar + Header */
  @media (min-width: 769px) {
    padding-top: 122px;
  }
  
  @media (max-width: 768px) {
    padding-top: 60px;
  }
  
  @media (max-width: 480px) {
    padding-top: 55px;
  }
  
  @media (max-width: 375px) {
    padding-top: 50px;
  }

  /* When header is hidden, reduce the top padding so content sits closer to top */
  ${({ $noHeader }) => $noHeader && css`
    @media (min-width: 769px) {
      padding-top: 24px;
    }
    @media (max-width: 768px) {
      padding-top: 16px;
    }
    @media (max-width: 480px) {
      padding-top: 12px;
    }
    @media (max-width: 375px) {
      padding-top: 10px;
    }
  `}
`;

const MainContent = styled.main`
  flex: 1;
  background: #f8f9fa;
  padding-bottom: 56px;
  
  @media (max-width: 768px) {
    padding-bottom: 44px;
  }
  
  @media (max-width: 480px) {
    padding-bottom: 36px;
  }
`;

const Layout = ({ children, $noHeader }) => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

  return (
    <LayoutContainer $noHeader={$noHeader}>
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;

