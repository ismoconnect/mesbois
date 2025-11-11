import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrap = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 960px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #2c5530;
  margin: 0 0 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const Tile = styled(Link)`
  display: block;
  background: #f8f9fa;
  border: 1px solid #e6eae7;
  border-radius: 10px;
  padding: 16px;
  color: #2c5530;
  font-weight: 700;
  text-decoration: none;
  &:hover { background: #eef3ef; }
`;

const AdminDashboard = () => {
  return (
    <Wrap>
      <Card>
        <Title>Tableau de bord Admin</Title>
        <Grid>
          <Tile to="/images">Gérer les images</Tile>
        </Grid>
      </Card>
    </Wrap>
  );
};

export default AdminDashboard;
