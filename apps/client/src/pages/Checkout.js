import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import styled from 'styled-components';
import { 
  FiTruck, 
  FiEye, 
  FiEyeOff, 
  FiCheck, 
  FiTag, 
  FiShield, 
  FiLock,
  FiCheckCircle, 
  FiArrowRight,
  FiX,
  FiEdit2,
  FiArrowLeft,
  FiUser,
  FiMail
} from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { createOrder } from '../firebase/orders';
import { createUser, signInUser, resetPassword, getUserData } from '../firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import toast from 'react-hot-toast';
import { getCouponByCode, validateAndComputeDiscount } from '../firebase/coupons';

/* ==========================================================================
   STYLED COMPONENTS
   ========================================================================== */

const PageContainer = styled.div`
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 16px 80px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px 12px 60px;
    overflow-x: hidden;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-bottom: 10px;
    text-align: left;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #142618;
  margin: 0 0 5px 0;
  letter-spacing: -0.4px;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 3px;
  }
`;

const Subtitle = styled.div`
  color: #55695a;
  font-size: 13.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: flex-start;
    font-size: 12px;
    gap: 5px;
    line-height: 1.35;
  }
`;

const LoginPromptButton = styled.button`
  background: none;
  border: none;
  color: #2c5530;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: inherit;

  &:hover {
    color: #1b381e;
  }
`;

/* ==========================================================================
   DEDICATED PRO LOGIN VIEW
   ========================================================================== */

const LoginViewContainer = styled.div`
  max-width: 440px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  animation: fadeIn 0.25s ease-out;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const BackToGuestBar = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

const BackToGuestLink = styled.button`
  background: none;
  border: none;
  color: #2c5530;
  font-size: 12.5px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.15s;

  &:hover {
    color: #142618;
    text-decoration: underline;
  }
`;

const CartBadgePill = styled.div`
  background: #f0f5f1;
  border: 1px solid #d2ded5;
  color: #254629;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const DedicatedLoginCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #dce6de;
  border-radius: 12px;
  padding: 22px 20px;
  box-shadow: 0 4px 16px rgba(20, 38, 24, 0.04);
  box-sizing: border-box;
  width: 100%;

  @media (max-width: 600px) {
    padding: 16px 14px;
    border-radius: 10px;
  }
`;

const LoginCardHeader = styled.div`
  text-align: center;
  margin-bottom: 14px;

  .icon-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #edf5ef;
    color: #2c5530;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 8px;
    box-shadow: 0 2px 6px rgba(44, 85, 48, 0.1);
  }

  h2 {
    font-size: 17px;
    font-weight: 800;
    color: #142618;
    margin: 0 0 3px 0;
    letter-spacing: -0.3px;
  }

  p {
    font-size: 12px;
    color: #55695a;
    margin: 0;
    line-height: 1.35;
  }
`;

const LoginInputGroup = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3px;

    label {
      font-size: 12px;
      font-weight: 700;
      color: #273e2d;
      margin: 0;
    }

    button.forgot-btn {
      background: none;
      border: none;
      color: #2c5530;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;

      &:hover {
        color: #142618;
      }
    }
  }

  .input-with-icon {
    position: relative;
    display: flex;
    align-items: center;

    .field-icon {
      position: absolute;
      left: 10px;
      color: #6d8573;
      pointer-events: none;
      display: flex;
      align-items: center;
      z-index: 1;
    }

    input {
      height: 38px;
      font-size: 13px;
      padding-left: 34px;
      padding-right: ${props => (props.$hasPasswordToggle ? '38px' : '10px')};
      border-radius: 7px;
    }

    .eye-btn {
      position: absolute;
      right: 6px;
      background: none;
      border: none;
      color: #6d8573;
      cursor: pointer;
      padding: 4px 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      z-index: 1;

      &:hover {
        color: #142618;
      }
    }
  }
`;

const LoginSubmitButton = styled.button`
  width: 100%;
  height: 40px;
  background: #2c5530;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  margin-top: 4px;
  box-shadow: 0 3px 10px rgba(44, 85, 48, 0.2);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #1e3d22;
  }

  &:disabled {
    background: #9ab49f;
    cursor: not-allowed;
  }
`;

const LoginDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 0 10px;
  text-align: center;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #dce4de;
  }

  span {
    padding: 0 10px;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #839788;
  }
`;

const GuestActionButton = styled.button`
  width: 100%;
  padding: 10px 12px;
  background: #f7faf7;
  border: 1.5px solid #cfe0d3;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: all 0.2s ease;
  text-align: left;
  box-sizing: border-box;

  .btn-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    .main {
      font-size: 13px;
      font-weight: 700;
      color: #1e3d22;
      white-space: nowrap;
    }

    .sub {
      font-size: 11px;
      color: #5c7462;
      white-space: nowrap;
    }
  }

  svg {
    color: #2c5530;
    flex-shrink: 0;
  }

  &:hover {
    background: #edf5ef;
    border-color: #2c5530;
  }
`;

const LoginSecurityNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #edf2ee;
  color: #667c6c;
  font-size: 11px;
  flex-wrap: wrap;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

/* Stepper Mobile Uniquement (2 Étapes) */
const MobileStepper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border: 1px solid #e1ebe3;
    border-radius: 9px;
    padding: 7px 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    width: 100%;
    box-sizing: border-box;
  }
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  opacity: ${props => (props.$active || props.$done ? 1 : 0.45)};
  transition: opacity 0.2s;
  flex-shrink: 0;

  .step-num {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => (props.$done ? '#27ae60' : props.$active ? '#2c5530' : '#e2e8e4')};
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .step-label {
    font-size: 12px;
    font-weight: 700;
    color: ${props => (props.$active ? '#142618' : '#55695a')};
    white-space: nowrap;
  }
`;

const StepDivider = styled.div`
  flex: 1;
  min-width: 8px;
  height: 2px;
  background: ${props => (props.$done ? '#27ae60' : '#e2e8e4')};
  margin: 0 8px;
`;

/* Layout 2 Colonnes Desktop */
const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 28px;
  align-items: start;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 360px;
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 14px;
    max-width: 100%;
  }
`;

/* Wrappers conditionnels Mobile vs Desktop */
const Step1Wrapper = styled.div`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    display: ${props => (props.$active ? 'block' : 'none')};
    max-width: 100%;
  }
`;

const Step2Wrapper = styled.div`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    display: ${props => (props.$active ? 'block' : 'none')};
    max-width: 100%;
  }
`;

const DesktopSummaryWrapper = styled.div`
  position: sticky;
  top: 80px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileSummaryWrapper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-top: 14px;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e8eee9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 12px 10px;
    border-radius: 9px;
    max-width: 100%;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #edf2ee;

  .left-head {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h2 {
    font-size: 15px;
    font-weight: 700;
    color: #1e3d22;
    margin: 0;

    @media (max-width: 600px) {
      font-size: 13.5px;
    }
  }

  .step-badge {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2c5530;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

/* Chip de récapitulatif adresse pour l'étape 2 sur mobile */
const DeliveryRecapChip = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f4f8f5;
    border: 1px solid #cfe0d3;
    border-radius: 8px;
    padding: 8px 10px;
    margin-bottom: 10px;
    font-size: 12px;
    width: 100%;
    box-sizing: border-box;
    gap: 8px;

    .info {
      color: #1e3d22;
      line-height: 1.35;
      flex: 1;
      min-width: 0;
      word-break: break-word;
      strong { color: #142618; font-weight: 700; }
    }

    button {
      background: #ffffff;
      border: 1px solid #cfe0d3;
      color: #2c5530;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 3px;
      cursor: pointer;
      padding: 4px 7px;
      border-radius: 5px;
      flex-shrink: 0;
      font-size: 11px;
      white-space: nowrap;
      &:hover { background: #e3ede5; }
    }
  }
`;

/* Carte adresse enregistrée intelligente */
const SavedAddressCard = styled.div`
  background: #f7faf7;
  border: 1.5px solid #cfe0d3;
  border-radius: 9px;
  padding: 12px 14px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .saved-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      font-weight: 700;
      color: #2c5530;
    }

    button.edit-btn {
      background: #ffffff;
      border: 1px solid #cfe0d3;
      color: #2c5530;
      font-size: 11.5px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 5px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;

      &:hover {
        background: #eaf3ec;
      }
    }
  }

  .saved-info {
    font-size: 12.5px;
    line-height: 1.4;
    color: #3b5240;

    .name {
      font-weight: 800;
      color: #142618;
      font-size: 13.5px;
      margin-bottom: 2px;
    }

    .address-line {
      color: #1b381e;
    }

    .city-line {
      color: #2f4a34;
    }

    .contact-line {
      font-size: 11.5px;
      color: #55695a;
      margin-top: 3px;
    }
  }
`;

/* Formulaire Compact & Intelligent */
const FormGroup = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$cols || '1fr'};
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    grid-template-columns: ${props => props.$mobileCols || '1fr'};
    gap: 8px;
    margin-bottom: 8px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  label {
    font-size: 12px;
    font-weight: 600;
    color: #3b5240;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    gap: 4px;

    @media (max-width: 600px) {
      font-size: 11.5px;
      margin-bottom: 2px;
    }

    span.req {
      color: #dc2626;
      font-weight: 700;
      font-size: 12px;
      line-height: 1;
    }

    span.opt {
      color: #88998c;
      font-weight: 400;
      margin-left: auto;
      font-size: 10.5px;
    }
  }
`;

const CountryInputWrapper = styled(InputWrapper)`
  @media (max-width: 600px) {
    grid-column: 1 / -1;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  border: 1.5px solid #d2ddd4;
  border-radius: 8px;
  font-size: 13.5px;
  color: #142618;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #2c5530;
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.12);
  }

  &::placeholder {
    color: #a4b3a7;
    font-size: 13px;
  }

  @media (max-width: 600px) {
    font-size: 13px;
    height: 38px;
    padding: 6px 10px;
    border-radius: 7px;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  border: 1.5px solid #d2ddd4;
  border-radius: 8px;
  font-size: 13.5px;
  color: #142618;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #2c5530;
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.12);
  }

  @media (max-width: 600px) {
    font-size: 13px;
    height: 38px;
    padding: 6px 10px;
    border-radius: 7px;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid #d2ddd4;
  border-radius: 7px;
  font-size: 13px;
  color: #142618;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
  min-height: 48px;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #2c5530;
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.12);
  }

  &::placeholder {
    color: #a4b3a7;
    font-size: 12.5px;
  }
`;

/* Bloc Virement Bancaire Unique */
const PaymentBox = styled.div`
  border: 1.5px solid #2c5530;
  background: #f4f8f5;
  border-radius: 9px;
  padding: 14px;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 600px) {
    padding: 10px;
  }
`;

const PaymentBoxHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  flex-wrap: wrap;
  gap: 6px;
`;

const PaymentOptionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
  font-size: 13.5px;
  color: #142618;
  flex-shrink: 0;

  .radio-check {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #2c5530;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 10px;
    flex-shrink: 0;
  }
`;

const SecurityBadge = styled.span`
  background: #dcfce7;
  color: #166534;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  white-space: nowrap;
`;

const PaymentDetails = styled.div`
  font-size: 12px;
  line-height: 1.45;
  color: #3b5240;
  background: #ffffff;
  border: 1px solid #d9e4db;
  border-radius: 7px;
  padding: 8px 10px;
  margin-top: 6px;
  word-break: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;

  p {
    margin: 0 0 4px 0;
    &:last-child { margin-bottom: 0; }
  }

  strong {
    color: #142618;
  }
`;

/* Right Column: Order Summary (Sticky) */
const SummaryCard = styled(Card)`
  padding: 20px;
  border: 1px solid #d4dfd6;
  background: #fafcfa;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 600px) {
    padding: 14px 12px;
  }
`;

const SummaryTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #142618;
  margin: 0 0 14px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e1ebe3;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemList = styled.div`
  max-height: 220px;
  overflow-y: auto;
  margin-bottom: 14px;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd8ce;
    border-radius: 4px;
  }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px dashed #e8efe9;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemThumb = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #d4dfd6;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .qty-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #2c5530;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #fff;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-size: 13px;
    font-weight: 600;
    color: #142618;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta {
    font-size: 11px;
    color: #667c6c;
  }
`;

const ItemPrice = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #142618;
  white-space: nowrap;
`;

/* Coupon Section */
const CouponBox = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
`;

const CouponInput = styled.input`
  flex: 1;
  height: 38px;
  padding: 0 10px;
  border: 1.5px solid #d2ddd4;
  border-radius: 6px;
  font-size: 13px;
  text-transform: uppercase;
  outline: none;

  &:focus {
    border-color: #2c5530;
  }
`;

const CouponButton = styled.button`
  height: 38px;
  padding: 0 14px;
  background: #2c5530;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #1e3d22;
  }

  &:disabled {
    background: #a8b8ac;
    cursor: not-allowed;
  }
`;

const AppliedCouponBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
  color: #1b5e20;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 14px;

  button {
    background: none;
    border: none;
    color: #c62828;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    display: flex;
    align-items: center;
  }
`;

/* Calculations */
const LineRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #4f6655;
  margin-bottom: 7px;

  &.discount {
    color: #166534;
    font-weight: 600;
  }

  &.total {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 2px solid #dce5de;
    font-size: 18px;
    font-weight: 800;
    color: #142618;
  }
`;

/* Checkbox Conditions */
const TermsWrapper = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 11.5px;
  color: #4b5e50;
  line-height: 1.4;
  margin: 12px 0;
  cursor: pointer;
  word-break: break-word;

  input[type="checkbox"] {
    margin-top: 2px;
    accent-color: #2c5530;
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }

  a {
    color: #2c5530;
    text-decoration: underline;
    font-weight: 600;
  }
`;

/* Boutons d'action */
const SubmitButton = styled.button`
  width: 100%;
  height: 46px;
  background: #27ae60;
  color: #ffffff;
  border: none;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(39, 174, 96, 0.28);
  transition: all 0.2s ease;
  box-sizing: border-box;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #219653;
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(39, 174, 96, 0.35);
  }

  &:disabled {
    background: #a3c4ae;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  @media (max-width: 600px) {
    height: 42px;
    font-size: 13px;
    padding: 0 8px;
  }

  @media (max-width: 380px) {
    font-size: 12px;
    height: 40px;
    gap: 4px;
  }
`;

const NextStepButton = styled.button`
  width: 100%;
  height: 42px;
  background: #2c5530;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 3px 10px rgba(44, 85, 48, 0.2);
  transition: all 0.2s ease;
  box-sizing: border-box;
  white-space: nowrap;

  &:hover {
    background: #1b381e;
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    height: 40px;
    font-size: 13px;
    padding: 0 8px;
  }

  @media (max-width: 380px) {
    font-size: 12px;
    height: 38px;
    gap: 4px;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const BackStepButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: none;
    border: none;
    color: #55695a;
    font-size: 13px;
    font-weight: 600;
    margin-top: 14px;
    width: 100%;
    cursor: pointer;
    padding: 6px;

    &:hover {
      color: #142618;
      text-decoration: underline;
    }
  }
`;

/* Reassurance Badges */
const TrustList = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #edf2ee;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #4a6150;

  svg {
    color: #2c5530;
    flex-shrink: 0;
  }
`;

// Helper d'extraction des prénom & nom
const parseCustomerNames = (data, authUser) => {
  let first = (data?.firstName || '').trim();
  let last = (data?.lastName || '').trim();
  if (!first && !last) {
    const full = (data?.displayName || authUser?.displayName || '').trim();
    if (full) {
      const parts = full.split(/\s+/);
      first = parts[0] || '';
      last = parts.slice(1).join(' ') || '';
    }
  }
  return { firstName: first, lastName: last };
};

const Checkout = () => {
  const { t } = useTranslation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, userData } = useAuth();
  const localizedNavigate = useLocalizedNavigate();

  // Étape courante sur mobile (1: Livraison, 2: Paiement & Validation)
  const [mobileStep, setMobileStep] = useState(1);

  // Formulaire d'expédition & facturation
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    postalCode: '',
    city: '',
    country: 'France',
    notes: '',
    paymentMethod: 'bank' // STRICTEMENT Virement Bancaire
  });

  // Gestion connexion client & mot de passe
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginFields, setLoginFields] = useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Mode modification d'adresse pour utilisateur déjà connecté
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Accordéon instructions spécifiques chauffeur
  const [showNotes, setShowNotes] = useState(false);

  // Création de compte facultative pour invité
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Coupon promo
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Conditions & validation
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-remplissage si utilisateur connecté
  useEffect(() => {
    if (user) {
      const { firstName: fName, lastName: lName } = parseCustomerNames(userData, user);
      setFormData(prev => ({
        ...prev,
        firstName: fName || prev.firstName || '',
        lastName: lName || prev.lastName || '',
        email: user.email || prev.email || '',
        phone: userData?.phone || prev.phone || '',
        address: userData?.address || prev.address || '',
        address2: userData?.address2 || prev.address2 || '',
        postalCode: userData?.postalCode || prev.postalCode || '',
        city: userData?.city || prev.city || '',
        country: userData?.country || prev.country || 'France'
      }));
    }
  }, [user, userData]);

  // Recalcul de remise coupon si sous-total change
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = Math.max(0, subtotal - discount) + shipping;
  const totalItemsCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

  useEffect(() => {
    if (!appliedCoupon) return;
    const { valid, discount: d } = validateAndComputeDiscount(appliedCoupon, subtotal);
    setDiscount(valid ? Number(d.toFixed(2)) : 0);
  }, [subtotal, appliedCoupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Passer à l'étape 2 sur mobile
  const handleProceedToPayment = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      return toast.error('Veuillez renseigner vos prénom et nom.');
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return toast.error('Veuillez renseigner une adresse email valide.');
    }
    if (!formData.phone.trim()) {
      return toast.error('Veuillez renseigner votre numéro de téléphone.');
    }
    if (!formData.address.trim()) {
      return toast.error('Veuillez renseigner votre adresse de livraison complète.');
    }
    if (!formData.postalCode.trim() || !formData.city.trim()) {
      return toast.error('Veuillez renseigner votre code postal et ville.');
    }

    setMobileStep(2);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Connexion rapide client
  const handleQuickLogin = async (e) => {
    e.preventDefault();
    if (!loginFields.email || !loginFields.password) {
      toast.error('Veuillez renseigner votre email et mot de passe');
      return;
    }
    try {
      setLoginLoading(true);
      const res = await signInUser(loginFields.email, loginFields.password);
      if (!res.success) {
        toast.error(res.error || 'Identifiants incorrects');
        setLoginLoading(false);
        return;
      }

      // 1. Récupérer immédiatement le profil Firestore
      const userDoc = await getUserData(res.user.uid);
      const data = userDoc.success ? userDoc.data : null;

      const { firstName: fName, lastName: lName } = parseCustomerNames(data, res.user);

      const updatedCustomerInfo = {
        firstName: fName,
        lastName: lName,
        email: res.user.email || loginFields.email,
        phone: data?.phone || '',
        address: data?.address || '',
        address2: data?.address2 || '',
        postalCode: data?.postalCode || '',
        city: data?.city || '',
        country: data?.country || 'France'
      };

      // 2. Définir l'étape cible AVANT de fermer la vue pour éviter tout flash d'étape
      const hasSavedAddress = Boolean(updatedCustomerInfo.address && (updatedCustomerInfo.city || updatedCustomerInfo.postalCode));
      if (hasSavedAddress) {
        setMobileStep(2);
      } else {
        setMobileStep(1);
      }

      // 3. Charger les données dans le formulaire
      setFormData(prev => ({ ...prev, ...updatedCustomerInfo }));

      // 4. Fermer la vue de connexion EN DERNIER (garantit 0 flash de l'étape 1)
      setIsLoginOpen(false);
      setLoginLoading(false);

      if (hasSavedAddress) {
        toast.success(`Ravi de vous revoir ${fName ? fName : ''} ! Vos coordonnées sont prêtes.`);
      } else {
        toast.success('Connexion réussie ! Veuillez vérifier votre adresse de livraison.');
      }
    } catch {
      toast.error('Erreur lors de la connexion');
      setLoginLoading(false);
    }
  };

  // Réinitialisation mot de passe
  const handleForgotPassword = async () => {
    const emailToReset = (loginFields.email || '').trim();
    if (!emailToReset || !emailToReset.includes('@')) {
      toast.error(t('checkout.forgot_password_invalid_email', 'Veuillez renseigner une adresse email valide ci-dessus pour réinitialiser votre mot de passe.'));
      return;
    }
    try {
      const res = await resetPassword(emailToReset);
      if (res.success) {
        toast.success(t('checkout.forgot_password_success', 'Un email de réinitialisation a été envoyé. Vérifiez vos courriers indésirables.'));
      } else {
        toast.error(res.error || t('checkout.forgot_password_error', 'Erreur lors de l\'envoi du lien de réinitialisation'));
      }
    } catch {
      toast.error(t('checkout.forgot_password_failed', 'Impossible d\'envoyer l\'email de réinitialisation.'));
    }
  };

  // Application code promo
  const handleApplyCoupon = async () => {
    const raw = (couponCode || '').trim();
    if (!raw) return toast.error('Veuillez saisir un code promo');
    try {
      setApplyingCoupon(true);
      const res = await getCouponByCode(raw);
      if (!res.success || !res.data) {
        setAppliedCoupon(null);
        setDiscount(0);
        return toast.error(res.error || 'Code promo invalide');
      }
      const coupon = res.data;
      const { valid, discount: d, reason } = validateAndComputeDiscount(coupon, subtotal);
      if (!valid) {
        setAppliedCoupon(null);
        setDiscount(0);
        return toast.error(reason || 'Code promo non applicable');
      }
      setAppliedCoupon(coupon);
      setDiscount(Number(d.toFixed(2)));
      toast.success(`Code promo "${coupon.code}" appliqué avec succès ! (-${d.toFixed(2)}€)`);
    } catch {
      toast.error('Impossible d’appliquer ce code promo');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    toast.success('Code promo retiré');
  };

  // Validation finale & Enregistrement de commande
  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!acceptTerms) {
      return toast.error('Veuillez accepter les conditions générales de vente pour continuer.');
    }

    // Validation des champs essentiels
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setMobileStep(1);
      return toast.error('Veuillez renseigner vos prénom et nom.');
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setMobileStep(1);
      return toast.error('Veuillez renseigner une adresse email valide.');
    }
    if (!formData.address.trim()) {
      setMobileStep(1);
      return toast.error('Veuillez renseigner votre adresse de livraison complète.');
    }
    if (!formData.postalCode.trim() || !formData.city.trim()) {
      setMobileStep(1);
      return toast.error('Veuillez renseigner votre code postal et ville.');
    }

    setIsSubmitting(true);

    try {
      let currentUser = user;
      const wasGuest = !user;

      // Si invité a choisi de créer un compte facultatif
      if (!currentUser && createAccount) {
        if (!password || password.length < 6) {
          setIsSubmitting(false);
          setMobileStep(1);
          return toast.error('Le mot de passe doit comporter au moins 6 caractères.');
        }
        const displayName = `${formData.firstName} ${formData.lastName}`.trim();
        const regRes = await createUser(formData.email, password, {
          displayName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        });
        if (regRes.success) {
          currentUser = regRes.user;
          try { await sendEmailVerification(currentUser); } catch { }
        }
      }

      const orderData = {
        userId: currentUser ? currentUser.uid : `guest_${Date.now()}`,
        items: cartItems,
        customerInfo: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          address2: (formData.address2 || '').trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country || 'France'
        },
        delivery: {
          method: 'standard',
          label: 'Livraison soignée avec chariot tout-terrain',
          cost: shipping
        },
        payment: {
          method: 'bank',
          label: 'Virement bancaire (SEPA)'
        },
        notes: (formData.notes || '').trim(),
        subtotal: subtotal,
        discount: discount,
        total: total,
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discount: discount
        } : null,
        isGuest: wasGuest && !createAccount
      };

      const result = await createOrder(orderData);

      if (result.success) {
        // Envoi asynchrone du mail de confirmation
        try {
          const emailPayload = {
            orderId: result.id,
            total: orderData.total,
            items: orderData.items.map(it => ({
              name: it.name,
              quantity: it.quantity,
              price: it.price
            })),
            customer: orderData.customerInfo,
            newUser: wasGuest && createAccount
          };
          fetch('/api/order-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailPayload),
            keepalive: true
          }).catch(() => { });
        } catch { }

        // Vider le panier et rediriger vers la page de virement bancaire avec coordonnées
        clearCart();
        localizedNavigate('bankTransfer', '', `?orderId=${result.id}`, {
          state: {
            orderId: result.id,
            orderData: orderData,
            wasGuest: wasGuest && !createAccount
          }
        });
      } else {
        toast.error(result.error || 'Erreur lors de la validation de la commande');
      }
    } catch {
      toast.error('Une erreur inattendue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si panier vide
  if (cartItems.length === 0) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>{t('checkout.empty_cart_title', 'Votre panier est vide')}</Title>
          <Subtitle>Ajoutez des produits de qualité à votre panier pour finaliser votre commande.</Subtitle>
          <div style={{ marginTop: 24 }}>
            <button
              type="button"
              onClick={() => localizedNavigate('products')}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: 'none',
                background: '#2c5530',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer'
              }}
            >
              Découvrir nos bois & granulés
            </button>
          </div>
        </PageHeader>
      </PageContainer>
    );
  }

  // Écran dédié de connexion (reste actif tant que isLoginOpen est vrai pour éliminer tout flash d'étape)
  if (isLoginOpen) {
    return (
      <PageContainer>
        <LoginViewContainer>
          <BackToGuestBar>
            <BackToGuestLink type="button" onClick={() => setIsLoginOpen(false)}>
              <FiArrowLeft size={15} />
              <span>Retour à la commande</span>
            </BackToGuestLink>
            <CartBadgePill>
              Panier : <strong>{total.toFixed(2)} €</strong> ({totalItemsCount} art.)
            </CartBadgePill>
          </BackToGuestBar>

          <PageHeader style={{ marginBottom: 10, textAlign: 'center' }}>
            <Title style={{ fontSize: 18 }}>Connexion client</Title>
            <Subtitle style={{ justifyContent: 'center', fontSize: 12 }}>
              <span>Retrouvez vos adresses et vos informations en toute sécurité.</span>
            </Subtitle>
          </PageHeader>

          <DedicatedLoginCard>
            <LoginCardHeader>
              <div className="icon-circle">
                <FiUser size={24} />
              </div>
              <h2>Identifiez-vous</h2>
              <p>Saisissez vos identifiants pour accéder à votre compte client.</p>
            </LoginCardHeader>

            <form onSubmit={handleQuickLogin}>
              <LoginInputGroup>
                <div className="label-row">
                  <label htmlFor="login-email">{t('checkout.email', 'Adresse email')}</label>
                </div>
                <div className="input-with-icon">
                  <span className="field-icon">
                    <FiMail size={16} />
                  </span>
                  <StyledInput
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="jean.dupont@email.com"
                    value={loginFields.email}
                    onChange={(e) => setLoginFields(prev => ({ ...prev, email: e.target.value }))}
                    required
                    autoFocus
                  />
                </div>
              </LoginInputGroup>

              <LoginInputGroup $hasPasswordToggle>
                <div className="label-row">
                  <label htmlFor="login-password">Mot de passe</label>
                  <button
                    type="button"
                    className="forgot-btn"
                    onClick={handleForgotPassword}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="input-with-icon">
                  <span className="field-icon">
                    <FiLock size={16} />
                  </span>
                  <StyledInput
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    value={loginFields.password}
                    onChange={(e) => setLoginFields(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    title={showLoginPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showLoginPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </LoginInputGroup>

              <LoginSubmitButton type="submit" disabled={loginLoading}>
                {loginLoading ? (
                  'Connexion en cours...'
                ) : (
                  <>
                    <span>Se connecter et continuer</span>
                    <FiArrowRight size={15} />
                  </>
                )}
              </LoginSubmitButton>
            </form>

            <LoginDivider>
              <span>ou</span>
            </LoginDivider>

            <GuestActionButton type="button" onClick={() => setIsLoginOpen(false)}>
              <div className="btn-text">
                <span className="main">Commander sans compte</span>
                <span className="sub">Achat direct rapide sans mot de passe</span>
              </div>
              <FiArrowRight size={15} />
            </GuestActionButton>

            <LoginSecurityNote>
              <span>
                <FiShield size={13} color="#27ae60" /> Connexion sécurisée SSL
              </span>
              <span>
                <FiLock size={13} color="#2c5530" /> Données protégées
              </span>
            </LoginSecurityNote>
          </DedicatedLoginCard>
        </LoginViewContainer>
      </PageContainer>
    );
  }

  // Bloc réutilisable pour le récapitulatif de commande (utilisé sur desktop sticky & mobile étape 2)
  const renderOrderSummaryContent = () => (
    <SummaryCard>
      <SummaryTitle>
        <span>{t('checkout.summary_title', 'Récapitulatif de la commande')}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#4a6150' }}>{totalItemsCount} {totalItemsCount > 1 ? t('checkout.items', 'articles') : t('checkout.item', 'article')}</span>
      </SummaryTitle>

      {/* Liste des articles */}
      <ItemList>
        {cartItems.map((item) => (
          <ItemRow key={item.id}>
            <ItemThumb>
              <img src={item.image || 'https://picsum.photos/seed/wood/100/100'} alt={item.name} />
              <span className="qty-badge">{item.quantity}</span>
            </ItemThumb>
            <ItemDetails>
              <div className="name" title={item.name}>{item.name}</div>
              <div className="meta">Qté : {item.quantity} × {Number(item.price || 0).toFixed(2)} €</div>
            </ItemDetails>
            <ItemPrice>{(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)} €</ItemPrice>
          </ItemRow>
        ))}
      </ItemList>

      {/* Code promo compact */}
      {appliedCoupon ? (
        <AppliedCouponBadge>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiTag size={14} />
            Code <strong>{appliedCoupon.code}</strong> (-{discount.toFixed(2)} €)
          </span>
          <button type="button" onClick={handleRemoveCoupon} title="Supprimer le code">
            <FiX />
          </button>
        </AppliedCouponBadge>
      ) : (
        <CouponBox>
          <CouponInput
            type="text"
            placeholder="Code promo"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <CouponButton 
            type="button" 
            onClick={handleApplyCoupon}
            disabled={applyingCoupon || !couponCode.trim()}
          >
            {applyingCoupon ? '...' : 'Appliquer'}
          </CouponButton>
        </CouponBox>
      )}

      {/* Lignes de décompte */}
      <LineRow>
        <span>{t('checkout.subtotal_items', 'Sous-total articles')}</span>
        <span>{subtotal.toFixed(2)} €</span>
      </LineRow>

      <LineRow>
        <span>{t('checkout.delivery_offroad', 'Livraison tout-terrain sous abri')}</span>
        <span>
          {shipping === 0 ? (
            <strong style={{ color: '#27ae60' }}>{t('checkout.free', 'Offerte')}</strong>
          ) : (
            `${shipping.toFixed(2)} €`
          )}
        </span>
      </LineRow>

      {discount > 0 && (
        <LineRow className="discount">
          <span>{t('checkout.discount', 'Remise coupon')}</span>
          <span>-{discount.toFixed(2)} €</span>
        </LineRow>
      )}

      <LineRow className="total">
        <span>{t('checkout.total_tax', 'Total TTC')}</span>
        <span>{total.toFixed(2)} €</span>
      </LineRow>

      {/* Conditions Générales */}
      <TermsWrapper>
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          required
        />
        <span>
          {t('checkout.accept', 'J\'accepte les ')}<Link to="/terms" target="_blank">{t('checkout.terms', 'Conditions Générales de Vente')}</Link>{t('checkout.and', ' et la ')}<Link to="/privacy" target="_blank">{t('checkout.privacy', 'Politique de Confidentialité')}</Link>. <span style={{ color: '#dc2626' }}>*</span>
        </span>
      </TermsWrapper>

      {/* Bouton de confirmation principal */}
      <SubmitButton
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>Validation en cours...</>
        ) : (
          <>
            <span>{t('checkout.confirm_order', 'Confirmer la commande (')}{total.toFixed(2)}&nbsp;€)</span>
            <FiArrowRight size={15} />
          </>
        )}
      </SubmitButton>

      {/* Bouton retour étape 1 sur mobile */}
      <BackStepButton type="button" onClick={() => setMobileStep(1)}>
        <FiArrowLeft size={14} />
        <span>Modifier mes coordonnées & adresse</span>
      </BackStepButton>

      {/* Badges de réassurance */}
      <TrustList>
        <TrustItem>
          <FiTruck size={15} />
          <span>{t('checkout.delivery_desc', 'Livraison directe sous abri par camion avec chariot')}</span>
        </TrustItem>
        <TrustItem>
          <FiShield size={15} />
          <span>{t('checkout.bank_secure', 'Virement bancaire sécurisé sans transmission de données bancaires')}</span>
        </TrustItem>
        <TrustItem>
          <FiCheckCircle size={15} />
          <span>{t("checkout.wood_certified", "Bois 100% fendu prêt à l'emploi & granulés certifiés DINplus")}</span>
        </TrustItem>
      </TrustList>
    </SummaryCard>
  );

  return (
    <PageContainer>
      <PageHeader>
        <Title>{t('checkout.title_finalize', 'Finaliser votre commande')}</Title>
        <Subtitle>
          {!user ? (
            <>
              <span>{t('checkout.guest_buy', 'Achat rapide et direct en tant qu’invité.')}</span>
              <span>•</span>
              <span>
                {t('checkout.already_client', 'Déjà client ?')}{' '}
                <LoginPromptButton 
                  type="button" 
                  onClick={() => setIsLoginOpen(true)}
                >
                  {t('checkout.login', 'Se connecter')}
                </LoginPromptButton>
              </span>
            </>
          ) : (
            <span style={{ color: '#27ae60', fontWeight: 600, fontSize: 12 }}>
              ✓ Connecté en tant que {formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)}
            </span>
          )}
        </Subtitle>
      </PageHeader>

      {/* STEPPER SUR MOBILE UNIQUEMENT (2 ÉTAPES) */}
      <MobileStepper>
        <StepItem 
          $active={mobileStep === 1} 
          $done={mobileStep > 1}
          onClick={() => setMobileStep(1)}
        >
          <div className="step-num">{mobileStep > 1 ? <FiCheck size={12} /> : '1'}</div>
          <span className="step-label">1. Livraison</span>
        </StepItem>

        <StepDivider $done={mobileStep > 1} />

        <StepItem 
          $active={mobileStep === 2} 
          $done={false}
          onClick={() => {
            if (mobileStep === 1) handleProceedToPayment();
          }}
        >
          <div className="step-num">2</div>
          <span className="step-label">2. Paiement & Total</span>
        </StepItem>
      </MobileStepper>

      {/* Grille Principale Tout-en-un */}
      <CheckoutGrid>
        {/* Colonne Formulaire (Gauche) */}
        <FormColumn>

          {/* ÉTAPE 1 : COORDONNÉES & ADRESSE DE LIVRAISON */}
          <Step1Wrapper $active={mobileStep === 1}>
            <Card>
              <CardHeader>
                <div className="left-head">
                  <div className="step-badge">1</div>
                  <h2>{t('checkout.step1_title', 'Coordonnées & Adresse de livraison')}</h2>
                </div>
              </CardHeader>

              {user && formData.address && !isEditingAddress ? (
                <SavedAddressCard>
                  <div className="saved-header">
                    <span className="badge">
                      <FiCheckCircle size={15} color="#27ae60" />
                      <span>Adresse de livraison enregistrée</span>
                    </span>
                    <button 
                      type="button" 
                      className="edit-btn" 
                      onClick={() => setIsEditingAddress(true)}
                    >
                      <FiEdit2 size={12} />
                      <span>Modifier</span>
                    </button>
                  </div>

                  <div className="saved-info">
                    <div className="name">
                      {formData.firstName} {formData.lastName}
                    </div>
                    <div className="address-line">
                      {formData.address}{formData.address2 ? `, ${formData.address2}` : ''}
                    </div>
                    <div className="city-line">
                      {formData.postalCode} {formData.city} ({formData.country})
                    </div>
                    <div className="contact-line">
                      <span>{formData.phone}</span> • <span>{formData.email}</span>
                    </div>
                  </div>

                  <NextStepButton type="button" onClick={handleProceedToPayment}>
                    <span>Continuer vers le paiement (Étape 2/2)</span>
                    <FiArrowRight size={14} />
                  </NextStepButton>
                </SavedAddressCard>
              ) : (
                <>
                  {user && formData.address && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2c5530',
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        ✓ Conserver cette adresse
                      </button>
                    </div>
                  )}

                  {/* Prénom & Nom */}
                  <FormGroup $cols="1fr 1fr" $mobileCols="1fr 1fr">
                    <InputWrapper>
                      <label><span className="req">*</span> {t('checkout.firstname', 'Prénom')}</label>
                      <StyledInput
                        type="text"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder={t('checkout.ph_firstname', 'Jean')}
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
                <InputWrapper>
                  <label><span className="req">*</span> {t('checkout.lastname', 'Nom')}</label>
                  <StyledInput
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder={t('checkout.ph_lastname', 'Dupont')}
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              {/* Email & Téléphone */}
              <FormGroup $cols="1.2fr 1fr" $mobileCols="1fr">
                <InputWrapper>
                  <label><span className="req">*</span> {t('checkout.email', 'Adresse email')}</label>
                  <StyledInput
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder={t('checkout.ph_email', 'jean.dupont@email.com')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
                <InputWrapper>
                  <label><span className="req">*</span> {t('checkout.phone', 'Téléphone')}</label>
                  <StyledInput
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder={t('checkout.ph_phone', '06 12 34 56 78')}
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              {/* Adresse */}
              <FormGroup $cols="1fr">
                <InputWrapper>
                  <label><span className="req">*</span> {t('checkout.address', 'Adresse de livraison complète')}</label>
                  <StyledInput
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    placeholder={t("checkout.street_ph", "Numéro et nom de rue")}
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              {/* Complément d'adresse */}
              <FormGroup $cols="1fr">
                <InputWrapper>
                  <label>{t('checkout.address_comp', 'Complément d\'adresse')} <span className="opt">{t('checkout.address_comp_sub', '(Bâtiment, étage, etc.)')}</span></label>
                  <StyledInput
                    type="text"
                    name="address2"
                    placeholder={t('checkout.address_comp_ph', 'Appartement, lieu-dit, digicode...')}
                    value={formData.address2}
                    onChange={handleChange}
                  />
                </InputWrapper>
              </FormGroup>

              {/* Code Postal, Ville & Pays */}
              <FormGroup $cols="1fr 1.5fr 1fr" $mobileCols="1fr 1fr">
                <InputWrapper>
                  <label><span className="req">*</span> {t('checkout.postal_code', 'Code postal')}</label>
                  <StyledInput
                    type="text"
                    name="postalCode"
                    autoComplete="postal-code"
                    placeholder={t('checkout.ph_zip', '67000')}
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
                <InputWrapper>
                  <label><span className="req">*</span> {t('checkout.city', 'Ville')}</label>
                  <StyledInput
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    placeholder={t('checkout.ph_city', 'Strasbourg')}
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
                <CountryInputWrapper>
                  <label><span className="req">*</span> {t('checkout.country', 'Pays')}</label>
                  <StyledSelect
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="France">{t('checkout.france', 'France')}</option>
                    <option value="Allemagne">{t('checkout.germany', 'Allemagne')}</option>
                    <option value="Belgique">{t('checkout.belgium', 'Belgique')}</option>
                    <option value="Luxembourg">{t('checkout.luxembourg', 'Luxembourg')}</option>
                    <option value="Pays-Bas">Pays-Bas</option>
                    <option value="Autriche">{t('checkout.austria', 'Autriche')}</option>
                    <option value="Suisse">{t('checkout.switzerland', 'Suisse')}</option>
                  </StyledSelect>
                </CountryInputWrapper>
              </FormGroup>

              {/* Accordéon instructions chauffeur (replié par défaut pour gagner de la place) */}
              <div style={{ marginTop: 8 }}>
                {!showNotes ? (
                  <button
                    type="button"
                    onClick={() => setShowNotes(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2c5530',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 0',
                      textDecoration: 'underline'
                    }}
                  >
                    + {t('checkout.driver_instruction', 'Ajouter une instruction pour le chauffeur (optionnel)')}
                  </button>
                ) : (
                  <InputWrapper>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        Instructions spécifiques chauffeur <span className="opt">(accès, portail...)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowNotes(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2c5530',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: '0 4px'
                        }}
                      >
                        − Refermer
                      </button>
                    </label>
                    <StyledTextarea
                      name="notes"
                      placeholder="Ex : Accès facile sous abri, largeur portail 3m, déposer le long du garage..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </InputWrapper>
                )}
              </div>

              {/* Création de compte facultative pour invité */}
              {!user && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #edf2ee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#3b5240' }}>{t('checkout.client_account', 'Compte client')}</span>
                    <span style={{ fontSize: 11, color: '#88998c', fontWeight: 500 }}>{t('checkout.optional', '(Optionnel)')}</span>
                  </div>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8, 
                    fontSize: 'clamp(11.5px, 2.9vw, 12.5px)', 
                    color: '#1e3d22', 
                    cursor: 'pointer', 
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    userSelect: 'none'
                  }}>
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      style={{ accentColor: '#2c5530', width: 15, height: 15, flexShrink: 0, margin: 0 }}
                    />
                    <span>{t("checkout.create_account", "Créer un compte pour suivre mes commandes")}</span>
                  </label>

                  {createAccount && (
                    <div style={{ marginTop: 10, maxWidth: 320, animation: 'fadeIn 0.2s ease-in-out' }}>
                      <InputWrapper>
                        <label><span className="req">*</span> Mot de passe souhaité</label>
                        <div style={{ position: 'relative' }}>
                          <StyledInput
                            type={showPassword ? 'text' : 'password'}
                            placeholder="6 caractères minimum"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: 40 }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute',
                              right: 10,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#667c6c',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                      </InputWrapper>
                    </div>
                  )}
                </div>
              )}

              {/* Bouton de passage à l'étape 2 (VISIBLE SUR MOBILE UNIQUEMENT) */}
              <NextStepButton type="button" onClick={handleProceedToPayment}>
                <span>Passer au paiement (Étape 2/2)</span>
                <FiArrowRight size={15} />
              </NextStepButton>
            </>
          )}
        </Card>
      </Step1Wrapper>

          {/* ÉTAPE 2 : PAIEMENT (SUR MOBILE S'AFFICHE QUAND mobileStep === 2, SUR DESKTOP TOUJOURS VISIBLE) */}
          <Step2Wrapper $active={mobileStep === 2}>
            {/* Sur mobile, rappel de l'adresse choisie avec bouton modifier */}
            <DeliveryRecapChip>
              <div className="info">
                <div>Livraison : <strong>{formData.firstName || 'Client'} {formData.lastName}</strong></div>
                <div style={{ color: '#55695a', fontSize: 12 }}>{formData.address || 'Adresse renseignée'}, {formData.postalCode} {formData.city}</div>
              </div>
              <button type="button" onClick={() => setMobileStep(1)}>
                <FiEdit2 size={13} />
                <span>Modifier</span>
              </button>
            </DeliveryRecapChip>

            <Card>
              <CardHeader>
                <div className="left-head">
                  <div className="step-badge">2</div>
                  <h2>{t("checkout.payment_mode", "Mode de paiement")}</h2>
                </div>
              </CardHeader>

              <PaymentBox>
                <PaymentBoxHeader>
                  <PaymentOptionTitle>
                    <span className="radio-check">
                      <FiCheck size={12} />
                    </span>
                    <span>{t("checkout.bank_sepa", "Virement bancaire (SEPA)")}</span>
                  </PaymentOptionTitle>
                  <SecurityBadge>
                    <FiShield size={12} />
                    {t('checkout.secure_100', '100% Sécurisé')}
                  </SecurityBadge>
                </PaymentBoxHeader>

                <PaymentDetails>
                  <p>
                    {t('checkout.safe_desc', 'Simple et sans risque : Vous effectuerez le virement depuis votre application bancaire sans jamais transmettre vos identifiants bancaires sur Internet.')}
                  </p>
                  <p style={{ marginTop: 5 }}>
                    <span dangerouslySetInnerHTML={{ __html: t('checkout.safe_desc2', 'Nos coordonnées officielles (<strong>IBAN, BIC et Titulaire</strong>) ainsi que votre <strong>numéro de commande</strong> s\'afficheront sur la page suivante immédiatement après confirmation.') }} />
                  </p>
                  <p style={{ marginTop: 5, color: '#166534', fontWeight: 600 }}>
                    ✓ {t('checkout.items_reserved', 'Vos articles sont immédiatement réservés pour votre livraison.')}
                  </p>
                </PaymentDetails>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, color: '#4a6150', fontSize: 11.5, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiLock size={12} color="#2c5530" /> {t('checkout.ssl', 'Chiffrement SSL 256-bit')}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiCheckCircle size={12} color="#27ae60" /> {t('checkout.no_extra_fee', 'Aucun frais additionnel')}
                  </span>
                </div>
              </PaymentBox>
            </Card>

            {/* SUR MOBILE : le récapitulatif avec total et bouton de confirmation est directement dans l'étape 2 */}
            <MobileSummaryWrapper>
              {renderOrderSummaryContent()}
            </MobileSummaryWrapper>
          </Step2Wrapper>

        </FormColumn>

        {/* Colonne Récapitulatif Sticky (SUR DESKTOP UNIQUEMENT) */}
        <DesktopSummaryWrapper>
          {renderOrderSummaryContent()}
        </DesktopSummaryWrapper>
      </CheckoutGrid>
    </PageContainer>
  );
};

export default Checkout;
