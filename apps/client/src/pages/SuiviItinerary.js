import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCreditCard, FiXCircle, FiDownload } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getOrderById } from '../firebase/orders';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  @media (max-width: 600px) { padding: 20px 12px; }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2c5530;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 24px;
  margin-bottom: 20px;
  @media (max-width: 600px) { padding: 16px; }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Label = styled.span`
  color: #666;
  font-size: 14px;
`;

const Value = styled.span`
  font-weight: 600;
  font-size: 16px;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 40px;
  margin-top: 20px;
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 30px;
  
  &:last-child {
    padding-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -29px;
    top: 10px;
    bottom: -20px;
    width: 2px;
    background: ${props => props.active ? '#2c5530' : '#e0e0e0'};
    display: ${props => props.isLast ? 'none' : 'block'};
  }
`;

const TimelineIcon = styled.div`
  position: absolute;
  left: -40px;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.active ? '#2c5530' : '#e0e0e0'};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.active ? '#2c5530' : '#999'};
`;

const TimelineDate = styled.div`
  font-size: 13px;
  color: #666;
`;

const TimelineDescription = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const DownloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#fff3cd';
      case 'awaiting_payment': return '#ffeaa7';
      case 'processing': return '#d1ecf1';
      case 'shipped': return '#d4edda';
      case 'delivered': return '#d4edda';
      case 'cancelled': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#856404';
      case 'awaiting_payment': return '#b8860b';
      case 'processing': return '#0c5460';
      case 'shipped': return '#155724';
      case 'delivered': return '#155724';
      case 'cancelled': return '#721c24';
      default: return '#6c757d';
    }
  }};
`;

function getStatusText(status) {
  switch (status) {
    case 'pending': return 'Commande reçue';
    case 'awaiting_payment': return 'En attente de paiement';
    case 'processing': return 'Préparation en cours';
    case 'shipped': return 'Expédié';
    case 'delivered': return 'Livré';
    case 'cancelled': return 'Annulé';
    default: return 'Inconnu';
  }
}

function getTimelineSteps(order) {
  const currentStatus = order?.status || 'pending';
  const statusOrder = ['pending', 'awaiting_payment', 'processing', 'shipped', 'delivered'];
  const currentIndex = currentStatus === 'cancelled' ? -1 : statusOrder.indexOf(currentStatus);

  const steps = [
    {
      id: 'pending',
      title: 'Commande reçue',
      icon: <FiClock />,
      description: 'Votre commande a été enregistrée avec succès',
      date: order?.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : '',
    },
    {
      id: 'awaiting_payment',
      title: 'En attente de votre paiement',
      icon: <FiCreditCard />,
      description: currentIndex >= 1 ? 'Votre paiement a été validé avec succès' : 'Votre paiement est en cours de validation',
      date: order?.awaitingPaymentDate ? new Date(order.awaitingPaymentDate.seconds * 1000).toLocaleDateString('fr-FR') : '',
    },
    {
      id: 'processing',
      title: 'Préparation en cours',
      icon: <FiPackage />,
      description: currentIndex >= 2 ? 'Préparation en cours car le paiement est reçu' : 'Votre commande sera préparée dès réception du paiement',
      date: order?.processingDate ? new Date(order.processingDate.seconds * 1000).toLocaleDateString('fr-FR') : '',
    },
    {
      id: 'shipped',
      title: 'Expédié',
      icon: <FiTruck />,
      description: currentIndex >= 3 ? 'Votre commande est en cours de livraison' : 'Votre commande sera expédiée après préparation',
      date: order?.shippedDate ? new Date(order.shippedDate.seconds * 1000).toLocaleDateString('fr-FR') : '',
    },
    {
      id: 'delivered',
      title: 'Livré',
      icon: <FiCheckCircle />,
      description: currentIndex >= 4 ? 'Votre commande a été livrée avec succès' : 'Votre commande sera livrée à l\'adresse indiquée',
      date: order?.deliveredDate ? new Date(order.deliveredDate.seconds * 1000).toLocaleDateString('fr-FR') : '',
    },
  ];

  // Si la commande est annulée, ajouter une étape d'annulation
  if (currentStatus === 'cancelled') {
    steps.push({
      id: 'cancelled',
      title: 'Commande annulée',
      icon: <FiXCircle />,
      description: 'Votre commande a été annulée',
      date: order?.cancelledDate ? new Date(order.cancelledDate.seconds * 1000).toLocaleDateString('fr-FR') : '',
      active: true,
      isLast: true,
    });
    
    // Marquer toutes les étapes précédentes comme actives jusqu'au point d'annulation
    return steps.map((step, index) => ({
      ...step,
      active: step.id === 'cancelled' || index <= Math.max(0, statusOrder.indexOf('pending')),
      isLast: step.id === 'cancelled',
    }));
  }

  return steps.map((step, index) => ({
    ...step,
    active: index <= currentIndex,
    isLast: index === steps.length - 1,
  }));
}

const SuiviItinerary = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const generatePDF = async () => {
    if (!order) return;
    
    const getStatusDescription = (status) => {
      switch (status) {
        case 'pending': return 'Votre commande a été reçue et est en cours de traitement.';
        case 'awaiting_payment': return 'En attente de la validation de votre paiement.';
        case 'processing': return 'Votre commande est en cours de préparation.';
        case 'shipped': return 'Votre commande a été expédiée et est en cours de livraison.';
        case 'delivered': return 'Votre commande a été livrée avec succès.';
        case 'cancelled': return 'Votre commande a été annulée.';
        default: return 'Statut de la commande.';
      }
    };

    const getDocumentTitle = (status) => {
      switch (status) {
        case 'pending': return 'Accusé_de_réception_de_commande';
        case 'awaiting_payment': return 'Confirmation_de_commande';
        case 'processing': return 'Bon_de_préparation';
        case 'shipped': return 'Bon_d_expédition';
        case 'delivered': return 'Reçu_de_livraison';
        case 'cancelled': return 'Avis_d_annulation';
        default: return 'Document_de_commande';
      }
    };
    
    // Quelques utilitaires pour la mise en page
    const sanitize = (s) => (s || '')
      .toString()
      .replace(/[\n\r\t]/g, ' ')
      .replace(/[()]/g, '')
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n');

    const yStart = order.shippingAddress ? 330 : 400; // top Y for table rows
    const rowHeight = 18;
    const colNameX = 70;
    const colQtyX = 400;
    const colUnitX = 470;
    const colTotalX = 520;
    const rows = (order.items || []).map((item, i) => {
      const y = yStart - (i * rowHeight);
      const rectY = y - 6; // background stripe Y
      const name = sanitize((item.name || '').substring(0, 60));
      const qty = `${item.quantity || 0}`;
      const unit = (item.price != null ? item.price.toFixed(2) : '0.00') + ' EUR';
      const total = (((item.price || 0) * (item.quantity || 0)).toFixed(2)) + ' EUR';
      return [
        // zebra striping on odd rows
        ...(i % 2 === 1 ? [
          'q',
          '0.97 0.97 0.97 rg',
          `60 ${rectY} 492 16 re`,
          'f',
          'Q'
        ] : []),
        `1 0 0 1 ${colNameX} ${y} Tm (${name}) Tj`,
        `1 0 0 1 ${colQtyX} ${y} Tm (${qty}) Tj`,
        `1 0 0 1 ${colUnitX} ${y} Tm (${unit}) Tj`,
        `1 0 0 1 ${colTotalX} ${y} Tm (${total}) Tj`
      ].join('\n');
    }).join('\n');

    // Construire le corps du flux PDF (stream) avec positions absolues
    const streamBody = `
q
0.17 0.33 0.19 rg
50 720 512 60 re
f
Q

BT
1 1 1 rg
/F3 20 Tf
60 750 Td
(${sanitize(getDocumentTitle(order.status).replace(/_/g, ' ').toUpperCase())}) Tj
/F2 14 Tf
0 -25 Td
(Commande #${order.id.slice(-8)}) Tj
/F1 10 Tf
0 -15 Td
(Genere le ${new Date().toLocaleDateString('fr-FR')} a ${new Date().toLocaleTimeString('fr-FR')}) Tj
ET

q
0.17 0.33 0.19 RG
2 w
60 680 492 0 l
S
Q

q
0.96 0.98 0.96 rg
60 580 492 60 re
f
0.17 0.33 0.19 RG
1 w
60 580 492 60 re
S
Q

BT
0 0 0 rg
/F2 16 Tf
60 650 Td
(INFORMATIONS DE LA COMMANDE) Tj
/F1 12 Tf
70 620 Td
(Date de commande: ${order.createdAt ? sanitize(new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })) : 'N/A'}) Tj
0 -18 Td
(Statut actuel: ${sanitize(getStatusText(order.status))}) Tj
/F2 12 Tf
0 -18 Td
(Montant total: ${order.total?.toFixed(2) || '0.00'} EUR) Tj
ET

q
0.91 0.96 0.91 rg
60 480 492 50 re
f
0.17 0.33 0.19 RG
3 w
60 480 5 50 re
f
Q

BT
0 0 0 rg
/F2 14 Tf
70 510 Td
(ETAT DE LA COMMANDE) Tj
/F1 11 Tf
0 -20 Td
(${sanitize(getStatusDescription(order.status))}) Tj
ET

${order.shippingAddress ? `q\n0.98 0.98 1 rg\n60 360 492 60 re\nf\n0.17 0.33 0.19 RG\n1 w\n60 360 492 60 re\nS\nQ\n\nBT\n0 0 0 rg\n/F2 14 Tf\n60 430 Td\n(ADRESSE DE LIVRAISON) Tj\n/F2 11 Tf\n70 400 Td\n(${sanitize(order.shippingAddress.fullName)}) Tj\n/F1 10 Tf\n0 -15 Td\n(${sanitize(order.shippingAddress.address)}) Tj\n0 -15 Td\n(${order.shippingAddress.postalCode} ${sanitize(order.shippingAddress.city)}) Tj\n${order.shippingAddress.phone ? `0 -15 Td\n(Telephone: ${order.shippingAddress.phone}) Tj\n` : ''}ET\n` : ''}

q
0.92 0.95 0.92 rg
60 ${order.shippingAddress ? '300' : '380'} 492 28 re
f
Q

BT
0 0 0 rg
/F2 16 Tf
60 ${order.shippingAddress ? '340' : '420'} Td
(ARTICLES COMMANDES) Tj
/F2 10 Tf
1 0 0 1 ${colNameX} ${order.shippingAddress ? '308' : '388'} Tm (ARTICLE) Tj
1 0 0 1 ${colQtyX} ${order.shippingAddress ? '308' : '388'} Tm (QTE) Tj
1 0 0 1 ${colUnitX} ${order.shippingAddress ? '308' : '388'} Tm (PRIX UNIT.) Tj
1 0 0 1 ${colTotalX} ${order.shippingAddress ? '308' : '388'} Tm (TOTAL) Tj
0.75 0.75 0.75 RG
1 w
60 ${order.shippingAddress ? '304' : '384'} 492 0 l
S
/F1 10 Tf
${rows}
ET

q
0.17 0.33 0.19 rg
60 ${order.shippingAddress ? (yStart - (order.items?.length || 0) * rowHeight - 30) : (yStart - (order.items?.length || 0) * rowHeight - 30)} 492 40 re
f
Q

BT
1 1 1 rg
/F3 16 Tf
1 0 0 1 ${colQtyX} ${order.shippingAddress ? (yStart - (order.items?.length || 0) * rowHeight - 10) : (yStart - (order.items?.length || 0) * rowHeight - 10)} Tm (TOTAL:) Tj
/F3 16 Tf
1 0 0 1 ${colTotalX} ${order.shippingAddress ? (yStart - (order.items?.length || 0) * rowHeight - 10) : (yStart - (order.items?.length || 0) * rowHeight - 10)} Tm (${(order.total?.toFixed(2) || '0.00') + ' EUR'}) Tj
0.5 0.5 0.5 rg
/F1 8 Tf
60 50 Td
(Document genere automatiquement par le systeme de commande) Tj
0 -12 Td
(Pour toute question, contactez notre service client) Tj
0 -12 Td
(Copyright ${new Date().getFullYear()} - Tous droits reserves) Tj
ET`;

    const encoder = new TextEncoder();
    const streamBytes = encoder.encode(streamBody);
    const streamLength = streamBytes.length;

    const pdfContent = `%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n/Resources <<\n/Font <<\n/F1 5 0 R\n/F2 6 0 R\n/F3 7 0 R\n>>\n>>\n>>\nendobj\n\n4 0 obj\n<<\n/Length ${streamLength}\n>>\nstream\n${streamBody}\nendstream\nendobj\n\n5 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n\n6 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica-Bold\n>>\nendobj\n\n7 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica-BoldOblique\n>>\nendobj\n\nxref\n0 8\n0000000000 65535 f \n0000000010 00000 n \n0000000079 00000 n \n0000000173 00000 n \n0000000301 00000 n \n0000000000 00000 n \n0000000000 00000 n \n0000000000 00000 n \ntrailer\n<<\n/Size 8\n/Root 1 0 R\n>>\nstartxref\n0\n%%EOF`;

    // Créer un blob PDF et le télécharger automatiquement
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${getDocumentTitle(order.status)}_${order.id.slice(-8)}.pdf`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      setLoading(true);
      const res = await getOrderById(id);
      if (res.success) {
        setOrder(res.data);
      }
      setLoading(false);
    };
    load();
  }, [user, id]);

  if (!user) return null;

  const timelineSteps = order ? getTimelineSteps(order) : [];

  return (
    <DashboardLayout>
      <Container>
        <BackLink to="/suivi">
          <FiArrowLeft /> Retour au suivi
        </BackLink>
        
        <Title>Détails de suivi</Title>
        <Subtitle>Suivez en temps réel l'évolution de votre commande</Subtitle>

        {loading && <Card>Chargement des informations...</Card>}

        {!loading && !order && (
          <Card>Commande introuvable.</Card>
        )}

        {!loading && order && (
          <>
            <Card>
              <OrderInfo>
                <InfoRow>
                  <Label>Numéro de commande</Label>
                  <Value>#{order.id.slice(-8)}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Date de commande</Label>
                  <Value>
                    {order.createdAt 
                      ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </Value>
                </InfoRow>
                <InfoRow>
                  <Label>Montant total</Label>
                  <Value>{order.total?.toFixed(2) || '0.00'} €</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Statut</Label>
                  <Status status={order.status}>
                    {getStatusText(order.status)}
                  </Status>
                </InfoRow>
              </OrderInfo>

              {order.shippingAddress && (
                <div>
                  <Label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <FiMapPin size={16} /> Adresse de livraison
                  </Label>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <div>{order.shippingAddress.fullName}</div>
                    <div>{order.shippingAddress.address}</div>
                    <div>
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </div>
                    {order.shippingAddress.phone && (
                      <div>Tél: {order.shippingAddress.phone}</div>
                    )}
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Historique de livraison</h2>
              <Timeline>
                {timelineSteps.map((step) => (
                  <TimelineItem key={step.id} active={step.active} isLast={step.isLast}>
                    <TimelineIcon active={step.active}>
                      {step.icon}
                    </TimelineIcon>
                    <TimelineContent>
                      <TimelineTitle active={step.active}>{step.title}</TimelineTitle>
                      {step.date && <TimelineDate>{step.date}</TimelineDate>}
                      <TimelineDescription>{step.description}</TimelineDescription>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
              
              <DownloadButton onClick={generatePDF}>
                <FiDownload /> Télécharger le PDF
              </DownloadButton>
            </Card>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default SuiviItinerary;
