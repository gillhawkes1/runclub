module.exports = {
  sd: {
    channels: {
      heife_channels: [
        "1008443594715173024", //#summon-heife
        "996637178694213672", //#bot-testing
        "996429651050246235", //#admin-chat
        "1008443594715173024", //#staff-chat
      ],

      welcome_rules_links: "996428352443400213",
      announcements: "996428352443400214",
      admin_chat: "996429651050246235",
      staff_chat: "1008443594715173024",

      acrc_chat: "996428352443400217",
      photos: "996430436823740476",
      summon_heife: "1008443594715173024",
      udder_nonesense: "996428352443400218",
      bot_testing: "996637178694213672",
    },

    // this obj is set in util.startUp()
    // format of obj: { 'userid1': 'fname1 lname1', 'userid2': 'fname2 lname2a lname2b' }
    users: {},

    runData: {
      multiplier: 1,
      // this object is set in util.startUp()
      // format: ['fname1 lname1', 'fname2 lname2a lname2b']
      runSheetTitles: {},
    },

    currentYear: "y5",
    years: {
      lifetime: "lifetime",
      y2: "2021-2022",
      y3: "2022-2023",
      y4: "2023-2024",
      y5: "2024-2025",
      y6: "2025-2026",
      y7: "2026-2027",
    },

    adminids: [
      "332685115606171649",
      "996448684181029017",
      "358399290592329740",
    ],

    rewards: {
      15: "Sticker",
      25: "Glassware",
      50: "4-pack",
      75: "T-shirt",
      100: "$20 ACBC gift card",
      200: "$20 ACBC gift card",
      300: "$20 ACBC gift card",
      400: "$20 ACBC gift card",
      500: "$20 ACBC gift card",
      600: "$20 ACBC gift card",
      700: "$20 ACBC gift card",
      800: "$20 ACBC gift card",
      900: "$20 ACBC gift card",
      1000: "$20 ACBC gift card",
    },

    blankMilestones: [
      {
        miles: 15,
        earned: false,
        spent: false,
        text: "Sticker",
      },
      {
        miles: 25,
        earned: false,
        spent: false,
        text: "Glassware",
      },
      {
        miles: 50,
        earned: false,
        spent: false,
        text: "4-pack",
      },
      {
        miles: 75,
        earned: false,
        spent: false,
        text: "T-shirt",
      },
      {
        miles: 100,
        earned: false,
        spent: false,
        text: "$20 ACBC gift card",
      },
      {
        miles: 200,
        earned: false,
        spent: false,
        text: "$20 ACBC gift card",
      },
      {
        miles: 300,
        earned: false,
        spent: false,
        text: "$20 ACBC gift card",
      },
      {
        miles: 400,
        earned: false,
        spent: false,
        text: "$20 ACBC gift card",
      },
      {
        miles: 500,
        earned: false,
        spent: false,
        text: "$20 ACBC gift card",
      },
      {
        miles: 600,
        earned: false,
        spent: false,
        text: "$20 ACBC gift card",
      },
      {
        miles: 700,
        earned: false,
        spent: false,
        text: "$20 ACBC gift card",
      },
      {
        miles: 800,
        earned: false,
        spent: false,
        text: "$20 ACBC gift card",
      },
      {
        miles: 900,
        earned: false,
        spent: false,
        text: "$20 ACBC gift card",
      },
      {
        miles: 1000,
        earned: false,
        spent: false,
        text: "$20 ACBC gift card",
      },
    ],

    mileageRoles: [],

    guildRoles: {},

    greeting: [
      "Thanks,",
      "Welcome,",
      "Hello there,",
      "Moo moo,",
      "Moo,",
      "MOO,",
      "Thank you,",
      "Wassup,",
      "Yo",
      "Nice to meet you,",
      "Good day,",
      "Hi",
      "Hey",
      "Hello,",
      "Hiya,",
      "Ahoy,",
      "Howdy,",
      "Greetings,",
    ],

    heifeTips: [
      "Don't run into a wall.",
      "Wear your runclub shirt for $1 off on Tuesdays.",
      "Come run in the rain for double miles rewards.",
      "You can redeem your rewards at the bar.",
      "If the heat index is over 95F or temp is under 33F it's 2x miles.",
      "Fun fact: I'm a cowputer.",
      "MOO",
      "If Kevin was 3 minutes late, everything is normal.",
      "I wish they would let me behind the bar but I'm too big.",
      "Come to Food Truck Fridays!",
      "Don't forget to stretch before and after you run!",
      "I got the mooves like Jagger.",
      "Try The Outlander; it's udderly delicious.",
      "The rewards are great! Milk 'em for all they're worth!",
      "Hope your calves aren't too sore after that run!",
      "Did you know I sleep standing up? Unless I wake up and am being pushed over.",
      "I have four stomachs. It's just room for more beer.",
      'Tips from Heife: not to be confused with "Tip Heife".',
      "Where's the beef? I'm literally right here talking to you.",
      "I always found cowculus to be the most interesting subject.",
      "Did you know there are less hills on the 3.5mi route? Try it out!",
      "Cow bells make such beautiful moosic.",
      "A cow in an earthquake is a milkshake.",
      "Got beer?",
      "You know why I can't run on the pavement? I lactose.",
      "My favorite type of been is a milk stout.",
      "Enjoy $1 off your first beer on Tuesdays if you wear your Run Club shirt!",
    ],

    newRunResponse: {
      salute: [
        "Good work!",
        "Nice job!",
        "Nice work!",
        "Keep it up!",
        "I'm glad you came!",
        "Woo!",
        "Getting after it!",
        "Beastin' :muscle:.",
        "Great!",
        "Good job!",
        "Good Stuff!",
        "Let's go!",
        "Howdy doody!",
        "Good to see ya!",
        "Yee haw!",
        "Run the rack!",
        "Giddy up!",
        "MOO.",
        "MOOOOOO.",
        "Fantastic!",
        "Tremondous!",
        "Remarkable!",
        "Overwhelming? Nahhh.",
        "EZPZ.",
        "You got this!",
        "Keep on keeping on!",
        "Sending good vibes your way!",
        "One for the books!",
        "Crushing!",
        "You're done!",
        "Breathe easy, you're finished!",
        "Incredible!",
        "Sweeeeet.",
      ],

      remark: [
        "Enjoy your drink :beers:",
        "Your run was recorded :writing_hand:",
        "I've got you marked down :notepad_spiral:",
        "You're doing great! :medal:",
        "Don't forget to stretch :person_doing_cartwheel:",
        "Whatcha havin'? :cow:",
        ":person_running: <- You.",
        "I've got you recorded, because I'm a smart cowputer :cow::computer:",
        "Your run has been saved :cow:",
        "Reward yourself with a cold one! :beer:",
        "Your run is safe with me! :closed_lock_with_key:",
        "I appreciate you being here :cow:",
        "Once upon a time, I recorded your run :book:",
        "*Scribbles run down with hooves furiously*",
        "Eat mor chikin? No. Give me more runs to record! :cow:",
        "Seven maids a milkin me while I write down this run.",
        "Go join the other finished runners!",
        "I've got you recorded. Ask Mia about rewards!",
        "Run? :white_check_mark: Recorded? :white_check_mark:",
        "*Types run into database meticulously with hooves*",
        '*Pushes cow-sized glasses up to eyes* "It\'s recording time."',
        "Chic-fil-a mascot wishes he could record a run like I just did!",
        "You're marked down my friend.",
        "I've got your run locked in!",
        "Its raining, it's pouring, Heife is recordin'!",
      ],
    },

    reactions: {
      bad: [
        "Yeesh.",
        "Sorry my friend.",
        "Yikes.",
        "Oh no!",
        "Not looking good.",
        "That's not what you want to see.",
        "lol.",
        "lmao.",
        "Try again?",
        "Not gonna happen.",
        "Probs nah.",
        "Yeah no.",
        "You're not getting a moo out of me for that one.",
        "Not likely.",
        "Try again tomorrow.",
      ],

      ok: [
        "We can work with that.",
        "Not too shabby.",
        "Alright.",
        "Not great, not terrible.",
        "Could be worse. You could be a cowputer.",
        "Come on, not that terrible.",
        "Could go either way.",
        "Maybe.",
        "Mooby, just mooby",
        "Eh. Eeeh.",
        "Average.",
        "Not sure.",
        "I dunno.",
        "Mmmmmmmooooooooo. Unsure.",
      ],

      good: [
        "That's pretty likely.",
        "Most likely!",
        "Honestly, it looks good to me.",
        "Probs ya.",
        "That is true my friend.",
        "Yes.",
        "Likely!",
        ":muscle: :cow:",
        "Now that is a high chance.",
        "Wow!",
        "Yup yup.",
        "Duhyeah.",
      ],
    },

    testing: false,
  }, //end sd
};
