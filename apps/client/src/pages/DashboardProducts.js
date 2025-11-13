import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Products from './Products';

const TopBar = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 12px;
  display: flex;
  justify-content: flex-end;
`;

const CartBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
  background: #f9fafb;
  color: #1f2d1f;
  text-decoration: none;
  font-weight: 600;
  &:hover { background: #f1f3f5; }
`;

const DashboardProducts = () => {
  return (
    <DashboardLayout>
      <TopBar>
        <CartBtn to="/dashboard/cart">
          <FiShoppingCart /> Aller au panier
        </CartBtn>
      </TopBar>
      <Products />
    </DashboardLayout>
  );
};

export default DashboardProducts;
