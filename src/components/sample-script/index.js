
const scriptID = 'sample';
const title = 'Welcome to MyPrompter';
const snippet = `Welcome to MyPrompter, a (hopefully) easy to use teleprompter.\n\nYou can format your script by making things bold, italic, or underline. You can set the color, or the background color. \n\nYou can align center.\n\nYou can align left.\n\n\nYou can even align`;
const createdOn = 1620252563524;
const lastUpdated = 1620252563524;
const hasStar = false;
const asHTML = `<p>Welcome to MyPrompter, a (<em>hopefully</em>) easy to use teleprompter.</p><p><br></p><p>You can format your script by making things <strong>bold</strong>, <em>italic</em>, or <u>underline</u>. You can set the <span style="color: rgb(255, 153, 0);">color</span>, or the <span style="background-color: rgb(0, 102, 204);">background color</span>. </p><p><br></p><p class="ql-align-center">You can align center.</p><p class="ql-align-center"><br></p><p>You can align left.</p><p><br></p><p class="ql-align-right"><br></p><p class="ql-align-right">You can even align right.</p><p><br></p><p>It will automatically save your script locally on your device every few seconds. Support for saving to the cloud is coming in the future.</p><p><br></p><p><br></p><hr class="bookmark"><p>Adding a bookmark makes it easy to jump between sections...</p><p><br></p><p>In Prompter view, you can use keyboard shortcuts to quickly do things, they're not configurable currently, but maybe in the future. You can also change the settings of the prompter view...</p><p><br></p><hr class="bookmark"><p><strong>Jabberywocky</strong></p><p>by Lewis Carol, from Through the Looking-Glass, and What Alice Found There (1871)</p><p><br></p><p>'Twas brillig, and the slithy toves</p><p>Did gyre and gimble in the wabe;</p><p>All mimsy were the borogoves,</p><p>And the mome raths outgrabe.</p><p><br></p><p>"Beware the Jabberwock, my son!</p><p>The jaws that bite, the claws that catch!</p><p>Beware the Jubjub bird, and shun</p><p>The frumious Bandersnatch!"</p><p><br></p><p>He took his vorpal sword in hand:</p><p>Long time the manxome foe he sought—</p><p>So rested he by the Tumtum tree,</p><p>And stood awhile in thought.</p><p><br></p><p>And as in uffish thought he stood,</p><p>The Jabberwock, with eyes of flame,</p><p>Came whiffling through the tulgey wood,</p><p>And burbled as it came!</p><p><br></p><p>One, two! One, two! And through and through</p><p>The vorpal blade went snicker-snack!</p><p>He left it dead, and with its head</p><p>He went galumphing back.</p><p><br></p><p>"And hast thou slain the Jabberwock?</p><p>Come to my arms, my beamish boy!</p><p>O frabjous day! Callooh! Callay!"</p><p>He chortled in his joy.</p><p><br></p><p>'Twas brillig, and the slithy toves</p><p>Did gyre and gimble in the wabe;</p><p>All mimsy were the borogoves,</p><p>And the mome raths outgrabe.</p><p><br></p><p><br></p><hr class="bookmark"><p>This is the start of another section.</p>`;

const asQuill = {
  ops: [
    {
      insert: `Welcome to MyPrompter, a (`
    },
    {
      attributes: {
        italic: true
      },
      insert: `hopefully`
    },
    {
      insert: `) easy to use teleprompter.\n\nYou can format your script by making things `
    },
    {
      attributes: {
        bold: true
      },
      insert: `bold`
    },
    {
      insert: `, `
    },
    {
      attributes: {
        italic: true
      },
      insert: `italic`
    },
    {
      insert: `, or `
    },
    {
      attributes: {
        underline: true
      },
      insert: `underline`
    },
    {
      insert: `. You can set the `
    },
    {
      attributes: {
        color: `#ff9900`
      },
      insert: `color`
    },
    {
      insert: `, or the `
    },
    {
      attributes: {
        background: `#0066cc`
      },
      insert: `background color`
    },
    {
      insert: `. \n\nYou can align center.`
    },
    {
      attributes: {
        align: `center`
      },
      insert: `\n\n`
    },
    {
      insert: `You can align left.\n\n`
    },
    {
      attributes: {
        align: `right`
      },
      insert: `\n`
    },
    {
      insert: `You can even align right.`
    },
    {
      attributes: {
        align: `right`
      },
      insert: `\n`
    },
    {
      insert: `\nIt will automatically save your script locally on your device every few seconds. Support for saving to the cloud is coming in the future.\n\n\n`
    },
    {
      insert: {
        bookmark: true
      }
    },
    {
      insert: `Adding a bookmark makes it easy to jump between sections...\n\nIn Prompter view, you can use keyboard shortcuts to quickly do things, they're not configurable currently, but maybe in the future. You can also change the settings of the prompter view...\n\n`
    },
    {
      insert: {
        bookmark: true
      }
    },
    {
      attributes: {
        bold: true
      },
      insert: `Jabberywocky`
    },
    {
      insert: `\nby Lewis Carol, from Through the Looking-Glass, and What Alice Found There (1871)\n\n'Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe;\nAll mimsy were the borogoves,\nAnd the mome raths outgrabe.\n\n"Beware the Jabberwock, my son!\nThe jaws that bite, the claws that catch!\nBeware the Jubjub bird, and shun\nThe frumious Bandersnatch!"\n\nHe took his vorpal sword in hand:\nLong time the manxome foe he sought—\nSo rested he by the Tumtum tree,\nAnd stood awhile in thought.\n\nAnd as in uffish thought he stood,\nThe Jabberwock, with eyes of flame,\nCame whiffling through the tulgey wood,\nAnd burbled as it came!\n\nOne, two! One, two! And through and through\nThe vorpal blade went snicker-snack!\nHe left it dead, and with its head\nHe went galumphing back.\n\n"And hast thou slain the Jabberwock?\nCome to my arms, my beamish boy!\nO frabjous day! Callooh! Callay!"\nHe chortled in his joy.\n\n'Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe;\nAll mimsy were the borogoves,\nAnd the mome raths outgrabe.\n\n\n`
    },
    {
      insert: {
        bookmark: true
      }
    },
    {
      insert: `This is the start of another section.\n`
    }
  ]
};

export const sampleScriptList = {
  sample: {scriptID, title, snippet, lastUpdated, hasStar }
};

export const sampleScript = {
  scriptID, title, snippet, createdOn, lastUpdated, hasStar, asHTML, asQuill
};
