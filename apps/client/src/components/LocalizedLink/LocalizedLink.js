import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routeMapping from '../../utils/routeMapping.json';
import { getCleanLang } from '../../i18n';

const LocalizedLink = ({ routeKey, search = '', children, ...props }) => {
  const { i18n } = useTranslation();
  const lang = getCleanLang(i18n.language);
  
  const pathSlug = routeMapping[routeKey]?.[lang] ?? routeKey;
  const to = `/${lang}${pathSlug ? `/${pathSlug}` : ''}${search}`;

  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
};

export default LocalizedLink;
