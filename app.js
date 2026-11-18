    /* ----------------------------------------------------
       1. Web Audio API 신디사이저 사운드 시스템
       ---------------------------------------------------- */
    let audioCtx = null;
    let isSoundMuted = false;

    function ensureAudioContext() {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    function playSoundEffect(effectName) {
      if (isSoundMuted) return;
      ensureAudioContext();
      if (!audioCtx) return;

      const t = audioCtx.currentTime;

      if (effectName === 'tap') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(720, t + 0.08);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.08);
      } else if (effectName === 'select') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, t);
        osc.frequency.exponentialRampToValueAtTime(900, t + 0.12);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      } else if (effectName === 'remove') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, t);
        osc.frequency.exponentialRampToValueAtTime(280, t + 0.09);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      } else if (effectName === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.09);
          gain.gain.setValueAtTime(0.25, t + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.09 + 0.22);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t + idx * 0.09);
          osc.stop(t + idx * 0.09 + 0.25);
        });
      } else if (effectName === 'warn') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.setValueAtTime(240, t + 0.1);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      }
    }

    /* ----------------------------------------------------
       2. 냉장고 재료 카탈로그 (5개씩 6페이지 총 30종 기본 제공)
       ---------------------------------------------------- */
    const INGREDIENTS_CATALOG = [
      // 페이지 1
      { name: '달걀', icon: '🥚' },
      { name: '대파', icon: '🥬' },
      { name: '양파', icon: '🧅' },
      { name: '김치', icon: '🌶️' },
      { name: '스팸', icon: '🥫' },

      // 페이지 2
      { name: '돼지고기', icon: '🥩' },
      { name: '참치캔', icon: '🐟' },
      { name: '두부', icon: '🧈' },
      { name: '마늘', icon: '🧄' },
      { name: '치즈', icon: '🧀' },

      // 페이지 3
      { name: '감자', icon: '🥔' },
      { name: '당근', icon: '🥕' },
      { name: '밥', icon: '🍚' },
      { name: '식빵', icon: '🍞' },
      { name: '우유', icon: '🥛' },

      // 페이지 4
      { name: '라면', icon: '🍜' },
      { name: '버섯', icon: '🍄' },
      { name: '소시지', icon: '🌭' },
      { name: '청양고추', icon: '🌶️' },
      { name: '새우', icon: '🦐' },

      // 페이지 5
      { name: '소고기', icon: '🥩' },
      { name: '닭고기', icon: '🍗' },
      { name: '토마토', icon: '🍅' },
      { name: '파스타면', icon: '🍝' },
      { name: '떡', icon: '🍡' },

      // 페이지 6
      { name: '베이컨', icon: '🥓' },
      { name: '양배추', icon: '🥗' },
      { name: '버터', icon: '🧈' },
      { name: '마요네즈', icon: '🧴' },
      { name: '오이', icon: '🥒' }
    ];

    /* ----------------------------------------------------
       3. 레시피 데이터베이스
       - mainIngredients: 필수 핵심 식재료 (기본 양념 제외)
       - 사용자가 선택한 재료만으로 필터링할 때 기준이 됨!
       - 소수의 재료(1~2개)만 있어도 가능한 미니멀 레시피 포함!
       ---------------------------------------------------- */
    const RECIPES_DATA = [
      // ----- [달걀/대파 기반 미니멀 & 한식] -----
      {
        id: 'egg_roll',
        name: '포슬포슬 대파 계란말이',
        cuisine: '한식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['달걀', '대파'],
        allIngredients: '달걀 3~4개, 대파 1/2대, 소금 1/3스푼, 설탕 1/3스푼, 식용유',
        photo: 'assets/egg_roll.jpg',
        fallbackEmoji: '🥚',
        quote: '도톰하고 촉촉하게 말아낸 황금빛 대파 계란말이를 추천합니다! 🥚💛',
        reason: '냉장고에 달걀과 파만 있어도 식탁이 따뜻해져요! 송송 썬 대파의 향긋함과 부드러운 달걀이 만나 실패 없는 10분 밥도둑이 완성됩니다.',
        steps: [
          '대파를 최대한 잘게 송송 다져서 준비합니다.',
          '볼에 달걀을 깨 넣고 소금, 설탕, 다진 대파를 넣어 골고루 섞어줍니다.',
          '약불로 달군 팬에 기름을 얇게 두르고 달걀물을 1/3만 부어 은은하게 익힙니다.',
          '달걀이 80% 익으면 살살 말아주고, 남은 달걀물을 이어 부어가며 도톰하게 말아줍니다.',
          '한 김 식힌 후 먹기 좋은 한입 크기로 썰어 맛있게 즐기세요!'
        ]
      },
      {
        id: 'egg_soup',
        name: '맑고 시원한 파 계란국',
        cuisine: '한식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['달걀', '대파'],
        allIngredients: '달걀 2개, 대파 1대, 국간장(또는 진간장) 1스푼, 소금 약간, 참기름 1/2스푼, 물 500ml',
        photo: 'assets/egg_soup.jpg',
        fallbackEmoji: '🍲',
        quote: '호로록 따뜻하고 맑게 속을 달래주는 초간단 파 계란국을 추천합니다! 🍲✨',
        reason: '속을 편안하게 감싸주는 따스한 국물! 달걀과 대파만으로 10분 만에 깔끔하고 깊은 국물 맛을 낼 수 있어 바쁜 아침이나 늦은 저녁에 최고예요.',
        steps: [
          '대파는 얇게 어슷썰기하고, 달걀 2개는 그릇에 가볍게 풀어둡니다.',
          '냄비에 물 500ml를 붓고 끓으면 국간장 1스푼과 소금으로 간을 맞춥니다.',
          '물이 팔팔 끓을 때 풀어둔 달걀물을 냄비 가장자리에 원을 그리듯 천천히 붓습니다.',
          '달걀이 몽글몽글 떠오를 때까지 젓지 말고 기다리다가 대파를 듬뿍 넣습니다.',
          '불을 끄고 참기름과 후추를 톡톡 뿌려 시원하게 드세요!'
        ]
      },
      {
        id: 'egg_rice',
        name: '고소한 버터 간장 계란밥',
        cuisine: '한식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['달걀', '밥'],
        allIngredients: '따뜻한 밥 1공기, 달걀 1~2개, 버터(또는 참기름) 1스푼, 진간장 1~2스푼',
        photo: 'assets/egg_rice.jpg',
        fallbackEmoji: '🍳',
        quote: '어릴 적 추억이 방울방울 고소한 버터 간장 계란밥을 추천합니다! 🍳🍚',
        reason: '한국인이라면 누구나 사랑하는 초간단 필승 조합! 반숙 노른자를 톡 터뜨려 버터와 간장에 비벼 먹으면 그 어떤 산해진미도 부럽지 않아요.',
        steps: [
          '팬에 기름을 두르고 달걀을 반숙으로 부쳐냅니다.',
          '따뜻한 밥 한가운데에 버터 한 조각을 넣어 밥의 온기로 녹입니다.',
          '부쳐낸 반숙 계란후라이를 밥 위에 얹습니다.',
          '진간장과 참기름을 취향껏 두르고 쓱쓱 비벼 맛있게 드세요!'
        ]
      },
      {
        id: 'scallion_egg_fry',
        name: '파기름 황금 계란 볶음밥',
        cuisine: '중식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['달걀', '대파', '밥'],
        allIngredients: '밥 1공기, 달걀 2개, 대파 1대, 진간장 1스푼, 식용유 3스푼',
        photo: 'assets/scallion_egg_fry.jpg',
        fallbackEmoji: '🍚',
        quote: '불맛이 살아있는 10분 완성의 기적! 고슬고슬 파기름 계란 볶음밥을 추천합니다! 🥚🥢',
        reason: '냉장고에 달걀, 대파, 밥만 있으면 중식당 셰프로 변신! 대파를 볶아 만든 풍미 깊은 파기름에 달걀을 볶아 고슬고슬하게 살려낸 최고의 한 그릇이에요.',
        steps: [
          '대파를 얇게 송송 썰고, 달걀 2개는 미리 그릇에 풀어둡니다.',
          '팬에 기름을 넉넉히 두르고 대파를 센 불에 볶아 향긋한 파기름을 냅니다.',
          '파를 한쪽으로 밀고 달걀물을 부어 빠르게 저어가며 스크램블을 만듭니다.',
          '밥을 넣고 주걱을 세워 밥알이 뭉치지 않게 고슬고슬 풀어주며 센 불에서 볶습니다.',
          '간장 1스푼을 팬 가장자리에 둘러 태우듯 불향을 입히고 골고루 섞어 완성합니다!'
        ]
      },
      {
        id: 'spam_kimchi_fried_rice',
        name: '스팸 김치 볶음밥',
        cuisine: '한식',
        timeMin: 15,
        difficulty: 1,
        mainIngredients: ['김치', '스팸', '밥'],
        allIngredients: '밥 1공기, 잘 익은 김치 1컵, 스팸 1/2캔, 진간장 1스푼, 참기름 1스푼',
        photo: 'assets/spam_kimchi_rice.jpg',
        fallbackEmoji: '🥓',
        quote: '자취생의 영원한 소울푸드! 매콤짭조름한 황금 스팸 김치 볶음밥을 추천합니다! 🍳✨',
        reason: '김치와 스팸의 짭조름한 감칠맛은 실패할 수가 없죠! 고소하게 구워진 스팸과 아삭한 김치가 어우러져 한 숟가락 가득 행복을 채워줍니다.',
        steps: [
          '스팸은 주사위 모양으로 작게 깍둑썰기하고, 김치는 가위로 잘게 썰어둡니다.',
          '팬에 기름을 살짝 두르고 스팸을 노릇노릇 바삭하게 볶아 기름을 냅니다.',
          '김치와 진간장 1스푼을 넣고 센 불에서 수분이 날아가도록 달달 볶습니다.',
          '불을 줄이고 밥을 넣어 주걱으로 양념과 골고루 비벼가며 볶아줍니다.',
          '참기름을 한 바퀴 두르고 불을 끈 뒤 맛있게 즐기세요!'
        ]
      },
      {
        id: 'simple_kimchi_rice',
        name: '초간단 깔끔 김치 볶음밥',
        cuisine: '한식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['김치', '밥'],
        allIngredients: '밥 1공기, 신김치 1컵, 진간장 1스푼, 설탕 1/2스푼, 참기름 1스푼, 식용유',
        photo: 'assets/kimchi_rice.jpg',
        fallbackEmoji: '🌶️',
        quote: '신김치 하나로 완성하는 담백하고 개운한 김치 볶음밥을 추천합니다! 🌶️🍚',
        reason: '고기나 햄이 없어도 신김치 본연의 칼칼함과 감칠맛으로 훌륭한 한 끼를 뚝딱 만들 수 있어요! 설탕 반 스푼으로 신맛을 잡고 간장으로 불맛을 내보세요.',
        steps: [
          '신김치를 잘게 썰어 준비합니다.',
          '팬에 기름을 두르고 김치와 설탕 반 스푼을 넣어 달달 볶습니다.',
          '김치가 투명해지면 팬 가장자리에 간장 1스푼을 둘러 불향을 냅니다.',
          '밥을 넣고 골고루 볶아준 뒤, 마지막에 참기름을 둘러 마무리합니다!'
        ]
      },
      {
        id: 'tofu_kimchi',
        name: '고소하고 매콤한 두부 김치',
        cuisine: '한식',
        timeMin: 15,
        difficulty: 2,
        mainIngredients: ['두부', '김치'],
        allIngredients: '두부 1모, 잘 익은 김치 1컵, 설탕 1/2스푼, 진간장 1스푼, 참기름 1스푼',
        photo: 'assets/dubu_kimchi.jpg',
        fallbackEmoji: '🧈',
        quote: '따끈한 두부와 새콤달콤 볶음김치의 환상 짝꿍 두부 김치를 추천합니다! 🧈🌶️',
        reason: '담백하고 부드러운 두부에 매콤달콤 볶아낸 김치를 얹어 먹으면 밥반찬은 물론 야식으로도 칼로리 부담 없이 최고랍니다.',
        steps: [
          '두부는 끓는 물에 2~3분간 데치거나 전자레인지에 돌려 따끈하게 만든 뒤 한입 크기로 썹니다.',
          '팬에 기름을 두르고 잘게 썬 김치와 설탕, 간장을 넣어 윤기 나게 볶아줍니다.',
          '김치가 알맞게 익으면 참기름을 둘러 마무리합니다.',
          '접시에 따끈한 두부를 둘러 담고 가운데에 볶음김치를 소복하게 담아냅니다!'
        ]
      },
      {
        id: 'tofu_fry',
        name: '노릇노릇 들기름 두부 부침',
        cuisine: '한식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['두부'],
        allIngredients: '두부 1모, 들기름(또는 식용유) 2스푼, 소금 약간, 진간장 2스푼(양념장용)',
        photo: 'assets/dubu_kimchi.jpg',
        fallbackEmoji: '🧈',
        quote: '겉은 바삭 속은 촉촉! 담백함의 끝판왕 노릇노릇 두부 부침을 추천합니다! 🧈✨',
        reason: '냉장고에 두부만 덩그러니 있어도 든든한 요리가 돼요! 들기름에 노릇하게 부쳐내면 겉은 바삭하고 속은 푸딩처럼 부드러워 담백하고 영양도 만점입니다.',
        steps: [
          '두부는 도톰한 두께로 썰고 키친타월로 물기를 톡톡 닦아낸 뒤 소금을 살짝 뿌립니다.',
          '팬에 기름을 넉넉히 두르고 중약불로 달굽니다.',
          '두부를 올리고 겉면이 황금빛으로 단단해질 때까지 은은하게 부쳐줍니다.',
          '뒤집어서 반대편도 노릇하게 구워준 뒤 간장에 콕 찍어 드세요!'
        ]
      },
      {
        id: 'tuna_mayo_rice',
        name: '초간단 고소한 참치 마요 덮밥',
        cuisine: '한식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['참치캔', '밥', '마요네즈'],
        allIngredients: '밥 1공기, 참치캔 1개, 마요네즈 2스푼, 진간장 1스푼, 설탕 1/2스푼',
        photo: 'assets/egg_rice.jpg',
        fallbackEmoji: '🐟',
        quote: '10분 만에 뚝딱 완성되는 초간단 고소함! 참치 마요 덮밥을 추천합니다! 🐟💛',
        reason: '참치캔 하나와 마요네즈만 있으면 준비 끝! 짭조름한 간장 소스와 고소한 참치마요가 밥알과 어우러져 한 그릇을 순식간에 비우게 만듭니다.',
        steps: [
          '참치캔의 기름을 가볍게 따라내고 마요네즈와 후추를 섞어 버무립니다.',
          '따뜻한 밥 위에 간장 1스푼을 살짝 둘러 밑간을 합니다.',
          '버무린 참치를 밥 위에 소복하게 올립니다.',
          '마요네즈를 지그재그로 예쁘게 뿌려 골고루 비벼 드세요!'
        ]
      },
      {
        id: 'potato_pancake',
        name: '바삭 쫀득 100% 감자전',
        cuisine: '한식',
        timeMin: 15,
        difficulty: 2,
        mainIngredients: ['감자'],
        allIngredients: '감자 2개, 소금 1/2스푼, 식용유 넉넉히',
        photo: 'assets/korean_pancake.jpg',
        fallbackEmoji: '🥔',
        quote: '겉은 파삭하고 속은 쫀득쫀득! 감자 본연의 맛을 담은 감자전을 추천합니다! 🥔✨',
        reason: '밀가루 없이 감자 하나만으로 만드는 마법! 감자를 갈아서 가라앉힌 전분과 함께 부쳐내면 바삭함과 쫀득함이 살아있는 최고의 별미가 탄생해요.',
        steps: [
          '감자는 껍질을 벗겨 강판이나 믹서기에 곱게 갈아줍니다.',
          '체에 밭쳐 물기를 빼고, 볼에 남은 가라앉은 하얀 전분 앙금을 감자 건더기와 섞습니다.',
          '소금 1/2스푼을 넣어 밑간을 합니다.',
          '기름을 넉넉히 두른 팬에 반죽을 얇게 펴 올리고 센 불에서 바삭하게 부쳐냅니다.',
          '가장자리가 바삭하게 익으면 뒤집어 노릇하게 구워 완성합니다!'
        ]
      },
      {
        id: 'potato_fry_banchan',
        name: '고소하고 포슬포슬한 감자채 볶음',
        cuisine: '한식',
        timeMin: 15,
        difficulty: 2,
        mainIngredients: ['감자', '양파'],
        allIngredients: '감자 2개, 양파 1/2개, 소금 1/2스푼, 식용유 2스푼, 후추 약간',
        photo: 'assets/gamja_jorim.jpg',
        fallbackEmoji: '🥔',
        quote: '식탁 위의 든든한 밥도둑 반찬! 포슬포슬 고소한 감자채 볶음을 추천합니다! 🥔🧅',
        reason: '냉장고 속 감자와 양파의 환상 짝꿍! 채 썬 감자를 찬물에 헹궈 전분기를 빼고 볶으면 부서지지 않고 아삭하면서도 포슬포슬한 맛있는 반찬이 됩니다.',
        steps: [
          '감자는 일정한 두께로 채 썰어 찬물에 5분간 담가 전분기를 뺀 뒤 물기를 뺍니다.',
          '양파도 감자와 비슷한 굵기로 채 썰어둡니다.',
          '달군 팬에 기름을 두르고 감자채를 먼저 넣어 중불에서 투명해질 때까지 볶습니다.',
          '양파를 넣고 소금과 후추로 간을 맞추며 함께 볶아줍니다.',
          '감자가 부드럽게 다 익으면 통깨를 솔솔 뿌려 담아냅니다!'
        ]
      },
      {
        id: 'scallion_ramen',
        name: '불맛 가득 파기름 라면',
        cuisine: '한식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['라면', '대파'],
        allIngredients: '라면 1봉, 대파 1대, 고춧가루 1스푼, 식용유 2스푼, 물 500ml',
        photo: 'assets/ramen_upgrade.jpg',
        fallbackEmoji: '🍜',
        quote: '대파 기름에 볶아 차원이 다른 깊은 맛! 불향 솔솔 파기름 라면을 추천합니다! 🍜🔥',
        reason: '평범한 라면의 대변신! 냄비에 대파와 고춧가루를 기름에 먼저 볶아 고추기름을 낸 뒤 끓이면 분식집이나 중식당 짬뽕보다 더 칼칼하고 깊은 국물이 완성됩니다.',
        steps: [
          '대파를 얇게 송송 썰어 준비합니다.',
          '냄비에 식용유 2스푼과 대파를 넣고 볶다가 불을 약하게 줄이고 고춧가루 1스푼을 넣어 고추기름을 냅니다.',
          '물 500ml와 라면 스프를 넣고 센 불로 끓입니다.',
          '물이 팔팔 끓어오르면 면을 넣고 꼬들꼬들하게 삶아냅니다.',
          '그릇에 담고 마지막에 대파를 살짝 올려 얼큰하게 즐기세요!'
        ]
      },
      {
        id: 'french_toast',
        name: '촉촉하고 달콤한 프렌치 토스트',
        cuisine: '양식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['식빵', '달걀', '우유'],
        allIngredients: '식빵 2장, 달걀 2개, 우유 50ml, 설탕 1스푼, 버터(또는 식용유)',
        photo: 'assets/french_toast.jpg',
        fallbackEmoji: '🍞',
        quote: '입안 가득 달콤함이 사르르~ 브런치 카페 부럽지 않은 프렌치 토스트를 추천합니다! 🍞🍯',
        reason: '식빵과 달걀, 우유만 있으면 10분 만에 카페 브런치 완성! 달걀물을 흠뻑 머금은 빵을 노릇하게 구워내면 푸딩처럼 부드러운 행복을 선사해요.',
        steps: [
          '넓은 그릇에 달걀 2개, 우유 50ml, 설탕 1스푼을 넣고 멍울 없이 곱게 풉니다.',
          '식빵을 달걀물에 푹 적셔 양면을 촉촉하게 적십니다.',
          '팬에 버터나 기름을 두르고 약불에서 식빵을 올립니다.',
          '타지 않도록 은은한 불에서 앞뒤로 노릇하게 구워냅니다.',
          '접시에 담고 꿀이나 시럽을 솔솔 뿌려 우유와 곁들여 드세요!'
        ]
      },
      {
        id: 'cheese_toast',
        name: '바삭 쫀득 그릴드 치즈 토스트',
        cuisine: '양식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['식빵', '치즈'],
        allIngredients: '식빵 2장, 치즈 2장, 버터 1스푼',
        photo: 'assets/grilled_cheese_toast.jpg',
        fallbackEmoji: '🧀',
        quote: '치즈가 폭포처럼 쭉 늘어나는 꿀맛 간식! 바삭한 그릴드 치즈 토스트를 추천합니다! 🍞🧀',
        reason: '식빵 사이에 치즈를 끼워 버터에 바삭하게 구워내면 끝! 겉은 파삭하고 속은 짭짤하고 고소한 치즈가 녹아내려 자꾸만 생각나는 맛이에요.',
        steps: [
          '식빵 겉면에 버터를 얇게 펴 바릅니다.',
          '식빵 사이에 치즈를 넉넉하게 끼워 샌드위치를 만듭니다.',
          '약불로 달군 팬에 올려 주걱으로 꾹꾹 눌러가며 굽습니다.',
          '겉이 바삭한 황금빛이 되고 치즈가 녹아내리면 대각선으로 잘라 맛있게 드세요!'
        ]
      },
      {
        id: 'aglio_olio',
        name: '깔끔하고 향긋한 알리오 올리오',
        cuisine: '양식',
        timeMin: 15,
        difficulty: 2,
        mainIngredients: ['파스타면', '마늘'],
        allIngredients: '파스타면 80g, 통마늘 6알, 올리브유(또는 식용유) 4스푼, 소금, 면수 1/2컵',
        photo: 'assets/aglio_olio.jpg',
        fallbackEmoji: '🍝',
        quote: '올리브유와 마늘의 황금 케미스트리! 담백하고 깔끔한 알리오 올리오를 추천합니다! 🍝🧄',
        reason: '파스타면과 마늘만 있어도 정통 이탈리안 레스토랑 완성! 노릇하게 구워진 마늘 기름에 면수를 더해 볶아내면 면에 착 감기는 깊은 풍미를 자랑해요.',
        steps: [
          '끓는 물에 소금을 넉넉히 넣고 파스타면을 삶아냅니다.',
          '마늘은 얇게 편 썰어 준비합니다.',
          '팬에 기름을 넉넉히 두르고 편마늘을 약불에서 노릇노릇 볶습니다.',
          '삶은 면과 면수 1/2컵을 팬에 붓고 센 불에서 팬을 흔들며 유화시킵니다.',
          '오일과 면수가 뽀얗게 어우러지면 접시에 돌돌 말아 담아냅니다!'
        ]
      },
      {
        id: 'tomato_egg_stirfry',
        name: '촉촉 새콤 토마토 달걀 볶음 (토달볶)',
        cuisine: '중식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['달걀', '토마토'],
        allIngredients: '달걀 2개, 토마토 1개, 진간장 1스푼, 설탕 1/2스푼, 식용유',
        photo: 'assets/tomato_egg_stir.jpg',
        fallbackEmoji: '🍅',
        quote: '영양 가득 새콤달콤 부드러운 맛! 황금 조합 토마토 달걀 볶음을 추천합니다! 🍅🥚',
        reason: '새콤한 토마토와 부드러운 달걀의 완벽한 조화! 칼로리는 낮고 포만감은 높아 다이어트 식단이나 가벼운 브런치로 강력 추천합니다.',
        steps: [
          '토마토는 한입 크기로 깍둑썰기하고, 달걀은 곱게 풀어둡니다.',
          '팬에 기름을 두르고 달걀물을 부어 부드러운 스크램블을 만들어 따로 덜어둡니다.',
          '같은 팬에 토마토를 넣고 볶다가 간장 1스푼, 설탕 1/2스푼을 넣어 즙이 나오도록 익힙니다.',
          '익힌 토마토에 스크램블 에그를 다시 넣고 가볍게 섞어준 뒤 불을 끕니다!'
        ]
      },
      {
        id: 'pork_onion_bokkeum',
        name: '달콤 짭조름한 돼지고기 양파 볶음',
        cuisine: '한식',
        timeMin: 15,
        difficulty: 2,
        mainIngredients: ['돼지고기', '양파'],
        allIngredients: '돼지고기 200g, 양파 1개, 진간장 2스푼, 설탕 1스푼, 다진마늘(선택) 1스푼, 참기름',
        photo: 'assets/pork_onion_stir.jpg',
        fallbackEmoji: '🥩',
        quote: '육즙과 양파의 달큰함이 가득! 단짠단짠 돼지고기 양파 볶음을 추천합니다! 🥩🧅',
        reason: '돼지고기와 양파만 볶아도 밥 두 공기 순삭! 양파에서 우러나온 천연 단맛과 짭조름한 간장 양념이 고기에 배어들어 입맛을 확 돋워줍니다.',
        steps: [
          '양파는 도톰하게 채 썰고 고기는 한입 크기로 썹니다.',
          '달군 팬에 고기를 먼저 볶아 기름을 내며 노릇하게 익힙니다.',
          '고기가 반쯤 익으면 양파를 넣고 간장 2스푼과 설탕 1스푼을 둘러 볶습니다.',
          '센 불에서 양파가 투명해질 때까지 빠르게 볶아 불향을 냅니다.',
          '참기름을 두르고 밥 위에 올려 덮밥으로 즐겨보세요!'
        ]
      },
      {
        id: 'sausage_bokkeum',
        name: '새콤달콤 소시지 야채 볶음 (쏘야)',
        cuisine: '한식',
        timeMin: 15,
        difficulty: 1,
        mainIngredients: ['소시지', '양파'],
        allIngredients: '소시지 1봉, 양파 1/2개, 케첩 2스푼, 진간장 1스푼, 설탕 1스푼',
        photo: 'assets/sausage_veg_stir.jpg',
        fallbackEmoji: '🌭',
        quote: '국민 밥반찬이자 맥주 안주! 새콤달콤 소시지 야채 볶음을 추천합니다! 🌭🧅',
        reason: '칼집 낸 소시지와 아삭한 양파의 만남! 새콤달콤한 소스에 볶아내면 아이부터 어른까지 남녀노소 누구나 좋아하는 최고의 반찬이 완성돼요.',
        steps: [
          '소시지에 사선으로 예쁘게 칼집을 내고 양파는 깍둑썰기합니다.',
          '팬에 기름을 두르고 칼집 낸 소시지를 볶아 입이 벌어지게 만듭니다.',
          '양파를 넣고 함께 볶다가 케첩 2스푼, 간장 1스푼, 설탕 1스푼을 넣습니다.',
          '양념이 골고루 배도록 중불에서 윤기 나게 졸이듯 볶아 마무리합니다!'
        ]
      },
      {
        id: 'oyakodon',
        name: '달콤 촉촉한 닭고기 달걀 덮밥 (오야코동)',
        cuisine: '일식',
        timeMin: 20,
        difficulty: 2,
        mainIngredients: ['닭고기', '달걀', '양파', '밥'],
        allIngredients: '밥 1공기, 닭고기 150g, 달걀 2개, 양파 1/2개, 간장 2스푼, 설탕 1스푼, 물 100ml',
        photo: 'assets/oyakodon.jpg',
        fallbackEmoji: '🍗',
        quote: '촉촉하고 달콤한 일본 가정식의 정석! 몽글몽글 오야코동을 추천합니다! 🍗🥚',
        reason: '닭고기와 달걀의 환상적인 케미! 부드럽게 익은 양파와 달콤짭조름한 소스가 밥알 사이사이 촉촉하게 스며들어 한 입 먹는 순간 입안이 행복해져요.',
        steps: [
          '닭고기는 한입 크기로 썰고 양파는 채 썹니다.',
          '작은 냄비에 물 100ml, 간장 2스푼, 설탕 1스푼을 넣고 끓입니다.',
          '소스가 끓으면 양파와 닭고기를 넣고 닭고기가 익을 때까지 끓입니다.',
          '풀어둔 달걀물을 둘러 붓고 뚜껑을 덮어 반숙으로 부드럽게 익힙니다.',
          '따뜻한 밥 위에 스르륵 부어 완성합니다!'
        ]
      },
      {
        id: 'gyudon',
        name: '단짠단짠 소고기 덮밥 (규동)',
        cuisine: '일식',
        timeMin: 15,
        difficulty: 2,
        mainIngredients: ['소고기', '양파', '달걀', '밥'],
        allIngredients: '밥 1공기, 얇은 소고기 150g, 양파 1/2개, 간장 2스푼, 설탕 1스푼, 물 100ml, 달걀 1개',
        photo: 'assets/gyudon.jpg',
        fallbackEmoji: '🥩',
        quote: '도쿄 골목 식당의 깊은 맛 그대로! 단짠단짠 소고기 규동을 추천합니다! 🥩🍚',
        reason: '소고기와 양파만 있으면 15분 만에 일식 전문점 완성! 얇은 소고기에 짭조름한 간장 소스가 쏙 배어들고 달걀을 올려 비벼 먹으면 든든함 최고예요.',
        steps: [
          '양파는 얇게 채 썰어 준비합니다.',
          '팬에 물 100ml, 간장 2스푼, 설탕 1스푼을 넣고 끓입니다.',
          '양파를 넣고 투명해질 때까지 2분간 익혀줍니다.',
          '소고기를 넣고 센 불에 빠르게 익혀냅니다.',
          '밥 위에 고기와 양파를 듬뿍 올리고 달걀을 얹어 완성합니다!'
        ]
      },
      {
        id: 'carbonara',
        name: '꾸덕꾸덕 베이컨 치즈 까르보나라',
        cuisine: '양식',
        timeMin: 20,
        difficulty: 3,
        mainIngredients: ['파스타면', '베이컨', '달걀', '치즈'],
        allIngredients: '파스타면 80g, 베이컨 3줄, 달걀 1~2개, 치즈가루 2스푼, 후추',
        photo: 'assets/carbonara.jpg',
        fallbackEmoji: '🧀',
        quote: '생크림 없이 정통 이탈리안 스타일로! 꾸덕꾸덕 고소한 까르보나라를 추천합니다! 🧀🥓',
        reason: '베이컨과 치즈, 달걀로 만드는 클래식 레시피! 바삭한 베이컨 기름과 크리미한 계란 노른자 소스가 어우러져 한 입 먹을 때마다 감탄이 절로 나와요.',
        steps: [
          '달걀에 치즈가루와 후추를 넣고 잘 저어 달걀 소스를 만듭니다.',
          '파스타면은 끓는 소금물에 알단테로 삶아냅니다.',
          '팬에 베이컨을 바삭하게 볶아 고소한 기름을 냅니다.',
          '삶은 면을 베이컨 팬에 넣고 가볍게 볶은 뒤 불을 완전히 끕니다.',
          '만들어둔 달걀 치즈 소스를 붓고 잔열로 재빨리 섞어 부드럽게 완성합니다!'
        ]
      },
      {
        id: 'potato_gratin',
        name: '포슬포슬 치즈 감자 그라탕',
        cuisine: '양식',
        timeMin: 30,
        difficulty: 3,
        mainIngredients: ['감자', '치즈', '우유'],
        allIngredients: '감자 2개, 치즈 넉넉히, 우유 100ml, 소금, 후추',
        photo: 'assets/potato_gratin.jpg',
        fallbackEmoji: '🥔',
        quote: '치즈가 쭉쭉 늘어나는 궁극의 따뜻함! 포근한 치즈 감자 그라탕을 추천합니다! 🥔🧀',
        reason: '감자와 치즈의 조합은 실패가 없죠! 얇게 썬 감자 사이로 부드러운 우유와 짭짤한 치즈가 녹아들어 쌀쌀한 날씨에 마음까지 훈훈하게 녹여줍니다.',
        steps: [
          '감자는 얇게 슬라이스하여 전자레인지에 3분간 살짝 익힙니다.',
          '그릇에 감자를 겹겹이 깔고 우유와 소금, 후추를 살짝 붓습니다.',
          '치즈를 소복하게 덮어줍니다.',
          '에어프라이어나 전자레인지/오븐에서 치즈가 녹아 노릇해질 때까지 구워냅니다!'
        ]
      }
      ,
      // ----- [추가 레시피 20종] -----
      {
        id: 'kimchi_jjigae',
        name: '얼큰 보글보글 김치찌개',
        cuisine: '한식',
        timeMin: 20,
        difficulty: 2,
        mainIngredients: ['김치', '돼지고기'],
        allIngredients: '잘 익은 김치 1컵, 돼지고기(삼겹살) 150g, 두부 1/2모, 대파 1대, 고춧가루 1스푼, 간장 1스푼, 물 300ml',
        photo: 'assets/kimchi_jjigae.jpg',
        fallbackEmoji: '🌶️',
        quote: '밥 한 공기 뚝딱 비우는 국민 찌개! 얼큰한 김치찌개를 추천합니다! 🌶️🍲',
        reason: '잘 익은 신김치에 돼지고기 기름이 녹아들면 세상에서 제일 맛있는 찌개가 완성돼요. 추운 날 따끈하게 한 그릇이면 행복!',
        steps: [
          '돼지고기를 먼저 팬에 볶아 기름을 냅니다.',
          '잘 익은 김치를 넣고 함께 볶아 신맛을 날립니다.',
          '물 300ml를 붓고 고춧가루, 간장으로 간을 맞춥니다.',
          '두부를 넣고 10분간 보글보글 끓입니다.',
          '대파를 송송 썰어 넣고 불을 끕니다!'
        ]
      },
      {
        id: 'doenjang_jjigae',
        name: '구수한 된장찌개',
        cuisine: '한식',
        timeMin: 20,
        difficulty: 2,
        mainIngredients: ['두부', '양파', '대파'],
        allIngredients: '두부 1/2모, 양파 1/2개, 대파 1대, 된장 1.5스푼, 고추 1개, 멸치육수(또는 물) 350ml',
        photo: 'assets/doenjang_jjigae.jpg',
        fallbackEmoji: '🍜',
        quote: '한국 집밥의 진수! 구수하고 따뜻한 된장찌개를 추천합니다! 🍜',
        reason: '된장의 깊은 발효 향과 두부의 부드러움이 조화를 이루는 한식 소울푸드예요. 밥 한 공기에 이것 하나면 충분합니다!',
        steps: [
          '냄비에 멸치육수를 붓고 끓입니다.',
          '된장을 풀어 넣고 양파, 두부를 넣습니다.',
          '10분간 중불로 끓입니다.',
          '대파와 청양고추를 넣고 한소끔 더 끓여 완성합니다!'
        ]
      },
      {
        id: 'tteokbokki',
        name: '쫄깃쫄깃 떡볶이',
        cuisine: '한식',
        timeMin: 15,
        difficulty: 1,
        mainIngredients: ['떡볶이떡', '어묵'],
        allIngredients: '떡볶이떡 200g, 어묵 2장, 대파 1/2대, 고추장 2스푼, 설탕 1스푼, 간장 1스푼, 물 300ml',
        photo: 'assets/tteokbokki.jpg',
        fallbackEmoji: '🍡',
        quote: '포장마차 감성 그대로! 달콤매콤 쫄깃한 떡볶이를 추천합니다! 🍡🌶️',
        reason: '국민 간식 떡볶이! 고추장 소스에 쫄깃한 떡이 코팅되면 한 접시가 금방 비워져요. 어묵까지 넣으면 더욱 풍성해집니다.',
        steps: [
          '물에 고추장, 설탕, 간장을 풀어 소스를 만듭니다.',
          '끓기 시작하면 떡과 어묵을 넣습니다.',
          '중불로 10분간 끓이며 소스를 떡에 골고루 입힙니다.',
          '대파를 넣고 한 번 더 졸여 완성합니다!'
        ]
      },
      {
        id: 'ramen_upgrade',
        name: '라면 업그레이드 (달걀+대파)',
        cuisine: '한식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['라면', '달걀', '대파'],
        allIngredients: '라면 1봉지, 달걀 1개, 대파 1/2대, 치즈 1장(선택)',
        photo: 'assets/ramen_upgrade.jpg',
        fallbackEmoji: '🍜',
        quote: '라면도 셰프처럼! 대파와 달걀을 더한 풍성한 라면을 추천합니다! 🍜✨',
        reason: '기본 라면에 대파와 달걀만 더해도 완전히 다른 차원의 맛이 됩니다. 간단하지만 든든하고 맛있는 한 끼!',
        steps: [
          '물을 끓이고 라면과 스프를 넣습니다.',
          '끓기 시작하면 대파를 송송 썰어 넣습니다.',
          '달걀을 넣고 취향에 따라 반숙 또는 완숙으로 익힙니다.',
          '치즈를 올려 녹이면 더욱 맛있게 완성됩니다!'
        ]
      },
      {
        id: 'japchae',
        name: '명절 단골 잡채',
        cuisine: '한식',
        timeMin: 30,
        difficulty: 3,
        mainIngredients: ['당면', '시금치', '양파', '달걀'],
        allIngredients: '당면 100g, 시금치 1줌, 양파 1/2개, 달걀 1개, 간장 2스푼, 설탕 1스푼, 참기름 1스푼',
        photo: 'assets/japchae.jpg',
        fallbackEmoji: '🥗',
        quote: '쫀득하고 고소한 명절의 맛! 집에서 만드는 잡채를 추천합니다! 🥗',
        reason: '당면에 간장과 참기름이 쏙 배어들면 집에서도 명절 느낌 물씬! 여러 채소가 어우러져 영양도 맛도 최고예요.',
        steps: [
          '당면을 뜨거운 물에 20분간 불립니다.',
          '달걀은 지단을 부쳐 채 썹니다.',
          '양파를 볶아 간장, 설탕으로 간합니다.',
          '불린 당면을 함께 볶으며 양념합니다.',
          '시금치, 달걀 지단을 넣고 참기름으로 마무리합니다!'
        ]
      },
      {
        id: 'gyeran_jjim',
        name: '뚝배기 계란찜',
        cuisine: '한식',
        timeMin: 15,
        difficulty: 1,
        mainIngredients: ['달걀', '대파'],
        allIngredients: '달걀 3개, 물(또는 멸치육수) 200ml, 소금 1/2스푼, 대파 약간',
        photo: 'assets/gyeran_jjim.jpg',
        fallbackEmoji: '🥚',
        quote: '몽글몽글 보들보들! 순두부처럼 부드러운 계란찜을 추천합니다! 🥚💛',
        reason: '뚝배기에서 보글보글 끓어오르는 계란찜은 부드럽고 고소해서 어른 아이 모두 좋아해요. 밥반찬으로 최고!',
        steps: [
          '달걀 3개를 잘 풀어 멸치육수와 소금으로 간합니다.',
          '뚝배기에 달걀물을 붓고 중불로 천천히 가열합니다.',
          '가장자리가 익으면 약불로 줄이고 뚜껑을 덮습니다.',
          '몽글몽글 익으면 대파를 올려 완성합니다!'
        ]
      },
      {
        id: 'bibimbap',
        name: '알록달록 한 그릇 비빔밥',
        cuisine: '한식',
        timeMin: 20,
        difficulty: 2,
        mainIngredients: ['밥', '달걀', '시금치', '당근'],
        allIngredients: '밥 1공기, 달걀 1개, 시금치 1줌, 당근 1/4개, 고추장 1스푼, 참기름 1스푼, 간장 약간',
        photo: 'assets/bibimbap.jpg',
        fallbackEmoji: '🍚',
        quote: '형형색색 영양 만점! 든든한 한 그릇 비빔밥을 추천합니다! 🍚🥗',
        reason: '냉장고 남은 채소를 모두 활용하는 현명한 요리! 고추장 양념에 쓱쓱 비비면 세상에서 제일 맛있는 한 그릇이 됩니다.',
        steps: [
          '시금치는 데쳐서 간장, 참기름에 무칩니다.',
          '당근은 채 썰어 소금에 살짝 볶습니다.',
          '달걀은 반숙 프라이로 준비합니다.',
          '밥 위에 각 재료를 색색이 올립니다.',
          '고추장과 참기름을 넣고 쓱쓱 비벼 먹습니다!'
        ]
      },
      {
        id: 'gamja_jorim',
        name: '달콤짭조름 감자조림',
        cuisine: '한식',
        timeMin: 20,
        difficulty: 1,
        mainIngredients: ['감자'],
        allIngredients: '감자 2개, 간장 2스푼, 설탕 1스푼, 올리고당 1스푼, 식용유, 물 100ml',
        photo: 'assets/gamja_jorim.jpg',
        fallbackEmoji: '🥔',
        quote: '밥도둑 중의 밥도둑! 달콤짭조름 감자조림을 추천합니다! 🥔✨',
        reason: '간단한 재료로 만드는 완벽한 밥반찬. 간장 소스에 윤기나게 조린 감자는 없어서 못 먹는 반찬이에요!',
        steps: [
          '감자를 깍둑썰기하여 물에 담가 전분을 뺍니다.',
          '팬에 기름을 두르고 감자를 먼저 볶습니다.',
          '물, 간장, 설탕을 넣고 조립니다.',
          '국물이 거의 없어지면 올리고당을 넣어 윤기를 냅니다!'
        ]
      },
      {
        id: 'cheese_dakgalbi',
        name: '치즈 닭갈비',
        cuisine: '한식',
        timeMin: 25,
        difficulty: 2,
        mainIngredients: ['닭고기', '양파', '치즈'],
        allIngredients: '닭고기 300g, 양파 1/2개, 치즈 1장, 고추장 1.5스푼, 간장 1스푼, 설탕 1/2스푼, 다진마늘 1스푼',
        photo: 'assets/cheese_dakgalbi.jpg',
        fallbackEmoji: '🍗',
        quote: '매콤달콤에 치즈까지! 춘천 감성 치즈 닭갈비를 추천합니다! 🍗🧀',
        reason: '닭갈비 위에 치즈가 녹아내리는 순간의 감동! 매콤한 양념과 고소한 치즈의 조합은 절대 실패 없는 메뉴예요.',
        steps: [
          '닭고기는 한입 크기로 썰고 고추장, 간장, 설탕, 마늘로 10분 재웁니다.',
          '팬을 달군 후 양파를 먼저 볶습니다.',
          '재운 닭고기를 넣고 센 불에 볶습니다.',
          '닭이 익으면 치즈를 올리고 녹입니다.',
          '치즈가 녹으면 바로 불에서 내립니다!'
        ]
      },
      {
        id: 'sundubu_jjigae',
        name: '뜨끈한 순두부찌개',
        cuisine: '한식',
        timeMin: 20,
        difficulty: 2,
        mainIngredients: ['순두부', '달걀', '대파'],
        allIngredients: '순두부 1봉, 달걀 1개, 대파 1대, 고춧가루 1스푼, 국간장 1스푼, 다진마늘 1/2스푼, 물 200ml',
        photo: 'assets/sundubu_jjigae.jpg',
        fallbackEmoji: '🥣',
        quote: '부드럽고 얼큰하게! 뜨끈한 순두부찌개를 추천합니다! 🥣🌶️',
        reason: '순두부의 부드러운 식감에 얼큰한 국물이 조화로운 메뉴예요. 달걀 하나를 톡 깨 넣으면 더욱 풍성해집니다.',
        steps: [
          '냄비에 기름을 두르고 고춧가루를 볶아 기름을 냅니다.',
          '물을 붓고 국간장, 마늘로 간을 합니다.',
          '순두부를 숟가락으로 큼직하게 덜어 넣습니다.',
          '끓으면 달걀을 깨 넣습니다.',
          '대파를 올리고 완성합니다!'
        ]
      },
      {
        id: 'miso_soup',
        name: '든든한 미소 된장국',
        cuisine: '일식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['두부', '대파'],
        allIngredients: '두부 1/4모, 대파 1/4대, 미소(또는 된장) 1스푼, 물 350ml, 가다랑어포(선택)',
        photo: 'assets/miso_soup.jpg',
        fallbackEmoji: '🍵',
        quote: '아침 한 잔으로 완벽한! 따뜻한 미소국을 추천합니다! 🍵',
        reason: '일본 가정식의 베이직 메뉴! 된장의 구수함과 부드러운 두부가 어우러져 위를 편안하게 해줍니다.',
        steps: [
          '물을 끓여 가다랑어포가 있으면 우려 육수를 냅니다.',
          '미소를 풀어 넣습니다.',
          '두부를 큐브로 썰어 넣고 살짝 끓입니다.',
          '대파를 송송 썰어 넣어 완성합니다!'
        ]
      },
      {
        id: 'yaki_udon',
        name: '야키우동 (볶음우동)',
        cuisine: '일식',
        timeMin: 15,
        difficulty: 2,
        mainIngredients: ['우동면', '양파', '베이컨'],
        allIngredients: '우동면 1봉, 베이컨 3줄, 양파 1/4개, 간장 1.5스푼, 굴소스 1스푼, 참기름, 가다랑어포',
        photo: 'assets/yaki_udon.jpg',
        fallbackEmoji: '🍝',
        quote: '쫄깃하고 불향 가득! 일본 선술집 스타일 야키우동을 추천합니다! 🍝',
        reason: '굵고 쫄깃한 우동면을 간장 소스에 볶으면 집에서도 이자카야 분위기가 납니다. 가다랑어포를 뿌리면 비주얼도 최고!',
        steps: [
          '우동면은 뜨거운 물에 살짝 삶아 준비합니다.',
          '팬에 베이컨을 볶아 기름을 냅니다.',
          '양파를 넣고 함께 볶습니다.',
          '우동면을 넣고 간장, 굴소스로 볶습니다.',
          '참기름을 두르고 가다랑어포를 뿌려 완성합니다!'
        ]
      },
      {
        id: 'tomato_pasta',
        name: '새콤달콤 토마토 파스타',
        cuisine: '양식',
        timeMin: 25,
        difficulty: 2,
        mainIngredients: ['파스타면', '토마토', '마늘'],
        allIngredients: '파스타면 80g, 토마토 1~2개, 마늘 3알, 올리브유 3스푼, 소금, 설탕 1/2스푼',
        photo: 'assets/tomato_pasta.jpg',
        fallbackEmoji: '🍅',
        quote: '상큼하고 건강하게! 생토마토로 만드는 토마토 파스타를 추천합니다! 🍅🍝',
        reason: '신선한 토마토와 마늘이 만나면 어떤 소스보다 향긋해요. 올리브유와 함께 볶으면 간단하지만 근사한 파스타 완성!',
        steps: [
          '파스타를 끓는 소금물에 알단테로 삶습니다.',
          '팬에 올리브유를 두르고 마늘을 볶아 향을 냅니다.',
          '토마토를 넣고 으깨가며 볶습니다.',
          '소금, 설탕으로 간을 맞춥니다.',
          '삶은 파스타와 면수를 넣고 볶아 완성합니다!'
        ]
      },
      {
        id: 'french_toast',
        name: '달콤한 프렌치 토스트',
        cuisine: '양식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['식빵', '달걀', '우유'],
        allIngredients: '식빵 2장, 달걀 2개, 우유 50ml, 설탕 1스푼, 버터 1스푼',
        photo: 'assets/french_toast.jpg',
        fallbackEmoji: '🍞',
        quote: '카페 브런치 부럽지 않아! 촉촉 달콤한 프렌치 토스트를 추천합니다! 🍞✨',
        reason: '식빵에 달걀물을 흠뻑 적셔 버터에 구우면 겉은 바삭하고 속은 촉촉한 완벽한 아침 식사가 됩니다.',
        steps: [
          '달걀, 우유, 설탕을 섞어 달걀물을 만듭니다.',
          '식빵을 달걀물에 충분히 적십니다.',
          '버터를 녹인 팬에 약불로 천천히 굽습니다.',
          '양면이 노릇해지면 완성합니다!'
        ]
      },
      {
        id: 'omurice',
        name: '폭신한 오므라이스',
        cuisine: '일식',
        timeMin: 20,
        difficulty: 3,
        mainIngredients: ['밥', '달걀', '양파', '케첩'],
        allIngredients: '밥 1공기, 달걀 2~3개, 양파 1/4개, 케첩 3스푼, 버터 1스푼',
        photo: 'assets/omurice.jpg',
        fallbackEmoji: '🍳',
        quote: '꿈틀꿈틀 계란이 살아있는! 추억의 오므라이스를 추천합니다! 🍳',
        reason: '케첩 볶음밥 위에 폭신한 달걀 오믈렛을 얹어 가르면 황홀한 비주얼과 맛이 완성됩니다. 아이부터 어른까지 최애 메뉴!',
        steps: [
          '버터에 양파를 볶고 밥을 넣어 케첩과 함께 볶음밥을 만듭니다.',
          '달걀을 풀어 소금으로 간합니다.',
          '버터를 녹인 팬에 달걀물을 붓고 큰 원을 그리듯 젓습니다.',
          '반숙 상태일 때 볶음밥을 넣고 감쌉니다.',
          '접시에 뒤집어 올리고 케첩을 뿌려 완성합니다!'
        ]
      },
      {
        id: 'gyeranppang',
        name: '길거리 감성 계란빵',
        cuisine: '한식',
        timeMin: 15,
        difficulty: 2,
        mainIngredients: ['달걀', '우유', '밀가루'],
        allIngredients: '달걀 3개, 우유 100ml, 밀가루 150g, 설탕 2스푼, 소금 1/4스푼, 베이킹파우더 1/2스푼, 버터',
        photo: 'assets/gyeranppang.jpg',
        fallbackEmoji: '🥐',
        quote: '겨울 길거리 추억 그대로! 따끈한 계란빵을 추천합니다! 🥐🥚',
        reason: '달달한 빵 반죽 위에 달걀을 통째로 올려 구우면 겉은 촉촉, 속은 부드러운 계란빵 완성! 에어프라이어로도 쉽게 만들어요.',
        steps: [
          '밀가루, 베이킹파우더, 설탕, 소금을 섞습니다.',
          '달걀 1개와 우유, 녹인 버터를 넣고 반죽합니다.',
          '달걀빵 틀이나 머핀 틀에 반죽을 2/3 채웁니다.',
          '남은 달걀을 반죽 위에 하나씩 깨 넣습니다.',
          '180도 에어프라이어에서 12분간 굽습니다!'
        ]
      },
      {
        id: 'stir_fried_anchovies',
        name: '고소한 멸치볶음',
        cuisine: '한식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['멸치'],
        allIngredients: '잔멸치 1줌, 간장 1스푼, 설탕 1스푼, 올리고당 1스푼, 참기름, 통깨',
        photo: 'assets/stir_fried_anchovies.jpg',
        fallbackEmoji: '🐟',
        quote: '밥도둑 반찬의 클래식! 고소달콤 멸치볶음을 추천합니다! 🐟',
        reason: '마른 멸치를 달달하게 볶으면 아이부터 어른까지 모두 좋아하는 반찬이 완성돼요. 한 번 만들면 며칠치 반찬 완료!',
        steps: [
          '팬에 기름 없이 멸치를 볶아 비린내를 날립니다.',
          '간장, 설탕, 올리고당을 넣고 고루 버무립니다.',
          '중불에서 타지 않게 볶습니다.',
          '불을 끄고 참기름과 통깨로 마무리합니다!'
        ]
      },
      {
        id: 'mushroom_butter_spaghetti',
        name: '버터 향긋 버섯 파스타',
        cuisine: '양식',
        timeMin: 20,
        difficulty: 2,
        mainIngredients: ['파스타면', '버섯', '마늘'],
        allIngredients: '파스타면 80g, 버섯 1줌, 마늘 3알, 버터 1스푼, 올리브유 2스푼, 소금, 후추, 파슬리',
        photo: 'assets/mushroom_butter_spaghetti.jpg',
        fallbackEmoji: '🍄',
        quote: '버터와 버섯의 향긋한 조화! 고급스러운 버섯 파스타를 추천합니다! 🍄🍝',
        reason: '버터에 버섯을 볶으면 집에서도 고급 레스토랑 향기가 납니다. 마늘 향까지 더하면 한 입 먹는 순간 감탄이 절로!',
        steps: [
          '파스타를 알단테로 삶습니다.',
          '팬에 올리브유와 버터를 녹이고 마늘을 볶습니다.',
          '버섯을 넣고 센 불에 볶아 수분을 날립니다.',
          '삶은 파스타와 면수를 넣고 소금, 후추로 간합니다.',
          '파슬리를 뿌려 완성합니다!'
        ]
      },
      {
        id: 'korean_pancake',
        name: '바삭한 김치전',
        cuisine: '한식',
        timeMin: 15,
        difficulty: 1,
        mainIngredients: ['김치', '밀가루'],
        allIngredients: '잘 익은 김치 1컵, 부침가루(또는 밀가루) 1컵, 물 150ml, 김치 국물 2스푼, 대파 약간, 식용유',
        photo: 'assets/korean_pancake.jpg',
        fallbackEmoji: '🥞',
        quote: '비 오는 날 생각나는 그 맛! 바삭 쫄깃 김치전을 추천합니다! 🥞🌶️',
        reason: '비 오는 날이면 절로 생각나는 김치전! 신김치로 만들수록 새콤해서 더 맛있고, 막걸리나 콜라와 환상 궁합이에요.',
        steps: [
          '김치를 잘게 썹니다.',
          '부침가루, 물, 김치 국물을 섞어 반죽합니다.',
          '김치와 대파를 넣고 섞습니다.',
          '달군 팬에 기름을 넉넉히 두르고 반죽을 붓습니다.',
          '양면을 바삭하게 구워 완성합니다!'
        ]
      },
      {
        id: 'shrimp_butter_garlic',
        name: '마늘버터 새우볶음',
        cuisine: '양식',
        timeMin: 10,
        difficulty: 1,
        mainIngredients: ['새우', '마늘'],
        allIngredients: '새우 10마리, 마늘 5알, 버터 1스푼, 간장 1스푼, 설탕 1/2스푼, 파슬리',
        photo: 'assets/shrimp_butter_garlic.jpg',
        fallbackEmoji: '🦐',
        quote: '술안주로도 반찬으로도 완벽! 고소한 마늘버터 새우를 추천합니다! 🦐🧄',
        reason: '버터에 마늘 향을 내고 새우를 볶으면 5분 만에 레스토랑 애피타이저 완성! 빵에 소스를 찍어 먹어도 최고예요.',
        steps: [
          '새우는 내장을 제거하고 씻어 물기를 뺩니다.',
          '팬에 버터를 녹이고 마늘을 볶아 향을 냅니다.',
          '새우를 넣고 센 불에 빠르게 볶습니다.',
          '간장, 설탕으로 간을 맞춥니다.',
          '파슬리를 뿌려 완성합니다!'
        ]
      }

    ];

    /* ----------------------------------------------------
       4. 앱 상태 관리 (State)
       ---------------------------------------------------- */
    const state = {
      selectedIngredients: ['달걀', '대파'], // 기본 예시
      sliderPage: 1,
      totalSliderPages: 6,
      pageSize: 5,

      selectedCuisine: null,     // '한식', '중식', '일식', '양식', '상관없어요'
      selectedCookTime: null,    // '10분', '20분', '30분', '1시간', '상관없어요'
      selectedDifficulty: 2,     // 1 ~ 5
      selectedCanBuy: null,      // '1~2개 정도 구매 가능해요', '안돼요.'

      // 추천 결과 풀 및 현재 추천 인덱스
      recommendPool: [],
      currentPoolIndex: 0
    };

    /* ----------------------------------------------------
       5. DOM 요소 연결
       ---------------------------------------------------- */
    const screens = {
      intro: document.getElementById('screen-intro'),
      input: document.getElementById('screen-input'),
      loading: document.getElementById('screen-loading'),
      result: document.getElementById('screen-result')
    };

    const toastBanner = document.getElementById('toast-banner');
    const toastMsgContent = document.getElementById('toast-msg-content');

    const btnSoundToggle = document.getElementById('btn-sound-toggle');
    const soundEmoji = document.getElementById('sound-emoji');
    const soundStatusText = document.getElementById('sound-status-text');

    const btnGotoInput = document.getElementById('btn-goto-input');

    // 슬라이더 요소
    const ingRangeSlider = document.getElementById('ing-range-slider');
    const sliderPageLabel = document.getElementById('slider-page-label');
    const sliderBtnPrev = document.getElementById('slider-btn-prev');
    const sliderBtnNext = document.getElementById('slider-btn-next');
    const sliderIngContainer = document.getElementById('slider-ing-container');

    // 직접 재료 추가
    const inputDirectIng = document.getElementById('input-direct-ing');
    const btnAddDirect = document.getElementById('btn-add-direct');
    const basketChipList = document.getElementById('basket-chip-list');
    const basketItemCount = document.getElementById('basket-item-count');

    // 옵션 그룹
    const cuisineGroup = document.getElementById('cuisine-group');
    const cooktimeGroup = document.getElementById('cooktime-group');
    const starButtonsBar = document.getElementById('star-buttons-bar');
    const diffLevelTabs = document.getElementById('diff-level-tabs');
    const diffStatusBanner = document.getElementById('diff-status-banner');
    const canbuyGroup = document.getElementById('canbuy-group');

    // 추천 버튼 & 결과 화면 버튼들
    const btnSubmitRecommend = document.getElementById('btn-submit-recommend');
    const btnTopBack = document.getElementById('btn-top-back');
    const btnNextRecipe = document.getElementById('btn-next-recipe');
    const resPoolCounter = document.getElementById('res-pool-counter');

    // 레시피 토글
    const btnToggleRecipeDetail = document.getElementById('btn-toggle-recipe-detail');
    const resRecipeDetailBox = document.getElementById('res-recipe-detail-box');
    const recipeToggleIcon = document.getElementById('recipe-toggle-icon');
    const recipeToggleText = document.getElementById('recipe-toggle-text');

    // 결과 필드들
    const resSpeechQuote = document.getElementById('res-speech-quote');
    const resSpeechReason = document.getElementById('res-speech-reason');
    const resMissingAlert = document.getElementById('res-missing-alert');
    const resMissingText = document.getElementById('res-missing-text');
    const resDishImg = document.getElementById('res-dish-img');
    const resDishFallback = document.getElementById('res-dish-fallback');
    const resFallbackIcon = document.getElementById('res-fallback-icon');
    const resCookTimeVal = document.getElementById('res-cook-time-val');
    const resStarsRender = document.getElementById('res-stars-render');
    const resDiffName = document.getElementById('res-diff-name');
    const resIngredientsListText = document.getElementById('res-ingredients-list-text');
    const resStepsFlowContainer = document.getElementById('res-steps-flow-container');

    /* ----------------------------------------------------
       6. 유틸리티 함수 (화면 전환, 토스트, 효과음 제어)
       ---------------------------------------------------- */
    function showScreen(screenKey) {
      Object.keys(screens).forEach(key => {
        screens[key].classList.remove('active');
      });
      if (screens[screenKey]) {
        screens[screenKey].classList.add('active');
        screens[screenKey].scrollTop = 0;
      }
    }

    let toastTimeout = null;
    function triggerToast(text, playSound = 'warn') {
      toastMsgContent.innerText = text;
      toastBanner.classList.add('visible');
      if (playSound) {
        playSoundEffect(playSound);
      }
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toastBanner.classList.remove('visible');
      }, 2500);
    }

    btnSoundToggle.addEventListener('click', () => {
      isSoundMuted = !isSoundMuted;
      if (!isSoundMuted) {
        soundEmoji.innerText = '🔊';
        soundStatusText.innerText = '효과음 ON';
        playSoundEffect('select');
      } else {
        soundEmoji.innerText = '🔇';
        soundStatusText.innerText = '효과음 OFF';
      }
    });

    /* ----------------------------------------------------
       7. 냉장고 재료 슬라이더 (5개씩 보기) 로직
       ---------------------------------------------------- */
    function renderSliderPage(pageNum) {
      state.sliderPage = pageNum;
      ingRangeSlider.value = pageNum;
      sliderPageLabel.innerText = `${pageNum} / ${state.totalSliderPages}`;

      const startIndex = (pageNum - 1) * state.pageSize;
      const displayItems = INGREDIENTS_CATALOG.slice(startIndex, startIndex + state.pageSize);

      sliderIngContainer.innerHTML = '';

      displayItems.forEach(item => {
        const isSelected = state.selectedIngredients.includes(item.name);
        const card = document.createElement('div');
        card.className = `ing-card-item ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
          <div class="ing-icon">${item.icon}</div>
          <div class="ing-name">${item.name}</div>
        `;

        card.addEventListener('click', () => {
          toggleIngredientItem(item.name);
        });

        sliderIngContainer.appendChild(card);
      });
    }

    ingRangeSlider.addEventListener('input', (e) => {
      const page = parseInt(e.target.value, 10);
      renderSliderPage(page);
      playSoundEffect('tap');
    });

    sliderBtnPrev.addEventListener('click', () => {
      let prevPage = state.sliderPage - 1;
      if (prevPage < 1) prevPage = state.totalSliderPages;
      renderSliderPage(prevPage);
      playSoundEffect('tap');
    });

    sliderBtnNext.addEventListener('click', () => {
      let nextPage = state.sliderPage + 1;
      if (nextPage > state.totalSliderPages) nextPage = 1;
      renderSliderPage(nextPage);
      playSoundEffect('tap');
    });

    function toggleIngredientItem(name) {
      const idx = state.selectedIngredients.indexOf(name);
      if (idx > -1) {
        state.selectedIngredients.splice(idx, 1);
        playSoundEffect('remove');
      } else {
        state.selectedIngredients.push(name);
        playSoundEffect('select');
      }
      renderSliderPage(state.sliderPage);
      renderBasketList();
    }

    function renderBasketList() {
      basketItemCount.innerText = state.selectedIngredients.length;
      basketChipList.innerHTML = '';

      if (state.selectedIngredients.length === 0) {
        basketChipList.innerHTML = `<span class="basket-empty-tip">아직 담긴 재료가 없어요! 위에서 쏙쏙 골라보세요.</span>`;
        return;
      }

      state.selectedIngredients.forEach(name => {
        const found = INGREDIENTS_CATALOG.find(i => i.name === name);
        const icon = found ? found.icon : '✨';

        const tag = document.createElement('div');
        tag.className = 'my-ing-tag';
        tag.innerHTML = `
          <span>${icon}</span>
          <span>${name}</span>
          <span class="tag-remove-x" title="삭제">✕</span>
        `;

        tag.querySelector('.tag-remove-x').addEventListener('click', (e) => {
          e.stopPropagation();
          toggleIngredientItem(name);
        });

        basketChipList.appendChild(tag);
      });
    }

    function handleDirectAdd() {
      const val = inputDirectIng.value.trim();
      if (!val) {
        triggerToast('추가할 재료 이름을 적어주세요! 🥕');
        return;
      }
      if (state.selectedIngredients.includes(val)) {
        triggerToast('이미 냉장고에 담긴 재료예요! 😊');
        inputDirectIng.value = '';
        return;
      }

      state.selectedIngredients.push(val);
      inputDirectIng.value = '';
      playSoundEffect('select');
      renderSliderPage(state.sliderPage);
      renderBasketList();
      triggerToast(`'${val}' 재료가 냉장고에 담겼어요! ✨`);
    }

    btnAddDirect.addEventListener('click', handleDirectAdd);
    inputDirectIng.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleDirectAdd();
    });

    /* ----------------------------------------------------
       8. 옵션 선택 바인딩
       ---------------------------------------------------- */
    function bindSingleChoiceGroup(container, onSelect) {
      const buttons = container.querySelectorAll('.choice-card-btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          playSoundEffect('tap');
          onSelect(btn.getAttribute('data-value'));
        });
      });
    }

    bindSingleChoiceGroup(cuisineGroup, (val) => {
      state.selectedCuisine = val;
    });

    bindSingleChoiceGroup(cooktimeGroup, (val) => {
      state.selectedCookTime = val;
    });

    const diffDescriptions = [
      '',
      '★ 1단계: 라면 끓이기 수준! 초보도 100% 성공 👶',
      '★★ 2단계: 가벼운 칼질과 노릇노릇 볶음 요리 🍳',
      '★★★ 3단계: 우리 집을 맛집으로 만드는 일상 밥도둑 🍲',
      '★★★★ 4단계: 특별한 날 뽐내는 정성 가득 일품요리 🥩',
      '★★★★★ 5단계: 깊은 감칠맛을 내는 마스터 셰프급 코스 👑'
    ];

    function setDifficultyLevel(level) {
      state.selectedDifficulty = level;

      starButtonsBar.querySelectorAll('.star-click-btn').forEach(btn => {
        const star = parseInt(btn.getAttribute('data-star'), 10);
        if (star <= level) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      diffLevelTabs.querySelectorAll('.diff-tab-btn').forEach(tab => {
        const tabLevel = parseInt(tab.getAttribute('data-level'), 10);
        if (tabLevel === level) tab.classList.add('selected');
        else tab.classList.remove('selected');
      });

      diffStatusBanner.innerText = diffDescriptions[level];
    }

    starButtonsBar.querySelectorAll('.star-click-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setDifficultyLevel(parseInt(btn.getAttribute('data-star'), 10));
        playSoundEffect('select');
      });
    });

    diffLevelTabs.querySelectorAll('.diff-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        setDifficultyLevel(parseInt(tab.getAttribute('data-level'), 10));
        playSoundEffect('select');
      });
    });

    bindSingleChoiceGroup(canbuyGroup, (val) => {
      state.selectedCanBuy = val;
    });

    btnGotoInput.addEventListener('click', () => {
      playSoundEffect('tap');
      showScreen('input');
    });

    /* ----------------------------------------------------
       9. 핵심 요구사항 반영: 엄격 매칭 & 추천 풀 생성 엔진
       ---------------------------------------------------- */
    // 사용자가 해당 재료를 가지고 있는지 체크 (유연 매칭)
    function userHasIngredient(requiredName, userList) {
      return userList.some(userItem => {
        return userItem.includes(requiredName) || requiredName.includes(userItem);
      });
    }

    // 선택 재료로만 즉석 동적 레시피 생성 (안돼요 모드 시 완벽 보장)
    function generateCustomRecipe(userIngredients, cuisine, difficulty) {
      const topIngredients = userIngredients.slice(0, 3);
      const name = topIngredients.join(' ') + ' 꿀맛 볶음';
      return {
        id: 'custom_dish_' + Date.now(),
        name: name,
        cuisine: cuisine === '상관없어요' ? '한식' : cuisine,
        timeMin: 15,
        difficulty: difficulty || 2,
        mainIngredients: [...topIngredients],
        allIngredients: `${topIngredients.join(', ')}, 진간장 1스푼, 참기름 1스푼, 소금/설탕 약간, 식용유`,
        photo: '',
        fallbackEmoji: '🍳',
        quote: `선택하신 재료로만 만든 맞춤 특식! 고소하고 맛있는 ${name}을 추천합니다! 🍳✨`,
        reason: `부족한 재료 구매 없이, 오직 선택하신 [${topIngredients.join(', ')}]만 쏙쏙 골라 담아 만든 100% 안심 맞춤 요리예요! 집에 있는 기본 조미료(간장, 소금, 참기름)로 달달 볶아 감칠맛을 최대로 끌어올렸답니다.`,
        steps: [
          `준비한 [${topIngredients.join(', ')}] 재료를 깨끗이 손질하여 먹기 좋은 크기로 썰어둡니다.`,
          '팬에 기름을 살짝 두르고 중간 불에서 재료들을 순서대로 넣어 볶아줍니다.',
          '진간장 1스푼과 설탕/소금을 살짝 넣어 재료에 간이 배도록 달달 볶아줍니다.',
          '재료가 부드럽고 노릇하게 익으면 불을 끄고 참기름을 둘러 고소함을 더합니다.',
          '접시에 예쁘게 담아 따뜻할 때 맛있게 드세요!'
        ],
        missing: []
      };
    }

    function buildRecommendationPool() {
      const { selectedIngredients, selectedCuisine, selectedCookTime, selectedDifficulty, selectedCanBuy } = state;
      const isStrictNoBuy = selectedCanBuy === '안돼요.';

      let pool = [];

      RECIPES_DATA.forEach(recipe => {
        // (1) 음식 종류 필터
        if (selectedCuisine && selectedCuisine !== '상관없어요') {
          if (recipe.cuisine !== selectedCuisine) return;
        }

        // (2) 재료 매칭 검사
        const missingIngredients = [];
        recipe.mainIngredients.forEach(reqIng => {
          if (!userHasIngredient(reqIng, selectedIngredients)) {
            missingIngredients.push(reqIng);
          }
        });

        // "부족한 재료 구매 가능하지 않을 경우 선택한 재료로만 만들어줘.
        // 그리고 선택한 재료를 모두 사용할 필요는 없어."
        if (isStrictNoBuy) {
          // 부족한 재료가 단 1개라도 있으면 탈락!
          if (missingIngredients.length > 0) return;
        } else {
          // 1~2개 정도 구매 가능할 경우
          if (missingIngredients.length > 2) return;
        }

        // (3) 스코어 계산 (우선순위)
        let score = 0;

        // 재료 사용 개수
        const usedCount = recipe.mainIngredients.length - missingIngredients.length;
        score += usedCount * 20;

        // 조리시간 가중치
        // 조건: "희망 조리시간이 상관없을 경우, 원하는 음식의 종류와 냉장고 재료를 우선순위로 하여 레시피를 추천해줘."
        if (selectedCookTime === '상관없어요') {
          score += usedCount * 10;
        } else if (selectedCookTime === '10분') {
          if (recipe.timeMin <= 12) score += 30;
          else if (recipe.timeMin <= 20) score += 5;
          else score -= 20;
        } else if (selectedCookTime === '20분') {
          if (recipe.timeMin <= 22) score += 30;
          else if (recipe.timeMin <= 30) score += 10;
          else score -= 15;
        } else if (selectedCookTime === '30분') {
          if (recipe.timeMin <= 35) score += 25;
          else score -= 15;
        } else if (selectedCookTime === '1시간') {
          if (recipe.timeMin >= 25) score += 25;
          else score += 10;
        }

        // 난이도 가중치
        const diffDistance = Math.abs(recipe.difficulty - selectedDifficulty);
        score += Math.max(0, 15 - diffDistance * 4);

        // 부족한 재료가 적을수록 높은 점수
        score -= missingIngredients.length * 15;

        pool.push({
          ...recipe,
          score,
          missing: missingIngredients
        });
      });

      // 점수 내림차순 정렬
      pool.sort((a, b) => b.score - a.score);

      // 만약 '안돼요.' 모드인데 카탈로그 레시피 중 100% 매칭되는 게 없는 경우:
      // 사용자가 고른 재료로만 만드는 커스텀 DIY 레시피를 생성하여 무조건 선택 재료로만 요리 추천!
      if (pool.length === 0 && isStrictNoBuy && selectedIngredients.length > 0) {
        pool.push(generateCustomRecipe(selectedIngredients, selectedCuisine, selectedDifficulty));
      }

      return pool;
    }

    /* ----------------------------------------------------
       10. 유효성 검사 및 추천 제출
       ---------------------------------------------------- */
    btnSubmitRecommend.addEventListener('click', () => {
      // 1. 재료 검사
      if (state.selectedIngredients.length === 0) {
        triggerToast('앗! 냉장고에 있는 재료를 1개 이상 골라주세요! 🧺');
        return;
      }
      // 2. 음식 종류 검사
      if (!state.selectedCuisine) {
        triggerToast('먹고싶은 음식 종류를 선택해 주세요! 🍚');
        return;
      }
      // 3. 희망 조리시간 검사
      if (!state.selectedCookTime) {
        triggerToast('희망 조리시간을 선택해 주세요! ⏱️');
        return;
      }
      // 4. 구매 가능 여부 검사
      if (!state.selectedCanBuy) {
        triggerToast('부족한 재료 구매 가능 여부를 선택해 주세요! 🛒');
        return;
      }

      // 추천 후보 풀 생성
      state.recommendPool = buildRecommendationPool();
      state.currentPoolIndex = 0;

      if (state.recommendPool.length === 0) {
        triggerToast('선택한 조건에 맞는 레시피를 찾지 못했어요. 조건을 조금만 넓혀보세요! 💡');
        return;
      }

      // 로딩 화면 연출
      playSoundEffect('select');
      showScreen('loading');

      const messages = [
        '선택하신 재료로만 만들 수 있는 레시피를 엄선 중...',
        '보글보글! 황금 비율 양념을 계량하고 있어요...',
        '요리 요정이 셰프 모자를 고쳐 쓰고 정성껏 준비 중!',
        '선택하신 재료에 딱 맞는 최고의 특급 레시피 발견!'
      ];
      document.getElementById('loading-random-message').innerText = 
        messages[Math.floor(Math.random() * messages.length)];

      setTimeout(() => {
        renderCurrentResult();
        showScreen('result');
        playSoundEffect('fanfare');
      }, 1100);
    });

    /* ----------------------------------------------------
       11. 결과 화면 렌더링 & '다른 메뉴 추천' & '이전' 버튼
       ---------------------------------------------------- */
    function renderCurrentResult() {
      const pool = state.recommendPool;
      if (!pool || pool.length === 0) return;

      const recipe = pool[state.currentPoolIndex];

      // 상단 풀 카운터 (예: 1 / 3)
      resPoolCounter.innerText = `추천 ${state.currentPoolIndex + 1} / ${pool.length}`;

      // 1. 추천 멘트
      resSpeechQuote.innerHTML = recipe.quote.replace(
        recipe.name,
        `<span class="highlight-dish">${recipe.name}</span>`
      );

      // 2. 친근한 추천 이유
      resSpeechReason.innerText = recipe.reason;

      // 3. 부족한 재료 안내 (1~2개 구매 가능할 때)
      if (recipe.missing && recipe.missing.length > 0) {
        resMissingAlert.classList.add('show');
        resMissingText.innerText = `추가로 필요한 재료: ${recipe.missing.join(', ')}`;
      } else {
        resMissingAlert.classList.remove('show');
      }

      // 4. 사진 우선 표시, 실패 시 이모지 fallback
      resDishImg.src = '';
      resDishImg.style.display = 'block';
      resDishFallback.style.display = 'none';
      resDishImg.onerror = () => {
        resDishImg.style.display = 'none';
        resDishFallback.style.display = 'flex';
        resFallbackIcon.innerText = recipe.fallbackEmoji || '🍳';
      };
      resDishImg.src = recipe.photo;

      // 5. 예상 조리시간 & 난이도
      resCookTimeVal.innerText = `⏱️ 약 ${recipe.timeMin}분`;

      const fullStars = '★'.repeat(recipe.difficulty);
      const emptyStars = '☆'.repeat(5 - recipe.difficulty);
      resStarsRender.innerText = fullStars + emptyStars;

      const diffTexts = ['', '쉬움 (1단계)', '쉬움 (2단계)', '보통 (3단계)', '정성 (4단계)', '셰프급 (5단계)'];
      resDiffName.innerText = `(${diffTexts[recipe.difficulty]})`;

      // 6. 필요한 재료 목록
      resIngredientsListText.innerText = recipe.allIngredients;

      // 7. 요리 순서
      resStepsFlowContainer.innerHTML = '';
      recipe.steps.forEach((step, idx) => {
        const item = document.createElement('div');
        item.className = 'step-flow-item';
        item.innerHTML = `
          <div class="step-seq-badge">${idx + 1}</div>
          <div class="step-text-bubble">${step}</div>
        `;
        resStepsFlowContainer.appendChild(item);
      });

      // 레시피 박스는 기본 닫힘
      resRecipeDetailBox.classList.remove('show');
      recipeToggleIcon.innerText = '📖';
      recipeToggleText.innerText = '레시피 보기';
    }

    // 사진 아래 '레시피 보기' 버튼
    btnToggleRecipeDetail.addEventListener('click', () => {
      const isVisible = resRecipeDetailBox.classList.contains('show');
      if (isVisible) {
        resRecipeDetailBox.classList.remove('show');
        recipeToggleIcon.innerText = '📖';
        recipeToggleText.innerText = '레시피 보기';
        playSoundEffect('remove');
      } else {
        resRecipeDetailBox.classList.add('show');
        recipeToggleIcon.innerText = '🔼';
        recipeToggleText.innerText = '레시피 접기';
        playSoundEffect('select');
        setTimeout(() => {
          resRecipeDetailBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
      }
    });

    // 요구사항: 결과 화면 상단에 '이전' 버튼 (선택 수정할 수 있도록 이전 페이지로 넘어가기)
    btnTopBack.addEventListener('click', () => {
      playSoundEffect('tap');
      // 기존 선택값들은 state에 그대로 유지되어 있으므로 바로 input 화면으로 전환!
      showScreen('input');
    });

    // 요구사항: '다른 메뉴 추천받기' 버튼 (같은 선택 상황에서 다른 메뉴 추천)
    btnNextRecipe.addEventListener('click', () => {
      // 재료 선택 시 효과음('select')과 동일한 효과음 재생!
      playSoundEffect('select');

      const pool = state.recommendPool;
      if (!pool || pool.length <= 1) {
        triggerToast('현재 선택한 재료로 가능한 유일한 특급 레시피예요! 🌟', null);
        return;
      }

      // 다음 순위 레시피로 순환
      state.currentPoolIndex = (state.currentPoolIndex + 1) % pool.length;
      renderCurrentResult();
      triggerToast(`새로운 추천 메뉴를 불러왔어요! (${state.currentPoolIndex + 1}/${pool.length}) ✨`, null);
    });

    /* ----------------------------------------------------
       12. 초기화 실행
       ---------------------------------------------------- */
    function initialize() {
      renderSliderPage(1);
      renderBasketList();
      setDifficultyLevel(2);
    }

    initialize();
