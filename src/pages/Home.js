import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiTruck, FiShield, FiStar, FiHeart, FiTrendingUp, FiUsers, FiShoppingCart, FiClock } from 'react-icons/fi';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  animation: fadeIn 0.8s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, rgba(26, 58, 30, 0.85) 0%, rgba(44, 85, 48, 0.9) 50%, rgba(74, 124, 89, 0.85) 100%);
  background-size: 200% 200%;
  color: white;
  padding: 120px 0;
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;
  animation: slideInFromTop 1s ease-out, gradientShift 15s ease infinite;
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 20px 0 70px 0;
    margin-top: -40px;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 15px 0 70px 0;
    margin-top: -40px;
    margin-bottom: 30px;
  }
  
  @media (max-width: 375px) {
    padding: 10px 0 60px 0;
    margin-top: -40px;
    margin-bottom: 20px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
                radial-gradient(circle at 40% 20%, rgba(255,255,255,0.05) 0%, transparent 50%);
    animation: float 8s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  
  @keyframes slideInFromTop {
    from {
      opacity: 0;
      transform: translateY(-50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) scale(1);
    }
    33% {
      transform: translateY(-15px) scale(1.02);
    }
    66% {
      transform: translateY(-5px) scale(0.98);
    }
  }
  
`;

const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  animation: titleSlideIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s both;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 255, 255, 0.1);
  letter-spacing: -1px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, transparent, white, transparent);
    border-radius: 2px;
    animation: lineGrow 1.5s ease-out 0.8s both;
  }
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
  
  @keyframes titleSlideIn {
    from {
      opacity: 0;
      transform: translateY(-30px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes lineGrow {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 100px;
      opacity: 1;
    }
  }
`;

const HeroSubtitle = styled.p`
  font-size: 22px;
  margin-bottom: 50px;
  margin-top: 30px;
  opacity: 0.95;
  position: relative;
  z-index: 1;
  animation: subtitleSlideIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both;
  line-height: 1.6;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 30px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 25px;
    margin-top: 20px;
  }
  
  @keyframes subtitleSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
      filter: blur(4px);
    }
    to {
      opacity: 0.95;
      transform: translateY(0);
      filter: blur(0);
    }
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background: white;
  color: #2c5530;
  padding: 18px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  z-index: 1;
  animation: buttonSlideIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.9s both;
  overflow: hidden;
  margin: 0 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(255, 255, 255, 0.5);
  
  @media (max-width: 768px) {
    padding: 14px 32px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 28px;
    font-size: 15px;
    margin: 0 5px;
  }
  
  @media (max-width: 375px) {
    padding: 10px 24px;
    font-size: 14px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #27ae60, #2c5530);
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(44, 85, 48, 0.3), transparent);
    transition: left 0.7s ease;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.8);
    color: white;
    
    &::before {
      width: 400px;
      height: 400px;
    }
    
    &::after {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.02);
  }
  
  @keyframes buttonSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const HeroDecoration = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const FloatingParticle = styled.div`
  position: absolute;
  width: ${props => props.size || '4px'};
  height: ${props => props.size || '4px'};
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  animation: floatParticle ${props => props.duration || '8s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  
  @keyframes floatParticle {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      transform: translate(${props => props.moveX || '30px'}, ${props => props.moveY || '-50px'}) scale(1.2);
      opacity: 0.8;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
  }
`;

const FloatingIcon = styled.div`
  position: absolute;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  font-size: ${props => props.size || '30px'};
  animation: floatIcon ${props => props.duration || '20s'} linear infinite;
  animation-delay: ${props => props.delay || '0s'};
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)) brightness(1.1);
  pointer-events: none;
  
  &::before {
    content: '${props => props.icon || '🌳'}';
    display: block;
  }
  
  @keyframes floatIcon {
    0% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 0.6;
    }
    25% {
      opacity: 0.9;
    }
    50% {
      transform: translate(${props => props.moveX || '50px'}, ${props => props.moveY || '50px'}) rotate(${props => props.rotate || '180deg'});
      opacity: 0.8;
    }
    75% {
      opacity: 0.9;
    }
    100% {
      transform: translate(0, 0) rotate(${props => props.rotateEnd || '360deg'});
      opacity: 0.6;
    }
  }
`;

const HeroWave = styled.div`
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 100px;
  background: white;
  clip-path: polygon(0 50%, 10% 45%, 20% 50%, 30% 45%, 40% 50%, 50% 45%, 60% 50%, 70% 45%, 80% 50%, 90% 45%, 100% 50%, 100% 100%, 0 100%);
  z-index: 1;
`;

const FeaturesSection = styled.section`
  padding: 60px 0;
  background: white;
  
  @media (max-width: 768px) {
    padding: 40px 0;
  }
  
  @media (max-width: 480px) {
    padding: 30px 0;
  }
  
  @media (max-width: 375px) {
    padding: 25px 0;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 50px;
  color: #2c5530;
  position: relative;
  padding-bottom: 20px;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 5px;
    background: linear-gradient(90deg, #2c5530 0%, #27ae60 50%, #2c5530 100%);
    border-radius: 3px;
    animation: lineExpand 1.5s ease-out both;
  }
  
  @keyframes lineExpand {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 80px;
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 30px;
    padding-bottom: 12px;
    white-space: normal;
    
    &::after {
      width: 50px;
      height: 3px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    
    &::after {
      width: 40px;
      height: 2px;
    }
  }
  
  @media (max-width: 375px) {
    font-size: 18px;
    margin-bottom: 15px;
    padding-bottom: 8px;
    
    &::after {
      width: 30px;
      height: 2px;
    }
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  @media (max-width: 375px) {
    gap: 15px;
    margin-bottom: 25px;
  }
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 40px 25px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #2c5530, #4a7c59, #27ae60);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 40px rgba(44, 85, 48, 0.2);
    
    &::before {
      transform: scaleX(1);
    }
  }
  
  @media (max-width: 768px) {
    padding: 25px 20px;
    border-radius: 12px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
    
    &:hover {
      transform: translateY(-5px) scale(1.01);
    }
  }
  
  @media (max-width: 480px) {
    padding: 20px 15px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    &:hover {
      transform: translateY(-3px) scale(1.005);
    }
  }
  
  @media (max-width: 375px) {
    padding: 15px 12px;
    border-radius: 8px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  }
`;

const FeatureIcon = styled.div`
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #2c5530 0%, #4a7c59 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  color: white;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 25px rgba(44, 85, 48, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4a7c59, #27ae60);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }
  
  ${FeatureCard}:hover & {
    transform: scale(1.15) rotate(10deg);
    box-shadow: 0 15px 40px rgba(44, 85, 48, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    margin: 0 auto 20px;
    box-shadow: 0 6px 20px rgba(44, 85, 48, 0.25);
    
    ${FeatureCard}:hover & {
      transform: scale(1.1) rotate(8deg);
    }
  }
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    margin: 0 auto 15px;
    box-shadow: 0 4px 15px rgba(44, 85, 48, 0.2);
    
    ${FeatureCard}:hover & {
      transform: scale(1.05) rotate(5deg);
    }
  }
  
  @media (max-width: 375px) {
    width: 50px;
    height: 50px;
    margin: 0 auto 12px;
    box-shadow: 0 3px 12px rgba(44, 85, 48, 0.15);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #2c5530;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  @media (max-width: 375px) {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.5;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    line-height: 1.4;
  }
  
  @media (max-width: 375px) {
    font-size: 12px;
    line-height: 1.3;
  }
`;

const ProductsSection = styled.section`
  padding: 0 0 80px 0;
  background: #f8f9fa;
  margin-top: -80px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    margin-top: -60px;
    padding-bottom: 60px;
  }
  
  @media (max-width: 480px) {
    margin-top: -50px;
    padding-bottom: 40px;
  }
`;

const ProductsHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  padding-top: 30px;
  
  @media (max-width: 768px) {
    padding-top: 25px;
    margin-bottom: 40px;
  }
  
  @media (max-width: 480px) {
    padding-top: 20px;
    margin-bottom: 30px;
  }
`;

const ProductsSubtitle = styled.p`
  font-size: 18px;
  color: #666;
  max-width: 600px;
  margin: 20px auto 0;
  line-height: 1.6;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  @media (max-width: 375px) {
    gap: 12px;
  }
`;

const ProductCardEnhanced = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  animation: cardFadeIn 0.6s ease-out both;
  animation-delay: calc(var(--card-index) * 0.1s);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(44, 85, 48, 0.05) 0%, rgba(39, 174, 96, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 25px 60px rgba(44, 85, 48, 0.25);
    
    &::before {
      opacity: 1;
    }
  }
  
  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @media (max-width: 768px) {
    border-radius: 16px;
    
    &:hover {
      transform: translateY(-8px) scale(1.01);
    }
  }
  
  @media (max-width: 480px) {
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  ${ProductCardEnhanced}:hover &::after {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    height: 180px;
  }
  
  @media (max-width: 480px) {
    height: 150px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  ${ProductCardEnhanced}:hover & {
    transform: scale(1.15) rotate(2deg);
  }
`;

const ProductBadges = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Badge = styled.div`
  background: ${props => props.type === 'sale' ? '#e74c3c' : props.type === 'new' ? '#27ae60' : '#2c5530'};
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px ${props => props.type === 'sale' ? 'rgba(231, 76, 60, 0.4)' : props.type === 'new' ? 'rgba(39, 174, 96, 0.4)' : 'rgba(44, 85, 48, 0.4)'};
  animation: badgePulse 2s ease-in-out infinite;
  
  @keyframes badgePulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const ProductContent = styled.div`
  padding: 25px;
  
  @media (max-width: 768px) {
    padding: 18px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const ProductName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #2c5530;
  margin: 0;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 1.2;
  }
`;

const ProductPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #27ae60;
  margin-left: 15px;
  
  @media (max-width: 768px) {
    font-size: 18px;
    margin-left: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-left: 8px;
  }
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 12px;
    line-height: 1.4;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .stars {
    display: flex;
    gap: 2px;
    color: #f39c12;
  }
  
  .rating-text {
    color: #666;
    font-size: 14px;
  }
`;

const ProductStock = styled.div`
  font-size: 12px;
  color: ${props => props.inStock ? '#27ae60' : '#e74c3c'};
  font-weight: 600;
  background: ${props => props.inStock ? '#d4edda' : '#f8d7da'};
  padding: 4px 8px;
  border-radius: 12px;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 10px;
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: #2c5530;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    background: #1e3a22;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 10px 8px;
    font-size: 13px;
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 6px;
    font-size: 11px;
    gap: 4px;
    border-radius: 6px;
  }
`;

const ViewButton = styled(Link)`
  background: transparent;
  color: #2c5530;
  border: 2px solid #2c5530;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    background: #2c5530;
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 11px;
    border-width: 1.5px;
    border-radius: 6px;
  }
`;

const ProductsStats = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%);
  border-radius: 24px;
  padding: 50px 40px;
  margin-bottom: 60px;
  box-shadow: 0 15px 50px rgba(44, 85, 48, 0.15), 0 5px 15px rgba(0, 0, 0, 0.05);
  border: 3px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #2c5530 0%, #27ae60 50%, #2c5530 100%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(39, 174, 96, 0.1), transparent);
    animation: shimmer 3s infinite;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 60px rgba(44, 85, 48, 0.2), 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
  
  @media (max-width: 768px) {
    padding: 30px 15px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 20px 10px;
    margin-bottom: 30px;
    border-radius: 16px;
  }
  
  @media (max-width: 375px) {
    padding: 15px 8px;
    margin-bottom: 20px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 30px 20px;
  position: relative;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 16px;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(44, 85, 48, 0.05), rgba(39, 174, 96, 0.05));
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.03);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 70%;
    background: linear-gradient(
      180deg, 
      transparent 0%, 
      rgba(44, 85, 48, 0.15) 20%,
      rgba(39, 174, 96, 0.25) 50%,
      rgba(44, 85, 48, 0.15) 80%,
      transparent 100%
    );
    box-shadow: 0 0 10px rgba(39, 174, 96, 0.2);
  }
  
  svg {
    color: #2c5530;
    font-size: 48px;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    filter: drop-shadow(0 4px 8px rgba(44, 85, 48, 0.2));
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
      font-size: 28px;
    }
    
    @media (max-width: 480px) {
      font-size: 22px;
    }
    
    @media (max-width: 375px) {
      font-size: 18px;
    }
  }
  
  &:hover svg {
    transform: scale(1.25) rotate(360deg);
    color: #27ae60;
    filter: drop-shadow(0 8px 16px rgba(39, 174, 96, 0.4));
  }
  
  h4 {
    font-size: 20px;
    font-weight: 800;
    color: #2c5530;
    margin: 0;
    line-height: 1.3;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
    
    background: linear-gradient(135deg, #2c5530 0%, #27ae60 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 768px) {
      font-size: 14px;
    }
    
    @media (max-width: 480px) {
      font-size: 12px;
    }
    
    @media (max-width: 375px) {
      font-size: 10px;
    }
  }
  
  &:hover h4 {
    transform: scale(1.05);
  }
  
  p {
    color: #555;
    font-size: 14px;
    margin: 0;
    line-height: 1.6;
    max-width: 200px;
    position: relative;
    z-index: 1;
    transition: color 0.3s ease;
    
    @media (max-width: 768px) {
      font-size: 11px;
      max-width: 130px;
    }
    
    @media (max-width: 480px) {
      font-size: 10px;
      max-width: 100px;
      line-height: 1.3;
    }
    
    @media (max-width: 375px) {
      font-size: 9px;
      max-width: 80px;
      line-height: 1.2;
    }
  }
  
  &:hover p {
    color: #333;
  }
  
  @media (max-width: 768px) {
    flex: 0 0 auto;
    min-width: auto;
    padding: 12px 8px;
    gap: 6px;
    
    &:not(:last-child)::after {
      width: 1px;
      height: 40%;
    }
    
    svg {
      font-size: 28px;
    }
    
    h4 {
      font-size: 14px;
      line-height: 1.1;
    }
    
    p {
      font-size: 11px;
      max-width: 100%;
      line-height: 1.2;
    }
  }
  
  @media (max-width: 480px) {
    padding: 8px 4px;
    gap: 4px;
    
    svg {
      font-size: 22px;
    }
    
    h4 {
      font-size: 12px;
      line-height: 1.0;
    }
    
    p {
      font-size: 10px;
      max-width: 100%;
      line-height: 1.1;
    }
  }
  
  @media (max-width: 375px) {
    padding: 6px 3px;
    gap: 3px;
    
    svg {
      font-size: 18px;
    }
    
    h4 {
      font-size: 10px;
      line-height: 1.0;
    }
    
    p {
      font-size: 9px;
      line-height: 1.0;
    }
  }
`;

const ViewAllButton = styled(Link)`
  display: block;
  text-align: center;
  background: #2c5530;
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  max-width: 200px;
  margin: 0 auto;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1e3a22;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(44, 85, 48, 0.3);
  }
`;

// Nouveaux composants pour la page d'accueil améliorée
const StatsSection = styled.section`
  background: white;
  padding: 60px 0;
  margin: 60px 0;
  
  @media (max-width: 768px) {
    padding: 30px 0;
    margin: 30px 0;
  }
  
  @media (max-width: 480px) {
    padding: 20px 0;
    margin: 20px 0;
  }
  
  @media (max-width: 375px) {
    padding: 15px 0;
    margin: 15px 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-bottom: 0;
  
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 30px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: statCardSlideIn 0.8s ease-out both;
  animation-delay: ${props => props.delay || '0s'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(44, 85, 48, 0.1) 0%, rgba(74, 124, 89, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    
    &::before {
      opacity: 1;
    }
  }
  
  @keyframes statCardSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StatNumber = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 4px;
  }
  
  @media (max-width: 375px) {
    font-size: 18px;
    margin-bottom: 3px;
  }
`;

const StatLabel = styled.div`
  font-size: 16px;
  color: #666;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
  }
  
  @media (max-width: 375px) {
    font-size: 9px;
  }
`;

const TestimonialsSection = styled.section`
  background: #f8f9fa;
  padding: 80px 0;
  margin: 60px 0;
  
  @media (max-width: 768px) {
    padding: 50px 0;
    margin: 40px 0;
  }
  
  @media (max-width: 480px) {
    padding: 35px 0;
    margin: 30px 0;
  }
  
  @media (max-width: 375px) {
    padding: 25px 0;
    margin: 20px 0;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 25px;
  }
  
  @media (max-width: 375px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const TestimonialCard = styled.div`
  background: white;
  padding: 35px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  
  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 20px;
    font-size: 80px;
    font-family: Georgia, serif;
    color: #2c5530;
    opacity: 0.15;
    transition: all 0.4s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: linear-gradient(180deg, #2c5530 0%, #27ae60 100%);
    transform: scaleY(0);
    transition: transform 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(44, 85, 48, 0.2);
    
    &::before {
      opacity: 0.3;
      transform: scale(1.2);
    }
    
    &::after {
      transform: scaleY(1);
    }
  }
  
  @media (max-width: 768px) {
    padding: 25px 20px;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    
    &::before {
      font-size: 60px;
      top: -8px;
      left: 15px;
    }
    
    &:hover {
      transform: translateY(-5px);
    }
  }
  
  @media (max-width: 480px) {
    padding: 20px 15px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
    
    &::before {
      font-size: 50px;
      top: -6px;
      left: 12px;
    }
    
    &:hover {
      transform: translateY(-3px);
    }
  }
  
  @media (max-width: 375px) {
    padding: 15px 12px;
    border-radius: 10px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
    
    &::before {
      font-size: 40px;
      top: -4px;
      left: 10px;
    }
  }
`;

const TestimonialText = styled.p`
  font-style: italic;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    line-height: 1.4;
    margin-bottom: 12px;
  }
  
  @media (max-width: 375px) {
    font-size: 12px;
    line-height: 1.3;
    margin-bottom: 10px;
  }
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    gap: 10px;
  }
  
  @media (max-width: 375px) {
    gap: 8px;
  }
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  background: #2c5530;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
    font-size: 12px;
  }
  
  @media (max-width: 375px) {
    width: 30px;
    height: 30px;
    font-size: 11px;
  }
`;

const AuthorInfo = styled.div`
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 5px;
    
    @media (max-width: 768px) {
      font-size: 14px;
      margin-bottom: 3px;
    }
    
    @media (max-width: 480px) {
      font-size: 13px;
      margin-bottom: 2px;
    }
    
    @media (max-width: 375px) {
      font-size: 12px;
    }
  }
  
  p {
    font-size: 14px;
    color: #666;
    
    @media (max-width: 768px) {
      font-size: 12px;
    }
    
    @media (max-width: 480px) {
      font-size: 11px;
    }
    
    @media (max-width: 375px) {
      font-size: 10px;
    }
  }
`;

const NewsletterSection = styled.section`
  background: linear-gradient(135deg, #1a3a1e 0%, #2c5530 50%, #4a7c59 100%);
  background-size: 200% 200%;
  color: white;
  padding: 80px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: gradientShiftNewsletter 12s ease infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.06) 0%, transparent 50%);
    animation: float 10s ease-in-out infinite;
  }
  
  @keyframes gradientShiftNewsletter {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  @media (max-width: 768px) {
    padding: 50px 0;
  }
  
  @media (max-width: 480px) {
    padding: 35px 0;
  }
  
  @media (max-width: 375px) {
    padding: 25px 0;
  }
`;

const NewsletterContent = styled.div`
  max-width: 650px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    padding: 0 12px;
  }
  
  @media (max-width: 375px) {
    padding: 0 10px;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 18px 25px;
  border: 2px solid transparent;
  border-radius: 50px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.95);
  
  &::placeholder {
    color: #999;
  }
  
  &:focus {
    border-color: #27ae60;
    box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.2);
    background: white;
  }
`;

const NewsletterButton = styled.button`
  background: white;
  color: #2c5530;
  border: none;
  padding: 18px 40px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #27ae60, #2c5530);
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    color: white;
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
`;

const CTASection = styled.section`
  background: white;
  padding: 80px 0;
  text-align: center;
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  background: #2c5530;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1e3a22;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: #2c5530;
  padding: 15px 30px;
  border: 2px solid #2c5530;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2c5530;
    color: white;
  }
`;

const Home = () => {
  const [email, setEmail] = useState('');

  // Données de démonstration pour les produits phares
  const featuredProducts = [
    {
      id: '1',
      name: 'Bûches de Chêne Premium',
      description: 'Bûches de chêne séchées 2 ans, idéales pour un feu de longue durée avec une excellente valeur calorifique.',
      price: 45.99,
      category: 'bûches',
      type: 'chêne',
      stock: 150,
      image: 'https://images.unsplash.com/photo-1544966503-7cc4acb4c1a9?w=400',
      rating: 4.8,
      reviewCount: 127,
      sale: false,
      new: false
    },
    {
      id: '2',
      name: 'Granulés de Bois Certifiés',
      description: 'Granulés de bois certifiés DIN Plus, parfaits pour poêles et chaudières à granulés.',
      price: 6.99,
      category: 'granulés',
      type: 'mélange',
      stock: 200,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      rating: 4.9,
      reviewCount: 89,
      sale: true,
      new: false
    },
    {
      id: '3',
      name: 'Bûches de Hêtre Séchées',
      description: 'Bûches de hêtre séchées naturellement, excellent pouvoir calorifique et flamme vive.',
      price: 42.50,
      category: 'bûches',
      type: 'hêtre',
      stock: 120,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      rating: 4.7,
      reviewCount: 95,
      sale: false,
      new: true
    },
    {
      id: '4',
      name: 'Pellets Premium',
      description: 'Pellets de qualité premium, faible taux de cendre et haute performance énergétique.',
      price: 8.50,
      category: 'pellets',
      type: 'premium',
      stock: 180,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
      rating: 4.6,
      reviewCount: 76,
      sale: false,
      new: false
    },
    {
      id: '5',
      name: 'Kit Allumage Naturel',
      description: 'Kit complet pour allumer votre feu facilement avec des produits naturels et écologiques.',
      price: 12.99,
      category: 'allumage',
      type: 'naturel',
      stock: 85,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      rating: 4.5,
      reviewCount: 43,
      sale: true,
      new: false
    },
    {
      id: '6',
      name: 'Bûches de Charme',
      description: 'Bûches de charme séchées, combustion lente et régulière, parfait pour la nuit.',
      price: 48.99,
      category: 'bûches',
      type: 'charme',
      stock: 95,
      image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400',
      rating: 4.8,
      reviewCount: 112,
      sale: false,
      new: false
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      console.log('Newsletter subscription:', email);
      alert('Merci pour votre inscription à notre newsletter !');
      setEmail('');
    }
  };

  const handleAddToCart = (productId, productName) => {
    console.log(`Ajout au panier: ${productName} (ID: ${productId})`);
    alert(`${productName} a été ajouté au panier !`);
  };

  return (
    <HomeContainer>
      {/* Section Hero */}
      <HeroSection>
        <HeroDecoration>
          {/* Particules scintillantes */}
          <FloatingParticle size="6px" top="20%" left="10%" duration="10s" delay="0s" moveX="40px" moveY="-80px" />
          <FloatingParticle size="4px" top="30%" left="20%" duration="8s" delay="1s" moveX="-30px" moveY="-60px" />
          <FloatingParticle size="5px" top="40%" left="80%" duration="12s" delay="0.5s" moveX="50px" moveY="-70px" />
          <FloatingParticle size="3px" top="50%" left="90%" duration="9s" delay="2s" moveX="-40px" moveY="-50px" />
          <FloatingParticle size="4px" top="60%" left="15%" duration="11s" delay="1.5s" moveX="35px" moveY="-65px" />
          <FloatingParticle size="6px" top="70%" left="70%" duration="10s" delay="0.8s" moveX="-45px" moveY="-75px" />
          <FloatingParticle size="5px" top="25%" left="50%" duration="13s" delay="2.5s" moveX="25px" moveY="-85px" />
          <FloatingParticle size="4px" top="35%" left="60%" duration="9s" delay="1.2s" moveX="-35px" moveY="-55px" />
          <FloatingParticle size="5px" top="45%" left="30%" duration="11s" delay="0.3s" moveX="45px" moveY="-70px" />
          <FloatingParticle size="3px" top="55%" left="40%" duration="10s" delay="1.8s" moveX="-25px" moveY="-60px" />
          
          {/* Arbres de forêt en rotation */}
          <FloatingIcon icon="🌳" size="35px" top="10%" left="15%" duration="25s" delay="0s" moveX="60px" moveY="80px" rotate="180deg" rotateEnd="360deg" />
          <FloatingIcon icon="🌳" size="32px" top="20%" left="75%" duration="28s" delay="3s" moveX="-70px" moveY="90px" rotate="200deg" rotateEnd="360deg" />
          <FloatingIcon icon="🌳" size="38px" top="50%" left="5%" duration="30s" delay="5s" moveX="80px" moveY="-60px" rotate="170deg" rotateEnd="360deg" />
          <FloatingIcon icon="🌳" size="33px" top="70%" left="85%" duration="26s" delay="8s" moveX="-65px" moveY="-75px" rotate="190deg" rotateEnd="360deg" />
          
          {/* Camions de livraison */}
          <FloatingIcon icon="🚚" size="36px" top="15%" left="50%" duration="32s" delay="2s" moveX="70px" moveY="70px" rotate="160deg" rotateEnd="360deg" />
          <FloatingIcon icon="🚚" size="34px" top="45%" left="80%" duration="29s" delay="6s" moveX="-75px" moveY="85px" rotate="185deg" rotateEnd="360deg" />
          <FloatingIcon icon="🚚" size="37px" top="65%" left="25%" duration="31s" delay="10s" moveX="65px" moveY="-70px" rotate="175deg" rotateEnd="360deg" />
          
          {/* Bûches de bois */}
          <FloatingIcon icon="🪵" size="30px" top="8%" left="65%" duration="27s" delay="1s" moveX="-60px" moveY="75px" rotate="195deg" rotateEnd="360deg" />
          <FloatingIcon icon="🪵" size="32px" top="35%" left="35%" duration="24s" delay="4s" moveX="55px" moveY="-80px" rotate="165deg" rotateEnd="360deg" />
          <FloatingIcon icon="🪵" size="31px" top="55%" left="60%" duration="26s" delay="7s" moveX="-70px" moveY="65px" rotate="180deg" rotateEnd="360deg" />
          <FloatingIcon icon="🪵" size="33px" top="75%" left="45%" duration="28s" delay="9s" moveX="60px" moveY="-85px" rotate="170deg" rotateEnd="360deg" />
        </HeroDecoration>
        
        <HeroTitle>Bois de Chauffage de Qualité</HeroTitle>
        <HeroSubtitle>
          Découvrez notre large gamme de bois de chauffage pour tous vos besoins. 
          Livraison rapide et service client exceptionnel.
        </HeroSubtitle>
        <HeroButton to="/products">
          <span>Découvrir nos produits</span>
        </HeroButton>
        
        <HeroWave />
      </HeroSection>

      {/* Produits phares */}
      <ProductsSection>
        <ProductsHeader>
          <SectionTitle>Nos produits phares</SectionTitle>
          <ProductsSubtitle>
            Découvrez notre sélection de bois de chauffage de qualité supérieure, 
            soigneusement sélectionnés pour leur performance et leur durabilité.
          </ProductsSubtitle>
        </ProductsHeader>

        {/* Statistiques des produits */}
        <ProductsStats>
          <StatsGrid>
            <StatItem>
              <FiTrendingUp size={32} />
              <h4>Qualité Premium</h4>
              <p>Tous nos produits sont certifiés et contrôlés</p>
            </StatItem>
            <StatItem>
              <FiClock size={32} />
              <h4>Livraison Rapide</h4>
              <p>Expédition sous 24-48h partout en France</p>
            </StatItem>
            <StatItem>
              <FiShield size={32} />
              <h4>Garantie Qualité</h4>
              <p>Satisfaction garantie ou remboursé</p>
            </StatItem>
            <StatItem>
              <FiUsers size={32} />
              <h4>Service Client</h4>
              <p>Support dédié pour vous accompagner</p>
            </StatItem>
          </StatsGrid>
        </ProductsStats>

        {/* Grille des produits */}
        <ProductsGrid>
          {featuredProducts.map((product, index) => (
            <ProductCardEnhanced key={product.id} style={{ '--card-index': index }}>
              <ProductImageContainer>
                <ProductImage 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-wood.jpg';
                  }}
                />
                <ProductBadges>
                  {product.sale && <Badge type="sale">Promo</Badge>}
                  {product.new && <Badge type="new">Nouveau</Badge>}
                </ProductBadges>
              </ProductImageContainer>
              
              <ProductContent>
                <ProductHeader>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>{product.price}€</ProductPrice>
                </ProductHeader>
                
                <ProductDescription>{product.description}</ProductDescription>
                
                <ProductInfo>
                  <ProductRating>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          size={14} 
                          fill={i < Math.floor(product.rating) ? '#f39c12' : 'none'} 
                        />
                      ))}
                    </div>
                    <span className="rating-text">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </ProductRating>
                  
                  <ProductStock inStock={product.stock > 0}>
                    {product.stock > 0 ? 'En stock' : 'Rupture'}
                  </ProductStock>
                </ProductInfo>
                
                    <ProductActions>
                      <AddToCartButton onClick={() => handleAddToCart(product.id, product.name)}>
                        <FiShoppingCart size={16} />
                        Ajouter
                      </AddToCartButton>
                      <ViewButton to={`/product/${product.id}`}>
                        Voir
                      </ViewButton>
                    </ProductActions>
              </ProductContent>
            </ProductCardEnhanced>
          ))}
        </ProductsGrid>
        
        <ViewAllButton to="/products">
          Voir tous les produits
        </ViewAllButton>
      </ProductsSection>

      {/* Statistiques */}
      <StatsSection>
        <SectionTitle>Nos chiffres parlent d'eux-mêmes</SectionTitle>
        <StatsGrid>
          <StatCard delay="0.1s">
            <StatNumber>5000+</StatNumber>
            <StatLabel>Clients satisfaits</StatLabel>
          </StatCard>
          <StatCard delay="0.2s">
            <StatNumber>10+</StatNumber>
            <StatLabel>Années d'expérience</StatLabel>
          </StatCard>
          <StatCard delay="0.3s">
            <StatNumber>50+</StatNumber>
            <StatLabel>Produits disponibles</StatLabel>
          </StatCard>
          <StatCard delay="0.4s">
            <StatNumber>24/7</StatNumber>
            <StatLabel>Support client</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* Pourquoi nous choisir */}
      <FeaturesSection>
        <SectionTitle>Pourquoi nous choisir ?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FiTruck size={32} />
            </FeatureIcon>
            <FeatureTitle>Livraison rapide</FeatureTitle>
            <FeatureDescription>
              Livraison à domicile dans toute la France en 24-48h. 
              Service express disponible.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiShield size={32} />
            </FeatureIcon>
            <FeatureTitle>Qualité garantie</FeatureTitle>
            <FeatureDescription>
              Tous nos produits sont certifiés et de qualité premium. 
              Garantie satisfaction.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiStar size={32} />
            </FeatureIcon>
            <FeatureTitle>Service client</FeatureTitle>
            <FeatureDescription>
              Support client disponible 7j/7 pour vous accompagner 
              dans vos choix.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiHeart size={32} />
            </FeatureIcon>
            <FeatureTitle>Écologique</FeatureTitle>
            <FeatureDescription>
              Bois issu de forêts gérées durablement. 
              Respect de l'environnement.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* Témoignages */}
      <TestimonialsSection>
        <SectionTitle>Ce que disent nos clients</SectionTitle>
        <TestimonialsGrid>
          <TestimonialCard>
            <TestimonialText>
              Excellent service ! Le bois de chêne est de très bonne qualité 
              et la livraison a été rapide. Je recommande vivement.
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>MD</AuthorAvatar>
              <AuthorInfo>
                <h4>Marie Dubois</h4>
                <p>Cliente depuis 2 ans</p>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialText>
              Service client exceptionnel et produits de qualité. 
              Le chauffage au bois n'a jamais été aussi facile !
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>JM</AuthorAvatar>
              <AuthorInfo>
                <h4>Jean Martin</h4>
                <p>Cliente depuis 1 an</p>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialText>
              Livraison ponctuelle et bois parfaitement sec. 
              Un service professionnel que je recommande.
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>SL</AuthorAvatar>
              <AuthorInfo>
                <h4>Sophie Leroy</h4>
                <p>Cliente depuis 3 ans</p>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsGrid>
      </TestimonialsSection>

      {/* Newsletter */}
      <NewsletterSection>
        <NewsletterContent>
          <SectionTitle style={{ color: 'white', marginBottom: '20px' }}>
            Restez informé de nos offres
          </SectionTitle>
          <p style={{ fontSize: '18px', opacity: '0.9', marginBottom: '20px' }}>
            Inscrivez-vous à notre newsletter et recevez nos meilleures offres 
            et nouveautés directement dans votre boîte mail.
          </p>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <NewsletterInput
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <NewsletterButton type="submit">
              <span>S'abonner</span>
            </NewsletterButton>
          </NewsletterForm>
        </NewsletterContent>
      </NewsletterSection>

      {/* Call to Action */}
      <CTASection>
        <CTAContent>
          <SectionTitle>Prêt à commencer ?</SectionTitle>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            Découvrez notre catalogue complet et trouvez le bois de chauffage 
            parfait pour vos besoins.
          </p>
          <CTAButtons>
            <PrimaryButton to="/products">
              Voir le catalogue
            </PrimaryButton>
            <SecondaryButton to="/contact">
              Nous contacter
            </SecondaryButton>
          </CTAButtons>
        </CTAContent>
      </CTASection>
    </HomeContainer>
  );
};

export default Home;


