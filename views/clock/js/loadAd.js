import load_ad from 'tab-utils/load_ad';

export default () => {
  const AD_SLOTS = [
    {
      slotID: 'div-gpt-ad-1584752619085-0',
      slotName: '/21735472908/CLOCKTAB_leaderboard_ATF_desktop',
      slotSize: [728, 90],
    },
    {
      slotID: 'div-gpt-ad-1584752804386-0',
      slotName: '/21735472908/CLOCKTAB_leaderboard_ATF_mobile',
      slotSize: [320, 50],
    },
    {
      slotID: 'div-gpt-ad-1584752895476-0',
      slotName: '/21735472908/CLOCKTAB_leaderboard_BTF_desktop',
      slotSize: [728, 90],
    },
    {
      slotID: 'div-gpt-ad-1584752944641-0',
      slotName: '/21735472908/CLOCKTAB_leaderboard_BTF_mobile',
      slotSize: [320, 50],
    },
  ];

  load_ad(AD_SLOTS);
};
