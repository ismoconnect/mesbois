import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiImage, FiUsers, FiShield, FiUpload, FiArrowRight } from 'react-icons/fi';

const Page = styled.div`
  display: grid;
  gap: 16px;
`;

const Heading = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 900;
  color: #2c5530;
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b7c6d;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 6px 16px rgba(44,85,48,0.08);
`;

const StatIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #fff;
  background: ${p => p.bg || '#2c5530'};
`;

const StatInfo = styled.div`
  display: grid;
  gap: 2px;
  h4 { margin: 0; color: #2c5530; font-size: 18px; font-weight: 900; }
  span { color: #6b7c6d; font-size: 12px; }
`;

const Panel = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(44,85,48,0.08);
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  h3 { margin: 0; color: #2c5530; font-size: 18px; font-weight: 800; }
  a { color: #2c5530; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
`;

const QuickLink = styled(Link)`
  border: 2px solid #e6eae7;
  border-radius: 12px;
  padding: 14px;
  text-decoration: none;
  color: #2c5530;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  &:hover { background: #f5faf6; }
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  li { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #e6eae7; }
  li:last-child { border-bottom: none; }
  .meta { color: #6b7c6d; font-size: 12px; }
`;

const AdminDashboard = () => {
  return (
    <Page>
      <Heading>
        <div>
          <Title>Tableau de bord</Title>
          <Subtitle>Vue d’ensemble de l’administration</Subtitle>
        </div>
      </Heading>

      <Stats>
        <StatCard>
          <StatIcon bg="#2c5530"><FiImage size={20} /></StatIcon>
          <StatInfo>
            <h4>Images</h4>
            <span>Paramètres Home</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#27ae60"><FiUsers size={20} /></StatIcon>
          <StatInfo>
            <h4>Utilisateurs</h4>
            <span>Accès clients</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#f39c12"><FiShield size={20} /></StatIcon>
          <StatInfo>
            <h4>Sécurité</h4>
            <span>Admins actifs</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#1e88e5"><FiUpload size={20} /></StatIcon>
          <StatInfo>
            <h4>Derniers builds</h4>
            <span>Déploiements</span>
          </StatInfo>
        </StatCard>
      </Stats>

      <Panel>
        <PanelHeader>
          <h3>Actions rapides</h3>
          <Link to="/images">Voir tout <FiArrowRight /></Link>
        </PanelHeader>
        <QuickGrid>
          <QuickLink to="/images"><FiImage /> Gérer les images de la Home</QuickLink>
          <QuickLink to="/dashboard"><FiShield /> Paramètres (bientôt)</QuickLink>
        </QuickGrid>
      </Panel>

      <Panel>
        <PanelHeader>
          <h3>Activité récente</h3>
          <a href="#" onClick={(e)=>e.preventDefault()}>Rafraîchir</a>
        </PanelHeader>
        <List>
          <li>
            <span>Mise à jour des images d’accueil</span>
            <span className="meta">il y a 1 j</span>
          </li>
          <li>
            <span>Nouveau déploiement</span>
            <span className="meta">il y a 2 j</span>
          </li>
          <li>
            <span>Connexion admin</span>
            <span className="meta">il y a 3 j</span>
          </li>
        </List>
      </Panel>
    </Page>
  );
};

export default AdminDashboard;
