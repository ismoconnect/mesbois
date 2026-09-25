import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routeMapping from '../utils/routeMapping.json';

export const useLocalizedNavigate = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const localizedNavigate = (routeKey, params = '', search = '', options = {}) => {
    const lang = i18n.language || 'fr';
    const pathSlug = routeMapping[routeKey]?.[lang] ?? routeKey;
    
    // Construct the path
    let path = `/${lang}`;
    if (pathSlug) {
      path += `/${pathSlug}`;
    }
    if (params) {
      // Si params commence par un /, on l'ajoute directement, sinon on ajoute un /
      path += params.startsWith('/') ? params : `/${params}`;
    }
    if (search) {
      path += search;
    }
    
    navigate(path, options);
  };

  return localizedNavigate;
};
