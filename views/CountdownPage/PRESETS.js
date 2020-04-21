const new_year = new Date(
  (new Date(new Date() - 8 * 60 * 60 * 1000).getFullYear() + 1).toString()
);
const us_election = new Date("November 3, 2020");
const christmas = new Date("December 25, " + new Date().getFullYear());

const PRESETS = {
  trump_wins_2020: {
    countdown_size: "380",
    countdown_title: "Trump Wins",
    countdown_date: us_election,
    countdown_position: "bottom",
    countdown_background_color: "",
    countdown_background_image: "https://i.imgur.com/BpA8fWK.png",
    countdown_font: "Roboto",
    countdown_shadow: "1px 1px black",
    /// red: #e00014
    countdown_color: "#0300ff",
  },
  trump_loses_2020: {
    countdown_size: "380",
    countdown_title: "End of Trump",
    countdown_date: us_election,
    countdown_position: "bottom",
    countdown_background_color: "",
    // Non-resized: https://i.imgur.com/srnUbAP.jpg
    countdown_background_image: "https://i.imgur.com/srnUbAPh.jpg",
    countdown_font: "Roboto",
    countdown_shadow: "1px 1px black",
    countdown_color: "white",
  },

  new_year: {
    countdown_size: "580",
    countdown_title: "2021",
    countdown_date: new_year,
    countdown_position: "center",
    countdown_background_color: "",
    countdown_background_image: "https://i.imgur.com/H4ZC3pZ.jpg",
    countdown_font: "Roboto",
    countdown_shadow: "0 1px 1px #000000",
    countdown_color: "#e9e9e9",
  },

  // Christmas backgrounds
  // - https://imgur.com/a/LDcQh1l
  // - https://imgur.com/a/0BZ9N2b
  // - https://imgur.com/a/72JS8Jn
  christmas: {
    countdown_size: "380",
    countdown_title: "Christmas",
    countdown_date: christmas,
    countdown_position: "top",
    countdown_background_color: "",
    countdown_background_image: "https://i.imgur.com/Px80XKC.jpg",
    countdown_font: "Roboto",
    countdown_shadow: "0 2px 2px black",
    countdown_color: "#f1f1f1",
  },
};

export default PRESETS;
