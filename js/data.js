/* =====================================================
   文案配置区 —— 想改任何一句话 / 照片 / 时间，只动这个文件
   ===================================================== */

const CONFIG = {
  herName: "陈怡蓉",
  nickName: "YiRo",
  // 解锁时间：2026 年农历十月十三 = 公历 2026-11-21 00:00（已用万年历核对）
  // 明年要再用的话，把这里改成对应年份农历十月十三的公历日期即可
  unlockISO: "2026-11-21T00:00:00+08:00",
  unlockLunarText: "农历十月十三",
  sinceYear: 2020,
  lockTitle: "这份礼物还在充能",
  lockHint: "到点了才能拆，急也没用 😝",
  previewTip: "主人通道：在网址后加 ?preview=1 可提前预览",
};

/* —— 开场 —— */
const SCENES = {
  introTitle: "给 YiRo 的小站",
  introSub: "里面装了一点回忆、一点心里话，和一整个宇宙的生日快乐",
  enterBtn: "点我拆开 ✨",
  typed: "陈怡蓉",
  heroTag: "HAPPY BIRTHDAY",
  heroLine: "认识第 6 年 · 有时间去山里找你",
};

/* —— 时光轴：认识到现在 + 一起去过的城市 —— */
const TIMELINE = [
  {
    year: "2020",
    title: "序章",
    text: "那年认识了陈怡蓉。谁能想到，随口的一句你好，会变成往后每一年都要认真说一次的生日快乐。",
    color: "#FFD93D",
  },
  {
    year: "第 1 站",
    title: "广州",
    text: "一起路过广州。具体吃了什么记不太清了，只记得那天笑得很大声。",
    color: "#FF6B9D",
  },
  {
    year: "第 2 站",
    title: "东莞",
    text: "去过东莞。行程不长，快乐含量超标。",
    color: "#4FC3F7",
  },
  {
    year: "第 3 站",
    title: "肇庆",
    text: "去过肇庆。山和水都看过了，下次换你说：有时间去山里找你。",
    color: "#6CE5A3",
  },
  {
    year: "第 4 站",
    title: "佛山",
    text: "去过佛山。去过的地方会旧，一起去过的地方不会。",
    color: "#B39DDB",
  },
  {
    year: "2026",
    title: "现在",
    text: "第 6 年。见证了你一路的成长，说实话，我比你本人还骄傲。下一站继续，去更多更多地方。",
    color: "#FF9F43",
  },
];

/* —— 3D 翻信 —— */
const LETTER = {
  cover: "给 YiRo 的信",
  coverSub: "✉️ 点我拆开",
  paragraphs: [
    "陈怡蓉：见字如面。这封信不用回，我知道你看完会嘴角上扬。",
    "从 2020 到现在，我们认识第六年了。六年，刚好够把一个「新朋友」处成「默认置顶」。",
    "这一路我全程围观了你的成长——你比自己以为的厉害很多，这句话不接受反驳。",
    "教室里那台风琴不知道还在不在，但叮咚叮咚的那段时间，我一直记得。",
    "有空就去山里找你。你负责带路，我负责吵。",
    "生日快乐。想要的都得到，得不到的都释怀——暂时得不到的，我们明年再试一次。",
  ],
  sign: "—— 永远在你身后的好朋友",
};

/* —— 回忆转球：正面照片，背面想说的话 ——
   photo 填 null 时用 color 纯色球；想加球就往数组里加一条 */
const ORBS = [
  { photo: "photos/photo-01.jpg", tag: "小事", text: "教室里那台风琴，叮咚叮咚叮咛" },
  { photo: "photos/photo-02.jpg", tag: "暗号", text: "去鲸祺吗？" },
  { photo: "photos/photo-03.jpg", tag: "应援", text: "加油陈怡蓉，好朋友永远在你身后" },
  { photo: "photos/photo-04.jpg", tag: "愿望", text: "很想和你们去更多更多地方旅游" },
  { photo: "photos/photo-05.jpg", tag: "疯狂企划", text: "我们明天去七个地方，一次性灌完" },
  { photo: "photos/photo-06.jpg", tag: "治愈", text: "山不会走向你，但你会走向山。有空，就去山里找你。" },
  { photo: "photos/photo-07.jpg", tag: "治愈", text: "慢慢来，你已经走在自己选的路上，而且走得很好。" },
  { photo: "photos/photo-08.jpg", tag: "治愈", text: "希望你喜欢自己，像朋友们喜欢你一样多。" },
  { photo: "photos/photo-09.jpg", tag: "治愈", text: "允许一切发生，然后漂亮地接住它。" },
  { photo: "photos/photo-10.jpg", tag: "治愈", text: "愿望可能会迟到，但从不缺席。比如生日快乐，比如我。" },
  { photo: null, color: "#FF6B9D", tag: "治愈", text: "把日子过成多巴胺的颜色——快乐要看得见，也摸得着。" },
  { photo: null, color: "#4FC3F7", tag: "纪念", text: "认识你的第六年，比想象中还要好。第七年也请多关照。" },
];

/* —— 吹蜡烛 & 尾声 —— */
const CANDLE = {
  title: "许愿时间",
  micHint: "对着麦克风吹一口气，蜡烛就灭",
  clickHint: "麦克风害羞的话，直接点蜡烛",
  done: "愿望许好了吗？好，继续往下翻 🎉",
};

const FINALE = {
  title: "生日快乐，陈怡蓉",
  lines: ["愿你永远有得聊、有得吃", "有地方想去，有人等你"],
  footer: "2026 · 农历十月十三 · 永远在你身后",
  firework: "最后放一场烟花 🎆",
};
