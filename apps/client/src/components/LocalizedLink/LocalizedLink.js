import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routeMapping from '../../utils/routeMapping.json';
import { getCleanLang } from '../../i18n';
import { getProductSlug } from '../../data/productSlugs';

const LocalizedLink = ({ routeKey, params = '', search = '', children, ...props }) => {
  const { i18n } = useTranslation();
  const lang = getCleanLang(i18n.language);
  
  let resolvedParams = params;
  if (routeKey === 'productDetail' && params) {
    resolvedParams = getProductSlug(params, lang) || params;
  }
  
  const pathSlug = routeMapping[routeKey]?.[lang] ?? routeKey;
  let to = `/${lang}`;
  if (pathSlug) {
    to += `/${pathSlug}`;
  }
  if (resolvedParams) {
    to += resolvedParams.startsWith('/') ? resolvedParams : `/${resolvedParams}`;
  }
  if (search) {
    to += search;
  }

  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
};

export default LocalizedLink;
