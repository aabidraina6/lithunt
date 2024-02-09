const clues = [
  `A sanctuary of wisdom, a guiding light,
Where unilluminated minds take flight.
Follow the cult, where stars align,
And discover the secrets, hidden in the shrine.`,
  `Nearby the secrets hail
Showing the extent we’ve been tested
Follow the path protecting the Earth’s Veil 
To the place where machines have rested `,
  `The nexus of waste, resource, its tale told.
Where newcomers sow, and dreams unfold.
Germination whispers tales untold,
Inverted roots, where secrets hold.`,
  `In no-man's land, where hearts entwine,
Among hurried scrawls of inner conundrums,
Down the mountain's gaze, a lone soul pined,
"Why am I the last one to know about your problems?"`,
  `i will Be nice TO you since we’re staying for a while 
let’s come here to eat, cry and smile 
we’ll bond over griffiths, feynman and more 
and maybe our spins will stabilize at the door`,
  `LEt the arena roar, where the GOAT does stand,
Victor celeBRates, while the vanquished understand,
At the coliseum's cONcession, fate's demand.`,
  `In the realm of Potter's dwelling, where charms do abide,
Civil spells weave, with Innovation as our tide,
Pioneering minds, in every venture stride,
Feasting on opportunities, playing life's guide.`,
  `Ascend the steps where justice whispered
In those halls, where fates are considered
So you sow, so you reap
Life’s journey takes a new sweep`,
  `Sculpted dreams lay amidst inventor’s schemes,
Tables dance at the water’s brink,
Beneath the grand tree, silent leaves weave,
Where elders find reprieve in time's embrace.`,
  `Amidst daily scenes, where health's stories penned,
In the quiet monastery, tranquility mend,
Follow yoga's lead, where balance ascend,
Beyond the elephant's grace we extend
Noting where paths coin their trend.`,
];

const wrong = [
  `Engage in the realm of study, with minds so bright,
Roaming around endless corridors, both day and night,
Routing from open squares to hidden sites,
Or go where the Romans reside.`,
  `Wrought faces through pain and laughter 
Rest gently here and there 
Oh! Does it not feel like being drafted? 
No other can compare 
Go, go don't stop going, 
If you want your chances to be fair`,
  `One word to say to you
Two righteous deeds 
Three ominous figures 
And four nurturing seeds 
Five gorgeous women
That look up to your needs`,
  `Far far away from your lodges
Against the woes of history
Lies this spot, don't dare dodge it, 
Sitting between the trees 
Everything, everywhere all at once 
Is all that you can see`,
  `Cut in half; woe betide!
I lay helpless next to the sound of heckles and roars;
Under the ohh! So Sunny sky,
On the fringe of arid land, no more.
Grief.`,
  `I'm nastenka on this white night
You'll feel alive with time
But this bridge is here for another knight 
so be satisfied by this Flawed rhyme`,
  `Two roads diverged in a yellow wood
With Janus in between 
For paris violated Menalaus’s manhood
and here potrays the Mistaken scene`,
  `Oh dear hero, come down to the shore 
And listen as the siren roars 
For you're the best amongst the Faulty men 
Or whatever other carp that halts your sore`,
  `We may see friendly, we may seem Bad
We could be the sun to you
But every rosy sunrise is pricked by thorns
So don't lament and cry et tu`,
  `Twists and turns are now around
soon there’ll only Be Three or Five members found,
don’t chase the wrong place to run, 
Zero out your possibilities and that’s the One.`,
];

const loc = [
  2619, 9261, 191142, 91412, 1426, 9162, 1629, 241191, 21419, 6241, 8, 88,
];
const fnl = [];
for (let i = 1; i <= 11; i++) {
  const dct = {
    index: i,
    location: loc[i - 1],
    right: clues[i - 1],
    wrong: wrong,
  };
  fnl.push(dct);
}
console.log(fnl[0]);

for (var i = 0; i < 11; i++)
  fetch("http://localhost:5000/api/addclue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fnl[i]),
  }).then(async (res) => {
    const rep = await res.json();
    console.log(rep);
  });

const arr = [
  [1, 4, 9, 2, 5, 10, 3, 8, 7, 6],
  [8, 5, 3, 1, 2, 4, 10, 9, 6, 7],
  [4, 6, 9, 3, 7, 1, 5, 2, 10, 8],
  [3, 1, 5, 2, 8, 7, 10, 6, 9, 4],
  [2, 9, 4, 1, 7, 5, 8, 10, 6, 3],
  [5, 7, 8, 3, 10, 6, 2, 9, 4, 1],
  [4, 9, 6, 10, 5, 2, 8, 7, 1, 3],
  [8, 10, 2, 5, 1, 7, 6, 4, 3, 9],
  [7, 6, 10, 8, 5, 3, 4, 1, 9, 2],
  [9, 8, 7, 10, 4, 2, 1, 3, 5, 6],
];
