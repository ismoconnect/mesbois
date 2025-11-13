import React from 'react';
import styled from 'styled-components';
import DashboardLayout from '../components/Layout/DashboardLayout';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
  @media (max-width: 600px) { padding: 16px 12px; }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 20px;
  @media (max-width: 600px) { padding: 14px; }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #2c5530;
  margin: 0 0 16px 0;
  @media (max-width: 600px) { font-size: 20px; }
`;

const Section = styled.div`
  margin-bottom: 20px;
  @media (max-width: 600px) { margin-bottom: 14px; }
`;

const Settings = () => {
  return (
    <DashboardLayout>
      <Container>
        <Card>
          <Title>Réglages</Title>
          <Section>
            <p>Paramètres du compte et préférences à venir.</p>
          </Section>
        </Card>
      </Container>
    </DashboardLayout>
  );
};

export default Settings;
