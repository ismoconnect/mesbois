import React from 'react';
import styled from 'styled-components';
import Footer from './Footer';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding-top: 60px;
  }
  
  @media (max-width: 480px) {
    padding-top: 55px;
  }
  
  @media (max-width: 375px) {
    padding-top: 50px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  background: #f8f9fa;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;

