import axios from 'axios';
import { EventProps } from 'pages/Props/Event';
import React from 'react';
import JoinButton from '../../components/Button/JoinButton';
import { useTranslation } from 'react-i18next';

/**
 * Legal Notice, like the name and owner of the site, etc.
 * @returns Legal Notice page component
 */
function Legal() {
  const { t } = useTranslation('translation'); // translation module


  return (
    <>
      {/* <CheckboxListSecondary /> */}
      
      <h1>{t("legalNotice.title")}</h1>
      <h2>{t("legalNotice.subtitles.1")}</h2>
      <p>{t("legalNotice.texts.1")}</p>
      <h2>{t("legalNotice.subtitles.2")}</h2>
      <p>{t("legalNotice.texts.2")}</p>
      <h2>{t("legalNotice.subtitles.3")}</h2>
      <p>{t("legalNotice.texts.3")}</p>
      <h2>{t("legalNotice.subtitles.4")}</h2>
      <p>{t("legalNotice.texts.4")}</p>
      <h2>{t("legalNotice.subtitles.5")}</h2>
      <p>{t("legalNotice.texts.5")}</p>
      <h2>{t("legalNotice.subtitles.6")}</h2>
      <p>{t("legalNotice.texts.6")}</p>
      <h2>{t("legalNotice.subtitles.7")}</h2>
      <p>{t("legalNotice.texts.7")}</p>
      <h2>{t("legalNotice.subtitles.8")}</h2>
      <p>{t("legalNotice.texts.8")}</p>
    </>
  );
}

export default Legal;
