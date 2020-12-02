import { AdSlots } from "../../tab-utils/ads/slots";
import { AdSettings } from "../../tab-utils/ads/loadAds";

export { adSlots };

export const adSettings: AdSettings = {
  loadQuantcastConsent: true,
  loadOneTag: true,
};

const adSlots: AdSlots = [
  /*
  {
    // ct_atf_responsive
    slot_id: "8079958663",
    slot_name: "ATF",
    is_adsense: true,
  },
  {
    // ct_btf_responsive
    slot_id: "9556691865",
    slot_name: "BTF",
    is_adsense: true,
  },
  */
  /*
  {
    // ct_left_atf
    slot_id: "7889725703",
    slot_name: "LEFT_AD_ATF",
    is_adsense: true,
  },
  {
    // ct_left_btf
    slot_id: "1075920200",
    slot_name: "LEFT_AD_BTF",
    is_adsense: true,
  },
  {
    // ct_btf_2
    slot_id: "2785355600",
    slot_name: "BTF_2",
    is_adsense: true,
  },
  /*/
  {
    adName: "/21951210418/CCT//clocktab//leftvertical",
    slot_id: "div-gpt-ad-1598363422743-0",
    slot_name: "LEFT_AD_ATF",
    slotSize: [160, 600],
    sizeMapping: [
      { viewport: [920, 0], adSize: [160, 600] },
      { viewport: [0, 0], adSize: [] },
    ],
    is_gpt: true,
  },
  {
    adName: "/21951210418/CCT//clocktab//leftverticalbtf",
    slot_id: "div-gpt-ad-1598363455018-0",
    slot_name: "LEFT_AD_BTF",
    slotSize: [160, 600],
    sizeMapping: [
      { viewport: [920, 0], adSize: [160, 600] },
      { viewport: [0, 0], adSize: [] },
    ],
    is_gpt: true,
  },
  {
    adName: "/21951210418/CCT//clocktab//horizontalbtf",
    slot_id: "div-gpt-ad-1598363482235-0",
    slot_name: "BTF_2",
    slotSize: [728, 90],
    sizeMapping: [
      { viewport: [920, 0], adSize: [728, 90] },
      { viewport: [0, 0], adSize: [] },
    ],
    is_gpt: true,
  },
  //*/
];
