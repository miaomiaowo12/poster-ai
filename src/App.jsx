import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import './App.css'

const STYLES = [
  { id: 'modern', name: '现代简约', emoji: '✨' },
  { id: 'retro', name: '复古风格', emoji: '🎭' },
  { id: 'cyber', name: '赛博朋克', emoji: '🌃' },
  { id: 'nature', name: '自然清新', emoji: '🌿' },
  { id: 'luxury', name: '高端奢华', emoji: '💎' },
  { id: 'playful', name: '活泼可爱', emoji: '🎨' },
]

const PLATFORMS = [
  { id: 'xiaohongshu', name: '小红书', emoji: '📕', ratio: '1/1', width: 400, height: 400, gradients: [['#ff2442', '#ff6b6b'], ['#fe2c25', '#ffc0cb'], ['#ff4d4d', '#ffb6c1']] },
  { id: 'douyin', name: '抖音', emoji: '🎵', ratio: '9/16', width: 300, height: 533, gradients: [['#25F4EE', '#FE2C55'], ['#000000', '#1a1a2e'], ['#69C9D0', '#EE1D52']] },
  { id: 'weibo', name: '微博', emoji: '🐟', ratio: '16/9', width: 533, height: 300, gradients: [['#E6162D', '#FF4500'], ['#FF69B4', '#FFB6C1'], ['#FFA500', '#FFD700']] },
  { id: 'weixinv', name: '视频号', emoji: '📹', ratio: '9/16', width: 300, height: 533, gradients: [['#07C160', '#06AE56'], ['#1AAD19', '#4CAF50'], ['#00D6BE', '#00A0E9']] },
  { id: 'instagram', name: 'Ins', emoji: '📸', ratio: '1/1', width: 400, height: 400, gradients: [['#833AB4', '#FD1D1D'], ['#405DE6', '#5851DB'], ['#E1306C', '#F77737']] },
  { id: 'twitter', name: 'X', emoji: '🐦', ratio: '16/9', width: 533, height: 300, gradients: [['#1DA1F2', '#0D8BD9'], ['#000000', '#333333'], ['#1DA1F2', '#657786']] },
  { id: 'other', name: '其他', emoji: '🔲', ratio: '9/16', width: 300, height: 533, gradients: [['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe']] },
]

const SIZES = [
  { id: 'square', name: '方形', ratio: '1/1', width: 400, height: 400 },
  { id: 'portrait', name: '竖版', ratio: '9/16', width: 300, height: 533 },
  { id: 'landscape', name: '横版', ratio: '4/3', width: 400, height: 300 },
]

const TEMPLATES = [
  { id: 'sale', name: '促销', emoji: '🏷️', title: '全场5折起', content: '限时优惠', prompt: '促销', style: 'modern', platform: 'xiaohongshu', theme: 'sale' },
  { id: 'recruit', name: '招聘', emoji: '💼', title: '高薪招聘', content: '期待加入', prompt: '招聘', style: 'modern', platform: 'weibo', theme: 'recruit' },
  { id: 'event', name: '活动', emoji: '🎉', title: '开业庆典', content: '诚邀参加', prompt: '活动', style: 'playful', platform: 'douyin', theme: 'event' },
  { id: 'food', name: '美食', emoji: '🍜', title: '新品上市', content: '限时尝鲜', prompt: '美食', style: 'nature', platform: 'xiaohongshu', theme: 'food' },
  { id: 'travel', name: '旅行', emoji: '✈️', title: '说走就走', content: '探索世界', prompt: '旅行', style: 'nature', platform: 'xiaohongshu', theme: 'travel' },
  { id: 'fitness', name: '健身', emoji: '💪', title: '健身俱乐部', content: '遇见更好的自己', prompt: '健身', style: 'cyber', platform: 'douyin', theme: 'fitness' },
  { id: 'valentine', name: '情人节', emoji: '💖', title: '情人节快乐', content: '爱你如初', prompt: '情人节', style: 'romantic', platform: 'xiaohongshu', theme: 'valentine' },
  { id: 'lantern', name: '元宵节', emoji: '🏮', title: '元宵佳节', content: '团圆美满', prompt: '元宵节', style: 'traditional', platform: 'weibo', theme: 'lantern' },
  { id: 'spring', name: '春节', emoji: '🧧', title: '新春快乐', content: '恭喜发财', prompt: '春节', style: 'traditional', platform: 'weibo', theme: 'spring' },
  { id: 'midautumn', name: '中秋节', emoji: '🥮', title: '中秋团圆', content: '月圆人圆', prompt: '中秋节', style: 'traditional', platform: 'weibo', theme: 'midautumn' },
  { id: 'christmas', name: '圣诞节', emoji: '🎄', title: '圣诞快乐', content: 'Merry Christmas', prompt: '圣诞节', style: 'festive', platform: 'instagram', theme: 'christmas' },
  { id: 'newyear', name: '新年', emoji: '🎊', title: '新年快乐', content: 'Happy New Year', prompt: '新年', style: 'festive', platform: 'weibo', theme: 'newyear' },
]

const THEMES = {
  sale: { 
    emoji: '🛒', 
    gradient: ['#ff6b6b', '#feca57'], 
    emojis: ['🏷️', '💰', '💲', '🛍️', '🎉'],
    name: '促销'
  },
  recruit: { 
    emoji: '💼', 
    gradient: ['#0984e3', '#74b9ff'], 
    emojis: ['💼', '📋', '🎯', '⭐'],
    name: '招聘'
  },
  event: { 
    emoji: '🎉', 
    gradient: ['#ff9ff3', '#feca57'], 
    emojis: ['🎉', '🎊', '🎈', '🎁'],
    name: '活动'
  },
  food: { 
    emoji: '🍜', 
    gradient: ['#ff6348', '#ffa502'], 
    emojis: ['🍜', '🍕', '🍔', '🍰', '☕'],
    name: '美食'
  },
  travel: { 
    emoji: '✈️', 
    gradient: ['#74b9ff', '#0984e3'], 
    emojis: ['✈️', '🌴', '🏖️', '🗺️', '🧳'],
    name: '旅行'
  },
  fitness: { 
    emoji: '💪', 
    gradient: ['#26de81', '#20bf6b'], 
    emojis: ['💪', '🏋️', '🏃', '🚴', '🎯'],
    name: '健身'
  },
  coffee: { 
    emoji: '☕', 
    gradient: ['#8B4513', '#D2691E'], 
    emojis: ['☕', '🍰', '🥐', '🌸'],
    name: '咖啡'
  },
  tech: { 
    emoji: '💻', 
    gradient: ['#45aaf2', '#2d98da'], 
    emojis: ['💻', '📱', '🤖', '🔬', '⚡'],
    name: '科技'
  },
  fashion: { 
    emoji: '👗', 
    gradient: ['#fd79a8', '#e84393'], 
    emojis: ['👗', '👠', '💄', '👜', '💎'],
    name: '时尚'
  },
  birthday: { 
    emoji: '🎂', 
    gradient: ['#ff7675', '#fab1a0'], 
    emojis: ['🎂', '🎁', '🎈', '🎉', '🧁'],
    name: '生日'
  },
  valentine: { 
    emoji: '💖', 
    gradient: ['#fd79a8', '#e84393'], 
    emojis: ['💖', '🌹', '💕', '💘', '💌'],
    name: '情人节'
  },
  lantern: { 
    emoji: '🏮', 
    gradient: ['#ff6b6b', '#feca57'], 
    emojis: ['🏮', '🏯', '🥮', '🌕', '🐉'],
    name: '元宵节'
  },
  spring: { 
    emoji: '🧧', 
    gradient: ['#ff6b6b', '#ffd700'], 
    emojis: ['🧧', '🧨', '🏮', '🐲', '🌸'],
    name: '春节'
  },
  midautumn: { 
    emoji: '🥮', 
    gradient: ['#f39c12', '#e74c3c'], 
    emojis: ['🥮', '🌕', '🐇', '🏮', '🌻'],
    name: '中秋节'
  },
  christmas: { 
    emoji: '🎄', 
    gradient: ['#27ae60', '#c0392b'], 
    emojis: ['🎄', '🎅', '🎁', '⛄', '🔔'],
    name: '圣诞节'
  },
  newyear: { 
    emoji: '🎊', 
    gradient: ['#e74c3c', '#f39c12'], 
    emojis: ['🎊', '🎉', '🎆', '🧧', '🕛'],
    name: '新年'
  },
}

const STYLE_CONFIGS = {
  modern: { 
    gradients: [['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe']], 
    fonts: ['Inter', 'Noto Sans SC', 'sans-serif'],
    textStyle: { shadow: '0 4px 12px rgba(0,0,0,0.3)', weight: '600' },
    decoration: 'geometric',
    decoStyle: { opacity: 0.35, borderWidth: 2 }
  },
  retro: { 
    gradients: [['#d4c5c9', '#ebe5e7'], ['#c9b8bc', '#e8e2e4'], ['#bfb3b6', '#f0eaec']], 
    fonts: ['Comic Sans MS', 'cursive', 'Noto Sans SC'],
    textStyle: { shadow: '0 2px 4px rgba(0,0,0,0.2)', weight: '400' },
    decoration: 'dots'
  },
  cyber: { 
    gradients: [['#0f0c29', '#302b63', '#24243e'], ['#000046', '#1CB5E0'], ['#1a1a2e', '#16213e']], 
    fonts: ['Orbitron', 'monospace', 'Noto Sans SC'],
    textStyle: { shadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,255,255,0.4)', weight: '700' },
    decoration: 'cyber',
    decoStyle: { steam: true, glow: true }
  },
  nature: { 
    gradients: [['#56ab2f', '#a8e063'], ['#38ef7d', '#11998e'], ['#96c93d', '#00b09b']], 
    fonts: ['Noto Sans SC', 'Inter', 'sans-serif'],
    textStyle: { shadow: '0 2px 8px rgba(0,0,0,0.2)', weight: '400' },
    decoration: 'circles'
  },
  luxury: { 
    gradients: [['#FF6B35', '#F7931E'], ['#D4AF37', '#FFD700'], ['#C41E3A', '#FFD700']], 
    fonts: ['Playfair Display', 'serif', 'Noto Sans SC'],
    textStyle: { shadow: '0 4px 16px rgba(0,0,0,0.4)', weight: '700' },
    decoration: 'geometric'
  },
  playful: { 
    gradients: [['#ffecd2', '#fcb69f'], ['#a8edea', '#fed6e3'], ['#d299c2', '#fef9d7']], 
    fonts: ['Comic Neue', 'cursive', 'Noto Sans SC'],
    textStyle: { shadow: '0 2px 4px rgba(0,0,0,0.15)', weight: '500' },
    decoration: 'dots'
  },
  romantic: { 
    gradients: [['#fd79a8', '#e84393'], ['#f8a5c2', '#f78fb3'], ['#ff9ff3', '#feca57']], 
    fonts: ['Pacifico', 'cursive', 'Noto Sans SC'],
    textStyle: { shadow: '0 2px 8px rgba(255,0,100,0.3)', weight: '400' },
    decoration: 'waves'
  },
  traditional: { 
    gradients: [['#e74c3c', '#c0392b'], ['#f39c12', '#e67e22'], ['#c0392b', '#8e44ad']], 
    fonts: ['Noto Serif SC', 'serif', 'STKaiti'],
    textStyle: { shadow: '0 3px 10px rgba(0,0,0,0.4)', weight: '600' },
    decoration: 'circles'
  },
  festive: { 
    gradients: [['#27ae60', '#c0392b'], ['#e74c3c', '#f39c12'], ['#9b59b6', '#3498db']], 
    fonts: ['Noto Sans SC', 'sans-serif'],
    textStyle: { shadow: '0 4px 12px rgba(0,0,0,0.3)', weight: '700' },
    decoration: 'dots'
  },
}

const DECORATIONS = ['circles', 'lines', 'dots', 'waves', 'geometric', 'none']
const DECO_NAMES = { circles: '圆点', lines: '线条', dots: '波点', waves: '波浪', geometric: '几何', none: '无' }

const SHARE_PLATFORMS = [
  { id: 'xiaohongshu', name: '小红书', emoji: '📕', scheme: 'xhsdiscover://', webUrl: 'https://www.xiaohongshu.com/explore', weixinUrl: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.xingin.xhs' },
  { id: 'douyin', name: '抖音', emoji: '🎵', scheme: 'snssdk1128://', webUrl: 'https://www.douyin.com', weixinUrl: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.ss.android.ugc.aweme' },
  { id: 'weixinv', name: '视频号', emoji: '📹', scheme: 'weixin://channels/', webUrl: 'https://channels.weixin.qq.com', weixinUrl: 'weixin://channels/' },
  { id: 'weibo', name: '微博', emoji: '🐟', scheme: 'sinaweibo://', webUrl: 'https://m.weibo.cn', weixinUrl: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.sina.weibo' },
]
const COLORS = ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#F8B500', '#FF7675', '#A29BFE', '#DDA0DD']
const FONTS = [
  { name: '默认', value: 'Noto Sans SC, sans-serif' },
  { name: '黑体', value: 'PingFang SC, Noto Sans SC, sans-serif' },
  { name: '宋体', value: 'Noto Serif SC, serif' },
  { name: '楷书', value: 'Ma Shan Zheng, cursive' },
  { name: '隶书', value: 'ZCOOL XiaoWei, serif' },
  { name: '草书', value: 'Liu Jian Mao Cao, cursive' },
  { name: '书法', value: 'Long Cang, cursive' },
  { name: '艺术字', value: 'ZCOOL KuaiLe, cursive' },
  { name: '毛笔', value: 'Zhi Mang Xing, cursive' },
  { name: '圆体', value: 'Comic Neue, cursive' },
  { name: '手写', value: 'Pacifico, cursive' },
]
const FONTSIZES = [16, 20, 24, 28, 32, 36, 40, 48, 56, 64]

const THEME_KEYWORDS = {
  促销: THEMES.sale,
  活动: THEMES.event,
  美食: THEMES.food,
  咖啡: THEMES.coffee,
  旅行: THEMES.travel,
  音乐: { emoji: '🎵', gradient: ['#a55eea', '#8854d0'], emojis: ['🎵', '🎸', '🎤', '🎧'] },
  健身: THEMES.fitness,
  科技: THEMES.tech,
  时尚: THEMES.fashion,
  生日: THEMES.birthday,
  情人节: THEMES.valentine,
  元宵节: THEMES.lantern,
  春节: THEMES.spring,
  中秋节: THEMES.midautumn,
  圣诞节: THEMES.christmas,
  新年: THEMES.newyear,
}
const COLOR_KEYWORDS = { 红色: ['#ff6b6b', '#ee5a5a'], 蓝色: ['#74b9ff', '#0984e3'], 绿色: ['#26de81', '#20bf6b'], 黄色: ['#feca57', '#ff9f43'], 紫色: ['#a55eea', '#8854d0'], 粉色: ['#fd79a8', '#e84393'], 橙色: ['#ffa502', '#ff6348'], 黑色: ['#2d3436', '#636e72'], 白色: ['#ffffff', '#dfe6e9'], 金色: ['#f1c40f', '#f39c12'] }

function parsePrompt(prompt) {
  const text = prompt.toLowerCase()
  let theme = { emoji: '🎨', gradient: ['#667eea', '#764ba2'] }
  let platform = null
  const platformKeywords = { xiaohongshu: ['小红书', 'xhs', 'xiaohongshu', 'redbook'], douyin: ['抖音', 'douyin', 'tiktok'], weibo: ['微博', 'weibo', 'sina'], weixinv: ['视频号', 'weixinv', 'wechat video'], instagram: ['ins', 'instagram', '照片墙'], twitter: ['twitter', 'x.com', '推特', 'twitter'] }
  for (const [key, keywords] of Object.entries(platformKeywords)) {
    if (keywords.some(k => text.includes(k))) { platform = PLATFORMS.find(p => p.id === key); break }
  }
  for (const [key, value] of Object.entries(THEME_KEYWORDS)) {
    if (text.includes(key)) { theme = value; break }
  }
  for (const [color, gradient] of Object.entries(COLOR_KEYWORDS)) {
    if (prompt.includes(color)) { theme = { ...theme, gradient }; break }
  }
  return { theme, platform }
}

function App() {
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [selectedSize, setSelectedSize] = useState('portrait')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [poster, setPoster] = useState(null)
  const [error, setError] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [shareResult, setShareResult] = useState(null)
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('none')
  const [selectedText, setSelectedText] = useState(null)
  const [textElements, setTextElements] = useState([])
  const [showGuide, setShowGuide] = useState(true)
  const [dragGuideLine, setDragGuideLine] = useState({ show: false, x: null, y: null })
  const [bgImage, setBgImage] = useState(null)
  const [showWechatTip, setShowWechatTip] = useState(false)
  const [showLongPressMenu, setShowLongPressMenu] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const posterRef = useRef(null)
  const bgInputRef = useRef(null)
  const dragItem = useRef(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const savedHistory = localStorage.getItem('posterHistory')
    const guideShown = localStorage.getItem('guideShown')
    if (savedHistory) { try { setHistory(JSON.parse(savedHistory)) } catch (e) { console.error(e) } }
    if (guideShown) { setShowGuide(false) }
  }, [])

  // 实时更新海报
  useEffect(() => {
    if (!hasGenerated || !poster) return
    if (!title.trim() && !content.trim() && !bgImage) return

    const updateTimer = setTimeout(() => {
      const styleKeys = Object.keys(STYLE_CONFIGS)
      const styleToUse = selectedStyle || poster.style
      const config = STYLE_CONFIGS[styleToUse]
      const parsed = parsePrompt(prompt)
      const decoration = config.decoration || 'geometric'
      const sizeConfig = SIZES.find(s => s.id === selectedSize) || SIZES[0]
      
      // 如果风格变化，使用新风格的渐变色；否则保持原有渐变色
      let gradient = poster.gradient
      if (selectedStyle && selectedStyle !== poster.style) {
        gradient = config.gradients[Math.floor(Math.random() * config.gradients.length)]
      }
      
      const fontSize = 36
      const themeEmojis = parsed.theme?.emojis || []
      
      // 如果风格变化，重新生成装饰元素
      let decoConfig = poster.decoConfig
      if (selectedStyle && selectedStyle !== poster.style) {
        decoConfig = generateDecoConfig(decoration)
      }
      
      const defaultElements = []
      
      if (title.trim()) { 
        const titleSize = calculateTextBoxSize(title, fontSize)
        defaultElements.push({ 
          id: 'title', 
          text: title, 
          x: poster.textElements?.find(el => el.id === 'title')?.x || 50, 
          y: poster.textElements?.find(el => el.id === 'title')?.y || 35, 
          color: '#FFFFFF', 
          fontSize, 
          fontFamily: config.fonts[0], 
          visible: true, 
          rotation: 0, 
          textAlign: 'center',
          width: titleSize.width,
          height: titleSize.height,
          textStyle: config.textStyle
        }) 
      }
      if (content.trim()) { 
        const contentSize = calculateTextBoxSize(content, fontSize * 0.5)
        defaultElements.push({ 
          id: 'content', 
          text: content, 
          x: poster.textElements?.find(el => el.id === 'content')?.x || 50, 
          y: poster.textElements?.find(el => el.id === 'content')?.y || 55, 
          color: '#FFFFFF', 
          fontSize: fontSize * 0.5, 
          fontFamily: config.fonts[0], 
          visible: true, 
          rotation: 0, 
          textAlign: 'center',
          width: contentSize.width,
          height: contentSize.height,
          textStyle: config.textStyle
        }) 
      }
      
      const updatedPoster = { 
        ...poster,
        prompt, 
        title, 
        content, 
        style: styleToUse, 
        size: sizeConfig.id, 
        gradient, 
        decoration, 
        decoConfig, 
        bgImage,
        emoji: selectedTemplate?.emoji || parsed.theme?.emoji, 
        platformEmoji: selectedTemplate?.emoji || parsed.theme?.emoji || null,
        themeEmojis, 
        textElements: defaultElements, 
        textStyle: config.textStyle,
      }
      
      setPoster(updatedPoster)
      setTextElements(defaultElements)
    }, 300)

    return () => clearTimeout(updateTimer)
  }, [title, content, prompt, selectedStyle, selectedSize, bgImage, hasGenerated])

  const hideGuide = () => { setShowGuide(false); localStorage.setItem('guideShown', 'true') }

  const saveToHistory = (newPoster) => {
    const updatedHistory = [newPoster, ...history].slice(0, 20)
    setHistory(updatedHistory)
    try { localStorage.setItem('posterHistory', JSON.stringify(updatedHistory)) } catch (e) { console.error(e) }
  }

  const applyTemplate = (template) => {
    setTitle(template.title)
    setContent(template.content)
    setPrompt(template.prompt)
    setSelectedStyle(template.style)
    setSelectedTemplate(template)
    // 不自动设置平台，让用户手动选择
  }

  const handleBgUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setBgImage(event.target.result)
        if (poster) { setPoster({ ...poster, bgImage: event.target.result }) }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeBgImage = () => {
    setBgImage(null)
    if (poster) { setPoster({ ...poster, bgImage: null }) }
  }

  const generatePoster = async () => {
    if (!title.trim() && !content.trim() && !bgImage) { 
      setError('请输入标题/文案或上传背景图')
      setTimeout(() => setError(null), 3000)
      return 
    }
    setIsGenerating(true); setError(null)
    await new Promise(resolve => setTimeout(resolve, 600))
    try {
      const styleKeys = Object.keys(STYLE_CONFIGS)
      const styleToUse = selectedStyle || styleKeys[Math.floor(Math.random() * styleKeys.length)]
      const config = STYLE_CONFIGS[styleToUse]
      const parsed = parsePrompt(prompt)
      // 始终使用当前风格配置的装饰元素
      const decoration = config.decoration || 'geometric'
      const sizeConfig = SIZES.find(s => s.id === selectedSize) || SIZES[0]
      // 优先使用风格配置的渐变色
      const gradient = config.gradients[Math.floor(Math.random() * config.gradients.length)]
      const fontSize = 36
      const themeEmojis = parsed.theme?.emojis || []
      
      const decoConfig = generateDecoConfig(decoration)
      
      const defaultElements = []
      
      if (title.trim()) { 
        const titleSize = calculateTextBoxSize(title, fontSize)
        defaultElements.push({ 
          id: 'title', 
          text: title, 
          x: 50, 
          y: 35, 
          color: '#FFFFFF', 
          fontSize, 
          fontFamily: config.fonts[0], 
          visible: true, 
          rotation: 0, 
          textAlign: 'center',
          width: titleSize.width,
          height: titleSize.height,
          textStyle: config.textStyle
        }) 
      }
      if (content.trim()) { 
        const contentSize = calculateTextBoxSize(content, fontSize * 0.5)
        defaultElements.push({ 
          id: 'content', 
          text: content, 
          x: 50, 
          y: 55, 
          color: '#FFFFFF', 
          fontSize: fontSize * 0.5, 
          fontFamily: config.fonts[0], 
          visible: true, 
          rotation: 0, 
          textAlign: 'center',
          width: contentSize.width,
          height: contentSize.height,
          textStyle: config.textStyle
        }) 
      }
      const newPoster = { 
        id: Date.now(), prompt, title, content, style: styleToUse, 
        size: sizeConfig.id, gradient, decoration, decoConfig, bgImage,
        emoji: selectedTemplate?.emoji || parsed.theme?.emoji, 
        platformEmoji: selectedTemplate?.emoji || parsed.theme?.emoji || null,
        themeEmojis, 
        textElements: defaultElements, 
        textStyle: config.textStyle,
        createdAt: new Date().toISOString(), 
        filter: 'none' 
      }
      setPoster(newPoster); setTextElements(defaultElements); saveToHistory(newPoster); setHasGenerated(true)
    } catch (err) { setError('生成失败，请重试') } finally { setIsGenerating(false) }
  }
  
  const calculateTextBoxSize = (text, fontSize) => {
    const lines = text.split('\n')
    const maxLineLength = Math.max(...lines.map(line => line.length))
    
    // 估算每行宽度（中文字符按1.1倍字体大小，英文按0.6倍）
    let width = 0
    for (let char of text) {
      if (/[\u4e00-\u9fa5]/.test(char)) {
        width += fontSize * 1.1
      } else if (/[a-zA-Z]/.test(char)) {
        width += fontSize * 0.6
      } else {
        width += fontSize * 0.5
      }
    }
    
    // 取所有行的最大宽度
    width = Math.max(width, maxLineLength * fontSize * 0.8)
    
    // 添加内边距
    width += fontSize * 2
    
    // 计算高度（每行高度 + 行间距）
    const height = lines.length * fontSize * 1.5 + fontSize
    
    return {
      width: Math.max(width, 80),
      height: Math.max(height, fontSize * 2)
    }
  }
  
  const generateDecoConfig = (type) => {
    const seed = Date.now()
    const random = (i) => ((seed * 9301 + 49297 * i) % 233280) / 233280
    switch(type) {
      case 'circles': return { type, items: [...Array(8)].map((_, i) => ({ 
        width: 40 + random(i) * 80, 
        height: 40 + random(i + 1) * 80, 
        left: random(i + 2) * 85, 
        top: random(i + 3) * 85, 
        opacity: 0.15 + random(i + 4) * 0.25,
        borderRadius: '50%'
      })) }
      case 'lines': return { type, items: [...Array(12)].map((_, i) => ({ 
        height: 3 + random(i) * 6, 
        top: i * 8 + random(i + 1) * 5, 
        opacity: 0.15 + random(i + 2) * 0.25, 
        rotate: -20 + random(i + 3) * 40 
      })) }
      case 'dots': return { type, items: [...Array(30)].map((_, i) => ({ 
        left: random(i) * 95, 
        top: random(i + 1) * 95, 
        opacity: 0.25 + random(i + 2) * 0.35,
        size: 4 + random(i + 3) * 8
      })) }
      case 'waves': return { type, items: [...Array(4)].map((_, i) => ({ 
        bottom: i * 25,
        opacity: 0.2 + random(i) * 0.3
      })) }
      case 'geometric': return { type, items: [...Array(6)].map((_, i) => ({ 
        width: 50 + i * 25, 
        height: 50 + i * 25, 
        right: i * 12, 
        top: i * 12, 
        rotate: 30 + i * 20,
        opacity: 0.35,
        borderWidth: 2
      })) }
      case 'cyber': return { 
        type, 
        items: [...Array(15)].map((_, i) => ({ 
          left: random(i) * 90, 
          top: random(i + 1) * 90, 
          width: 20 + random(i + 2) * 60,
          height: 2 + random(i + 3) * 4,
          opacity: 0.3 + random(i + 4) * 0.4,
          rotate: random(i + 5) * 360
        })),
        steam: [...Array(8)].map((_, i) => ({
          left: random(i + 10) * 80,
          bottom: random(i + 11) * 40,
          width: 60 + random(i + 12) * 80,
          height: 80 + random(i + 13) * 100,
          opacity: 0.08 + random(i + 14) * 0.12
        }))
      }
      default: return { type: 'none', items: [] }
    }
  }

  const updateTextElement = (id, updates) => {
    setTextElements(prev => prev.map(el => {
      if (el.id !== id) return el
      
      // 如果字体大小变化，重新计算尺寸
      if (updates.fontSize && updates.fontSize !== el.fontSize) {
        const newSize = calculateTextBoxSize(el.text, updates.fontSize)
        return { ...el, ...updates, width: newSize.width, height: newSize.height }
      }
      
      // 如果文本内容变化，重新计算尺寸
      if (updates.text && updates.text !== el.text) {
        const newSize = calculateTextBoxSize(updates.text, el.fontSize)
        return { ...el, ...updates, width: newSize.width, height: newSize.height }
      }
      
      return { ...el, ...updates }
    }))
  }

  const resetTextPosition = (id) => {
    const element = textElements.find(el => el.id === id)
    if (element?.isTitle) { updateTextElement(id, { x: 50, y: 35 }) }
    else { updateTextElement(id, { x: 50, y: 55 }) }
  }

  const isWeixin = () => { return /MicroMessenger/i.test(navigator.userAgent) }
  
  const handleTextMouseDown = (e, element) => {
    e.preventDefault()
    e.stopPropagation()
    // 获取文本框元素
    const textBoxEl = e.target.closest('.text-box') || e.target
    const rect = textBoxEl.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    dragItem.current = element.id
    // 计算点击位置相对于文本框左上角的偏移
    dragOffset.current = { 
      x: clientX - rect.left, 
      y: clientY - rect.top 
    }
    setSelectedText(element.id)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }

  const handleMouseMove = (e) => {
    if (!dragItem.current || !posterRef.current) return
    const posterRect = posterRef.current.getBoundingClientRect()
    const element = textElements.find(el => el.id === dragItem.current)
    if (!element) return
    
    // 计算新的左上角位置
    const left = e.clientX - posterRect.left - dragOffset.current.x
    const top = e.clientY - posterRect.top - dragOffset.current.y
    
    // 转换为百分比（中心点）
    const centerX = left + (element.width || 80) / 2
    const centerY = top + (element.height || 40) / 2
    
    const x = (centerX / posterRect.width) * 100
    const y = (centerY / posterRect.height) * 100
    
    updateTextElement(dragItem.current, { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
    if (Math.abs(x - 50) < 3) { setDragGuideLine({ show: true, x: '50%', y: null }) }
    else { setDragGuideLine({ show: false, x: null, y: null }) }
  }

  const handleMouseUp = () => { dragItem.current = null; setDragGuideLine({ show: false, x: null, y: null }); document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp) }
  const handleTouchMove = (e) => {
    if (!dragItem.current || !posterRef.current) return; e.preventDefault()
    const touch = e.touches[0]
    const posterRect = posterRef.current.getBoundingClientRect()
    const element = textElements.find(el => el.id === dragItem.current)
    if (!element) return
    
    // 计算新的左上角位置
    const left = touch.clientX - posterRect.left - dragOffset.current.x
    const top = touch.clientY - posterRect.top - dragOffset.current.y
    
    // 转换为百分比（中心点）
    const centerX = left + (element.width || 80) / 2
    const centerY = top + (element.height || 40) / 2
    
    const x = (centerX / posterRect.width) * 100
    const y = (centerY / posterRect.height) * 100
    
    updateTextElement(dragItem.current, { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }
  const handleTouchEnd = () => { dragItem.current = null; document.removeEventListener('touchmove', handleTouchMove); document.removeEventListener('touchend', handleTouchEnd) }

  const saveImageToGallery = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.download = `poster-${Date.now()}.png`
    link.href = generatedImage
    link.click()
    setShowLongPressMenu(false)
  }

  // 通用的截图函数，确保滤镜效果被应用
  const capturePoster = async () => {
    if (!posterRef.current) return null
    
    const currentFilter = poster?.filter || 'none'
    
    // 先截图
    const canvas = await html2canvas(posterRef.current, { 
      scale: 2, 
      backgroundColor: null, 
      logging: false,
      useCORS: true,
      allowTaint: true
    })
    
    // 如果有滤镜，在 canvas 上应用
    if (currentFilter !== 'none') {
      const ctx = canvas.getContext('2d')
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      // RGB 转 HSL
      const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h, s, l = (max + min) / 2
        
        if (max === min) {
          h = s = 0
        } else {
          const d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
          }
        }
        return [h * 360, s * 100, l * 100]
      }
      
      // HSL 转 RGB
      const hslToRgb = (h, s, l) => {
        h /= 360; s /= 100; l /= 100
        let r, g, b
        
        if (s === 0) {
          r = g = b = l
        } else {
          const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1/6) return p + (q - p) * 6 * t
            if (t < 1/2) return q
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
            return p
          }
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s
          const p = 2 * l - q
          r = hue2rgb(p, q, h + 1/3)
          g = hue2rgb(p, q, h)
          b = hue2rgb(p, q, h - 1/3)
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
      }
      
      switch(currentFilter) {
        case 'grayscale':
          // 胶片效果：轻微灰度 + 增加对比度 + 暖色调
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2]
            // 计算灰度值
            const gray = (r * 0.299 + g * 0.587 + b * 0.114)
            // 混合原色和灰度（70%灰度 + 30%原色）
            const mixR = gray * 0.7 + r * 0.3
            const mixG = gray * 0.7 + g * 0.3
            const mixB = gray * 0.7 + b * 0.3
            // 增加对比度
            const contrast = 1.2
            const finalR = Math.min(255, Math.max(0, contrast * (mixR - 128) + 128))
            const finalG = Math.min(255, Math.max(0, contrast * (mixG - 128) + 128))
            const finalB = Math.min(255, Math.max(0, contrast * (mixB - 128) + 128))
            // 添加轻微暖色调
            data[i] = Math.min(255, finalR * 1.05)
            data[i + 1] = finalG
            data[i + 2] = Math.min(255, finalB * 0.95)
          }
          break
        case 'brightness':
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.2)
            data[i + 1] = Math.min(255, data[i + 1] * 1.2)
            data[i + 2] = Math.min(255, data[i + 2] * 1.2)
          }
          break
        case 'contrast':
          const factor = 1.5
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
            data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
            data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
          }
          break
        case 'hue':
          for (let i = 0; i < data.length; i += 4) {
            const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2])
            // 旋转 90 度
            const newH = (h + 90) % 360
            const [r, g, b] = hslToRgb(newH, s, l)
            data[i] = r
            data[i + 1] = g
            data[i + 2] = b
          }
          break
      }
      
      ctx.putImageData(imageData, 0, 0)
    }
    
    return canvas.toDataURL('image/png')
  }

  const showDownloadModal = async () => {
    if (!posterRef.current) return
    const prevSelectedText = selectedText
    setSelectedText(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 50))
      const dataUrl = await capturePoster()
      if (dataUrl) {
        setGeneratedImage(dataUrl)
        setShowLongPressMenu(true)
      }
    } catch (err) {
      setError('生成图片失败，请重试')
      setSelectedText(prevSelectedText)
    }
  }

  const downloadPoster = async () => {
    if (!posterRef.current) return
    if (isWeixin()) {
      setShowWechatTip(true)
      return
    }
    try {
      const dataUrl = await capturePoster()
      if (dataUrl) {
        const link = document.createElement('a')
        link.download = `poster-${Date.now()}.png`
        link.href = dataUrl
        link.click()
      }
    } catch (err) { setError('下载失败，请重试') }
  }

  const shareToPlatform = async (platform) => {
    if (!posterRef.current) return
    setShowShare(false)
    
    try {
      const dataUrl = await capturePoster()
      if (!dataUrl) return
      
      // 检测是否在微信中
      if (isWeixin()) {
        // 微信环境，尝试使用应用宝链接或特殊scheme
        if (platform.weixinUrl) {
          setShareResult(`📱 正在打开${platform.name}...`)
          
          // 记录跳转开始时间
          const startTime = Date.now()
          
          // 使用 location.href 跳转
          window.location.href = platform.weixinUrl
          
          // 监听页面可见性变化
          const handleVisibilityChange = () => {
            if (document.hidden) {
              setShareResult(`📱 请在${platform.name}中粘贴图片发布`)
              setTimeout(() => setShareResult(null), 3000)
            }
          }
          document.addEventListener('visibilitychange', handleVisibilityChange)
          
          // 2.5秒后检测是否跳转成功
          setTimeout(() => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            
            // 如果页面仍然可见，说明跳转失败
            if (!document.hidden && Date.now() - startTime > 2400) {
              setShareResult(`⚠️ 跳转${platform.name}失败，您可以下载后到${platform.name}进行海报的发布`)
              setTimeout(() => {
                setShareResult(null)
                setGeneratedImage(dataUrl)
                setShowLongPressMenu(true)
              }, 3000)
            }
          }, 2500)
        } else {
          // 没有微信专用链接，提示下载
          setShareResult(`⚠️ 跳转${platform.name}失败，您可以下载后到${platform.name}进行海报的发布`)
          setTimeout(() => {
            setShareResult(null)
            setGeneratedImage(dataUrl)
            setShowLongPressMenu(true)
          }, 3000)
        }
        return
      }
      
      // 非微信环境，尝试调起应用
      if (platform.scheme) {
        setShareResult(`📱 正在打开${platform.name}...`)
        
        // 记录跳转开始时间
        const startTime = Date.now()
        
        // 使用 window.location.href 跳转（最可靠的方式）
        window.location.href = platform.scheme
        
        // 监听页面可见性变化
        const handleVisibilityChange = () => {
          if (document.hidden) {
            // 页面隐藏，说明跳转成功
            setShareResult(`📱 请在${platform.name}中粘贴图片发布`)
            setTimeout(() => setShareResult(null), 3000)
          }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
        
        // 2.5秒后检测是否跳转成功
        setTimeout(() => {
          document.removeEventListener('visibilitychange', handleVisibilityChange)
          
          // 如果页面仍然可见，说明跳转失败
          if (!document.hidden && Date.now() - startTime > 2400) {
            setShareResult(`⚠️ 跳转${platform.name}失败，您可以下载后到${platform.name}进行海报的发布`)
            setTimeout(() => {
              setShareResult(null)
              setGeneratedImage(dataUrl)
              setShowLongPressMenu(true)
            }, 3000)
          }
        }, 2500)
      } else if (platform.webUrl) {
        // 直接打开网页版
        const opened = window.open(platform.webUrl, '_blank')
        if (!opened) {
          setShareResult(`⚠️ 跳转${platform.name}失败，您可以下载后到${platform.name}进行海报的发布`)
          setTimeout(() => {
            setShareResult(null)
            setGeneratedImage(dataUrl)
            setShowLongPressMenu(true)
          }, 3000)
        } else {
          setShareResult(`📱 请在${platform.name}中粘贴图片发布`)
          setTimeout(() => setShareResult(null), 3000)
        }
      } else {
        // 没有 scheme 和 webUrl
        setShareResult(`⚠️ 跳转${platform.name}失败，您可以下载后到${platform.name}进行海报的发布`)
        setTimeout(() => {
          setShareResult(null)
          setGeneratedImage(dataUrl)
          setShowLongPressMenu(true)
        }, 3000)
      }
    } catch (err) {
      console.error('Share error:', err)
      setShareResult('⚠️ 分享失败，请尝试下载')
      setTimeout(() => setShareResult(null), 3000)
    }
  }

  const clearHistory = () => { setHistory([]); localStorage.removeItem('posterHistory') }
  const applyFilter = (newFilter) => { setFilter(newFilter); if (poster) { setPoster({ ...poster, filter: newFilter }) } }
  const changeDecoration = (decoration) => { if (poster) { setPoster({ ...poster, decoration }) } }
  const getFilterStyle = (filterName) => { const filters = { none: 'none', grayscale: 'grayscale(70%) contrast(120%) sepia(10%)', brightness: 'brightness(120%)', contrast: 'contrast(150%)', hue: 'hue-rotate(90deg)' }; return filters[filterName] || 'none' }

const FILTER_NAMES = { none: '原图', grayscale: '胶片', brightness: '明亮', contrast: '增强', hue: '幻彩' }

  const loadFromHistory = (item) => { 
    setPoster(item); setTitle(item.title || ''); setContent(item.content || ''); setPrompt(item.prompt || ''); 
    setSelectedStyle(item.style); setSelectedSize(item.size); 
    setSelectedPlatform(item.platform ? PLATFORMS.find(p => p.id === item.platform) : null); 
    setTextElements(item.textElements || []); setBgImage(item.bgImage || null); setShowHistory(false) 
  }

  const renderDecoration = (type, config) => {
    if (type === 'none' || bgImage) return null
    if (!config || !config.items) return null
    
    switch(type) {
      case 'circles': return (<div className="decoration circles">{config.items.map((item, i) => (<div key={i} className="circle" style={{ width: `${item.width}px`, height: `${item.height}px`, left: `${item.left}%`, top: `${item.top}%`, opacity: item.opacity, borderRadius: item.borderRadius || '50%' }} />))}</div>)
      case 'lines': return (<div className="decoration lines">{config.items.map((item, i) => (<div key={i} className="line" style={{ width: '100%', height: `${item.height}px`, top: `${item.top}%`, opacity: item.opacity, transform: `rotate(${item.rotate}deg)` }} />))}</div>)
      case 'dots': return (<div className="decoration dots">{config.items.map((item, i) => (<div key={i} className="dot" style={{ width: `${item.size || 6}px`, height: `${item.size || 6}px`, left: `${item.left}%`, top: `${item.top}%`, opacity: item.opacity }} />))}</div>)
      case 'waves': return (<div className="decoration waves">{config.items.map((item, i) => (<div key={i} className="wave" style={{ bottom: `${item.bottom}px`, opacity: item.opacity || 0.3 }} />))}</div>)
      case 'geometric': return (<div className="decoration geometric">{config.items.map((item, i) => (<div key={i} className="shape" style={{ width: `${item.width}px`, height: `${item.height}px`, right: `${item.right}px`, top: `${item.top}px`, transform: `rotate(${item.rotate}deg)`, opacity: item.opacity || 0.35, border: `${item.borderWidth || 2}px solid rgba(255,255,255,0.4)`, background: 'transparent' }} />))}</div>)
      case 'cyber': return (
        <div className="decoration cyber">
          {config.items.map((item, i) => (<div key={i} className="cyber-line" style={{ width: `${item.width}px`, height: `${item.height}px`, left: `${item.left}%`, top: `${item.top}%`, opacity: item.opacity, transform: `rotate(${item.rotate}deg)` }} />))}
          {config.steam && config.steam.map((item, i) => (<div key={`steam-${i}`} className="cyber-steam" style={{ left: `${item.left}%`, bottom: `${item.bottom}px`, width: `${item.width}px`, height: `${item.height}px`, opacity: item.opacity }} />))}
        </div>
      )
      default: return null
    }
  }

  const selectedElement = textElements.find(el => el.id === selectedText)

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo"><span className="logo-icon">🎨</span>PosterAI</h1>
        <button className="history-btn" onClick={() => setShowHistory(true)}><span>📋</span>历史</button>
      </header>

      <AnimatePresence>
        {showGuide && (
          <motion.div className="guide-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={hideGuide}>
            <motion.div className="guide-modal" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={e => e.stopPropagation()}>
              <h2>👋 欢迎使用 PosterAI</h2>
              <div className="guide-steps">
                <div className="guide-step"><span>1</span><p>选择模板或输入<strong>标题+文案</strong></p></div>
                <div className="guide-step"><span>2</span><p>可上传<strong>背景图片</strong></p></div>
                <div className="guide-step"><span>3</span><p>点击<strong>生成海报</strong></p></div>
                <div className="guide-step"><span>4</span><p><strong>拖拽</strong>文字到任意位置，<strong>拖动边线</strong>缩放</p></div>
                <div className="guide-step"><span>5</span><p><strong>下载</strong>保存海报</p></div>
              </div>
              <button className="guide-btn" onClick={hideGuide}>开始创作</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showWechatTip && (
        <div className="wechat-tip-overlay" onClick={() => setShowWechatTip(false)}>
          <div className="wechat-tip-modal" onClick={e => e.stopPropagation()}>
            <div className="wechat-tip-icon">📱</div>
            <h3>微信保存图片</h3>
            <p>请长按海报图片，<strong>选择「另存为图片」</strong>保存到手机相册</p>
            <button onClick={() => setShowWechatTip(false)}>我知道了</button>
          </div>
        </div>
      )}

      {showLongPressMenu && (
        <div className="longpress-overlay" onClick={() => setShowLongPressMenu(false)}>
          <div className="longpress-modal" onClick={e => e.stopPropagation()}>
            <h3>保存海报</h3>
            {generatedImage && (
              <div className="longpress-image-container">
                <img src={generatedImage} alt="生成的海报" className="longpress-image" />
                <p className="longpress-hint">👆 长按上方图片保存到相册</p>
              </div>
            )}
            <div className="longpress-buttons">
              <button className="longpress-btn secondary" onClick={() => { setShowLongPressMenu(false); setIsConfirmed(false); }}>返回编辑</button>
              <button className="longpress-btn primary" onClick={saveImageToGallery}>💾 下载图片</button>
            </div>
          </div>
        </div>
      )}

      <main className="main">
        <section className="input-section">
          <div className="templates-section">
            <div className="section-label">📋 快速模板</div>
            <div className="templates-grid">
              {TEMPLATES.map(t => (
                <button key={t.id} className="template-btn" onClick={() => applyTemplate(t)}>
                  <span>{t.emoji}</span><span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label className="input-label required">海报标题</label>
            <input type="text" className="text-input" placeholder="例如：开业大吉、全场5折" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="input-group">
            <label className="input-label">海报文案</label>
            <textarea className="content-input" placeholder="例如：限时优惠、欢迎选购" value={content} onChange={(e) => setContent(e.target.value)} rows={2} />
          </div>

          <div className="input-group">
            <label className="input-label">AI海报描述提示词（非必填）</label>
            <textarea className="prompt-input" placeholder="描述海报风格... 例如：'夏日咖啡促销，深绿色调'" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2} />
          </div>

          <div className="input-group">
            <label className="input-label">上传背景图片（非必填）</label>
            <div className="bg-upload-area">
              <input type="file" ref={bgInputRef} accept="image/*" onChange={handleBgUpload} style={{ display: 'none' }} />
              {bgImage ? (
                <div className="bg-thumb">
                  <img src={bgImage} alt="背景预览" />
                  <button className="bg-remove" onClick={removeBgImage}>×</button>
                </div>
              ) : (
                <button className="bg-upload-btn" onClick={() => bgInputRef.current?.click()}>
                  <span>📷</span> 点击上传图片
                </button>
              )}
            </div>
          </div>

          <div className="options-group">
            <div className="option-label">选择风格（非必选）</div>
            <div className="style-options">
              {STYLES.map(style => (
                <button key={style.id} className={`style-btn ${selectedStyle === style.id ? 'active' : ''}`} onClick={() => setSelectedStyle(style.id)}>
                  <span>{style.emoji}</span><span>{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="options-group">
            <div className="option-label required">海报形状</div>
            <div className="size-options">
              {SIZES.map(size => (
                <button key={size.id} className={`size-btn ${selectedSize === size.id ? 'active' : ''}`} onClick={() => setSelectedSize(size.id)}>
                  <div className={`size-preview ${size.id}`}></div><span>{size.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button className={`generate-btn ${isGenerating ? 'loading' : ''}`} onClick={generatePoster} disabled={isGenerating}>
            {isGenerating ? (<><span className="loading-spinner"></span>正在生成...</>) : (<>🚀 生成海报</>)}
          </button>
          {error && <motion.div className="error-message" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}
        </section>

        <AnimatePresence>
          {poster && (
            <motion.section className="result-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="result-header"><h2>生成结果</h2></div>

              <div className="poster-container" onContextMenu={(e) => e.preventDefault()}>
                <div className="poster" ref={posterRef} style={{ filter: getFilterStyle(poster.filter), aspectRatio: SIZES.find(s => s.id === poster.size)?.ratio || PLATFORMS.find(p => p.id === poster.platform)?.ratio }}>
                  {poster.bgImage ? (
                    <>
                      <img src={poster.bgImage} alt="背景" className="poster-bg-image" />
                      <div className="poster-bg-overlay" style={{ background: `linear-gradient(135deg, ${poster.gradient.join(', ')})` }}></div>
                      <div className="poster-vignette"></div>
                      {renderDecoration(poster.decoration, poster.decoConfig)}
                    </>
                  ) : (
                    <div className="poster-bg" style={{ background: `linear-gradient(135deg, ${poster.gradient.join(', ')})` }}>{renderDecoration(poster.decoration, poster.decoConfig)}</div>
                  )}
                  {poster.platformEmoji && <div className="poster-platform-badge">{poster.platformEmoji}</div>}
                  <div className="poster-emoji">{poster.emoji}</div>
                  {poster.themeEmojis && poster.themeEmojis.length > 0 && (
                    <div className="theme-emojis">
                      {poster.themeEmojis.map((emoji, i) => (
                        <span key={i} className="theme-emoji" style={{ 
                          left: `${5 + (i * 22)}%`, 
                          top: `${10 + (i % 3) * 30}%`,
                          opacity: 0.12,
                          fontSize: `${48 + (i * 8)}px`
                        }}>{emoji}</span>
                      ))}
                    </div>
                  )}
                  {dragGuideLine.show && dragGuideLine.x && <div className="drag-guide-line vertical" style={{ left: dragGuideLine.x }} />}
                  {textElements.map(element => element.visible !== false && (
                    <div key={element.id} 
                      className={`text-box ${selectedText === element.id && !isConfirmed ? 'selected' : ''}`}
                      style={{ 
                        left: `calc(${element.x}% - ${element.width ? element.width / 2 : 0}px)`, 
                        top: `calc(${element.y}% - ${element.height ? element.height / 2 : 0}px)`, 
                        color: element.color, 
                        fontSize: `${element.fontSize}px`, 
                        fontFamily: element.fontFamily, 
                        transform: `rotate(${element.rotation || 0}deg)`,
                        textAlign: element.textAlign || 'center',
                        cursor: isConfirmed ? 'default' : 'move',
                        width: element.width ? `${element.width}px` : 'auto',
                        height: element.height ? `${element.height}px` : 'auto',
                        textShadow: poster.textStyle?.shadow || '0 2px 8px rgba(0, 0, 0, 0.5)',
                        fontWeight: poster.textStyle?.weight || '400'
                      }}
                      onMouseDown={(e) => !isConfirmed && handleTextMouseDown(e, element)}
                      onTouchStart={(e) => !isConfirmed && handleTextMouseDown(e, element)}
                      onClick={() => !isConfirmed && setSelectedText(element.id)}>
                      <span className="text-content">{element.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {!isConfirmed && selectedElement && (
                <div className="edit-panel">
                  <div className="edit-row edit-text-row">
                    <span className="edit-label">文案:</span>
                    <textarea 
                      className="text-edit-input" 
                      value={selectedElement.text}
                      onChange={(e) => updateTextElement(selectedElement.id, { text: e.target.value })}
                      rows={3}
                      placeholder="输入文案，支持换行"
                    />
                  </div>
                  <div className="edit-row"><span className="edit-label">颜色:</span><div className="color-picker">{COLORS.map(color => (<button key={color} className={`color-btn ${selectedElement.color === color ? 'active' : ''}`} style={{ background: color }} onClick={() => updateTextElement(selectedElement.id, { color })} />))}</div></div>
                  <div className="edit-row"><span className="edit-label">字体:</span><select className="font-select" value={selectedElement.fontFamily} onChange={(e) => updateTextElement(selectedElement.id, { fontFamily: e.target.value })}>{FONTS.map(font => (<option key={font.name} value={font.value}>{font.name}</option>))}</select></div>
                  <div className="edit-row"><span className="edit-label">大小:</span><select className="font-select" value={selectedElement.fontSize} onChange={(e) => updateTextElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}>{FONTSIZES.map(size => (<option key={size} value={size}>{size}px</option>))}</select></div>
                  <div className="edit-row">
                    <span className="edit-label">旋转:</span>
                    <div className="rotation-picker">
                      <button className="rotate-btn" onClick={() => updateTextElement(selectedElement.id, { rotation: 0 })}>⊥ 重置</button>
                      <button className="rotate-btn" onClick={() => updateTextElement(selectedElement.id, { rotation: (selectedElement.rotation || 0) + 15 })}>↻ +15°</button>
                    </div>
                  </div>
                  <div className="edit-row"><button className="reset-btn" onClick={() => resetTextPosition(selectedElement.id)}>↺ 位置重置</button></div>
                </div>
              )}

              {!isConfirmed && (
                <>
                  <div className="filter-bar"><span className="filter-label">滤镜:</span><div className="filter-options">{['none', 'grayscale', 'brightness', 'contrast', 'hue'].map(f => (<button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => applyFilter(f)}>{FILTER_NAMES[f]}</button>))}</div></div>

                  <div className="action-buttons">
                    <button className="action-btn" onClick={() => setShowShare(true)}>📤 一键分享</button>
                    <button className="action-btn primary" onClick={showDownloadModal}>💾 下载保存</button>
                  </div>
                </>
              )}
              {shareResult && (
                <div className="share-result">{shareResult}</div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {!poster && (
          <div className="empty-state">
            <div className="empty-preview">
              <div className="preview-card">📝</div>
              <div className="preview-card">🎨</div>
              <div className="preview-card">⬇️</div>
            </div>
            <p>输入标题和文案，上传背景图<br/>选择平台风格即可生成海报</p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showHistory && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHistory(false)}>
            <motion.div className="modal" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>历史记录</h2><button className="close-btn" onClick={() => setShowHistory(false)}>×</button></div>
              <div className="modal-content">
                {history.length === 0 ? <p className="empty-history">暂无历史记录</p> : (
                  <div className="history-grid">
                    {history.map(item => (
                      <div key={item.id} className="history-item" onClick={() => loadFromHistory(item)}>
                        <div className="history-poster-preview" style={{ background: item.bgImage ? `url(${item.bgImage}) center/cover` : (item.gradient ? `linear-gradient(135deg, ${item.gradient.join(', ')})` : 'linear-gradient(135deg, #667eea, #764ba2)') }}>
                          <span className="preview-emoji">{item.emoji || '🎨'}</span>
                          {item.platformEmoji && <span className="history-platform-badge">{item.platformEmoji}</span>}
                        </div>
                        <p>{item.title || item.prompt || '海报'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {history.length > 0 && <button className="clear-history-btn" onClick={clearHistory}>清空历史</button>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShare && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowShare(false)}>
            <motion.div className="modal share-modal" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>📤 一键分享</h2><button className="close-btn" onClick={() => setShowShare(false)}>×</button></div>
              <div className="modal-content">
                <p className="share-tip">选择分享平台，海报图片将自动复制到剪贴板</p>
                <div className="share-grid">
                  {SHARE_PLATFORMS.map(platform => (
                    <button key={platform.id} className="share-btn" onClick={() => shareToPlatform(platform)}>
                      <span className="share-emoji">{platform.emoji}</span>
                      <span className="share-name">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
