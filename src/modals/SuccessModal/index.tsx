import React, { useContext, useCallback, useState, useEffect } from 'react';

import { ThemeContext } from 'styled-components/native';
import { Wrapper, ContainerTitle, Title, LootieContainer } from './styles';
import LottieView from 'lottie-react-native';
import Button from '../../components/Button';
import { getLocalStorage, setLocalStorage } from '../../utils/localStorage';
import { useInterstitialAd, INTER_ID } from '../../services/AdMob';

import { useAuth } from '../../contexts/authContext';
import useAmplitude from '../../hooks/useAmplitude';
import { useFocusEffect } from '@react-navigation/native';
import { useModalStore } from '../../store/useModalStore';

interface ISuccessModal {
  onClose(): void;
}

const SuccessModal: React.FC<ISuccessModal> = ({ onClose }) => {
  const { logEvent } = useAmplitude();
  const { color } = useContext(ThemeContext);
  const { showBanner } = useAuth();
  const { openModal } = useModalStore(({ openModal }) => ({ openModal }));

  const { load, show, isLoaded, isClosed, error } = useInterstitialAd(INTER_ID);

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
      openModal('PLAN');
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
      onClose();
    }
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
    </>
  );
};

export default SuccessModal;
