import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routeMapping from '../utils/routeMapping.json';
import { getCleanLang } from '../i18n';
import { getProductSlug } from '../data/productSlugs';

export const useLocalizedNavigate = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const localizedNavigate = (routeKey, params = '', search = '', options = {}) => {
    const lang = getCleanLang(i18n.language);
    const pathSlug = routeMapping[routeKey]?.[lang] ?? routeKey;
    
    let resolvedParams = params;
    if (routeKey === 'productDetail' && params) {
      resolvedParams = getProductSlug(params, lang) || params;
    }

    // Construct the path
    let path = `/${lang}`;
    if (pathSlug) {
      path += `/${pathSlug}`;
    }
    if (resolvedParams) {
      // Si params commence par un /, on l'ajoute directement, sinon on ajoute un /
      path += resolvedParams.startsWith('/') ? resolvedParams : `/${resolvedParams}`;
    }
    if (search) {
      path += search;
    }
    
    navigate(path, options);
  };

  return localizedNavigate;
};
