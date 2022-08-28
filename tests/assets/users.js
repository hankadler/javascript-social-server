import config from "../../src/config";
import images from "./images";

export default [
  {
    name: "Gutz",
    email: "gutz@email.com",
    password: config.fakePass,
    activated: true,
    about: "I like steaks & meatballs.",
    image: images.gutz,
    media: [
      {
        src: images.berserk0,
        caption: "",
        tag: "Berserk"
      },
      {
        src: images.berserk1,
        caption: "",
        tag: "Berserk"
      },
      {
        src: images.berserk4,
        caption: "",
        tag: "Berserk"
      },
      {
        src: images.berserk5,
        caption: "",
        tag: "Berserk"
      },
      {
        src: images.berserk2,
        caption: "",
        tag: "Berserk"
      }
    ],
    posts: [],
    conversations: [],
    watchlist: []
  },
  {
    name: "Griffith",
    email: "griffith@email.com",
    password: config.fakePass,
    activated: true,
    about: "Some see nothing more than life and death. They are dead, for they have no dreams.",
    image: images.griffith,
    media: [
      {
        src: images.berserk3,
        caption: "",
        tag: "Berserk"
      },
      {
        src: images.berserk6,
        caption: "",
        tag: "Berserk"
      },
      {
        src: images.berserk7,
        caption: "",
        tag: "Berserk"
      },
      {
        src: images.berserk8,
        caption: "",
        tag: "Berserk"
      }
    ],
    posts: [],
    conversations: [],
    watchlist: []
  },
  {
    name: "Cloud Strife",
    email: "cloud@email.com",
    password: config.fakePass,
    activated: true,
    about: "Before sacrificing it all, we must ask ourselves why.",
    image: images.cloud,
    media: [
      {
        src: images.ff0,
        caption: "Uno.",
        tag: "Me"
      },
      {
        src: images.ff1,
        caption: "Dos.",
        tag: "Me"
      }
    ],
    posts: [],
    conversations: [],
    watchlist: []
  },
  {
    name: "Sephiroth Crescent",
    email: "sephiroth@email.com",
    password: config.fakePass,
    activated: true,
    about: "That which lies ahead does not yet exist.",
    image: images.sephiroth,
    media: [
      {
        src: images.ff2,
        caption: "One.",
        tag: "Me"
      },
      {
        src: images.ff3,
        caption: "Two.",
        tag: "Me"
      }
    ],
    posts: [],
    conversations: [],
    watchlist: []
  },
  {
    name: "Goku",
    email: "goku@email.com",
    password: config.fakePass,
    activated: true,
    about: "If you want to improve, be content to be thought foolish and stupid.",
    image: images.goku,
    media: [
      {
        src: images.db2,
        caption: "",
        tag: "Dragon Ball"
      },
      {
        src: images.db3,
        caption: "",
        tag: "Dragon Ball"
      }
    ],
    posts: [],
    conversations: [],
    watchlist: []
  },
  {
    name: "Vegeta",
    email: "vegeta@email.com",
    password: config.fakePass,
    activated: true,
    about: (
      "What ought one to say then as each hardship comes? \nI was practicing for this, I was"
      + " training for this."
    ),
    image: images.vegeta,
    media: [
      {
        src: images.db0,
        caption: "",
        tag: "Dragon Ball"
      },
      {
        src: images.db1,
        caption: "",
        tag: "Dragon Ball"
      }
    ],
    posts: [],
    conversations: [],
    watchlist: []
  },
  {
    name: "Kenshin Himura",
    email: "kenshin@email.com",
    password: config.fakePass,
    activated: true,
    about: "The will to live is stronger than anything.",
    image: images.kenshin,
    media: [
      {
        src: images.blue,
        caption: "My blue ball.",
        tag: ""
      }
    ],
    posts: [],
    conversations: [],
    watchlist: []
  },
  {
    name: "Makoto Shishio",
    email: "makoto@email.com",
    password: config.fakePass,
    activated: true,
    about: "In this world, only the fittest survive.",
    image: images.shishio,
    media: [
      {
        src: images.red,
        caption: "My red ball.",
        tag: ""
      }
    ],
    posts: [],
    conversations: [],
    watchlist: []
  },
];
