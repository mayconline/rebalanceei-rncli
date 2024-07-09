import React, { useContext, useCallback, useState, useEffect } from 'react';
import { Modal } from 'react-native';
import { ThemeContext } from 'styled-components/native';
import { Wrapper, ContainerTitle, Title, LootieContainer } from './styles';
import LottieView from 'lottie-react-native';
import Button from '../../components/Button';
import { getLocalStorage, setLocalStorage } from '../../utils/localStorage';
import { useInterstitialAd, INTER_ID } from '../../services/AdMob';
import PlanModal from '../PlanModal';
import { useAuth } from '../../contexts/authContext';
import useAmplitude from '../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/native';

interface ISuccessModal {
  onClose(): void;
  beforeModalClose(): void;
}

const SuccessModal: React.FC<ISuccessModal> = ({
  onClose,
  beforeModalClose,
}) => {
  const { logEvent } = useAmplitude();
  const { color, gradient } = useContext(ThemeContext);
  const { showBanner } = useAuth();
  const { load, show, isLoaded, isClosed, error } = useInterstitialAd(INTER_ID);

  const [openModal, setOpenModal] = useState<'Plan' | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openAD, setOpenAd] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      logEvent('open Success modal');
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    if (isLoaded && !!openAD) {
      show();
    }
  }, [isLoaded, openAD]);

  useEffect(() => {
    if (isClosed) {
      setLoading(false);
      setOpenModal('Plan');
    }
    () => setOpenAd(false);
  }, [isClosed, isLoaded, openAD]);

  useEffect(() => {
    if (!!error) {
      setLoading(false);
    }
    () => setOpenAd(false);
  }, [error]);

  const getViewCount = useCallback(async () => {
    let viewCount = await getLocalStorage('@countView');
    return viewCount ? Number(viewCount) : 0;
  }, []);

  const setViewCount = useCallback(async () => {
    let viewCount = await getViewCount();
    viewCount += 1;

    await setLocalStorage('@countView', String(viewCount));

    return viewCount;
  }, []);

  const handleClose = useCallback(async () => {
    setLoading(true);
    const viewCount = await setViewCount();

    if (showBanner && viewCount % 4 === 0) {
      setOpenAd(true);
      logEvent('show adMob interticial');
    } else {
      setLoading(false);
      beforeModalClose();
      onClose();
    }
  }, []);

  const handleClosePlanModal = useCallback(async () => {
    setOpenModal(null);
  }, []);

  return (
    <>
      <Wrapper>
        <ContainerTitle>
          <Title>Realizado com Sucesso 🎉</Title>
        </ContainerTitle>

        <LootieContainer>
          <LottieView
            style={{
              backgroundColor: color.secondary,
              width: '80%',
              height: 200,
              flex: 1,
              alignSelf: 'center',
            }}
            source={require('../../../assets/looties/success-lootie.json')}
            autoPlay
            loop={false}
          />
        </LootieContainer>
        <Button onPress={handleClose} loading={loading} disabled={loading}>
          Concluir
        </Button>
      </Wrapper>

      {openModal === 'Plan' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={openModal === 'Plan'}
          statusBarTranslucent={true}
        >
          <PlanModal onClose={handleClosePlanModal} />
        </Modal>
      )}
    </>
  );
};

export default SuccessModal;
