/**
 * Motion System - Sistema de animações suaves com foco em performance
 * 
 * Funcionalidades:
 * - Reveal animations (fade, up, down, left, right, zoom)
 * - Stagger effect para listas
 * - Parallax suave com throttling
 * - Suporte a prefers-reduced-motion
 * - Desativação automática em mobile
 */

// ============================================
// Tipos TypeScript
// ============================================

type RevealType = 'fade' | 'up' | 'down' | 'left' | 'right' | 'zoom';
type ParallaxAxis = 'x' | 'y';

interface ParallaxElement extends HTMLElement {
  parallaxIntensity?: number;
  parallaxAxis?: ParallaxAxis;
  initialOffset?: number;
}

interface MotionConfig {
  revealThreshold?: number;
  parallaxThrottle?: number;
  enableParallaxMobile?: boolean;
}

// ============================================
// Configuração padrão
// ============================================

const DEFAULT_CONFIG: Required<MotionConfig> = {
  revealThreshold: 0.1, // Trigger mais cedo para animação mais suave
  parallaxThrottle: 16, // ~60fps
  enableParallaxMobile: false,
};

// ============================================
// Utilitários
// ============================================

/**
 * Verifica se o usuário prefere movimento reduzido
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Verifica se está em dispositivo mobile
 */
function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
}

/**
 * Verifica se está em tablet
 */
function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/**
 * Obtém threshold baseado no tamanho da tela
 */
function getResponsiveThreshold(): number {
  if (typeof window === 'undefined') return 0.1;
  
  if (window.innerWidth <= 480) {
    return 0.05; // Mobile pequeno - trigger mais cedo
  } else if (window.innerWidth <= 768) {
    return 0.08; // Mobile - trigger mais cedo para animação suave
  } else if (window.innerWidth <= 1024) {
    return 0.1; // Tablet - threshold mais baixo
  }
  
  return 0.1; // Desktop - threshold mais baixo para animação mais suave
}

/**
 * Throttle function para limitar execução
 */
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================
// Reveal Animations (IntersectionObserver)
// ============================================

/**
 * Inicializa o sistema de reveal animations
 */
export function initMotion(config: MotionConfig = {}): void {
  if (typeof window === 'undefined') return;
  
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Verificar se reduzir movimento está ativo
  if (prefersReducedMotion()) {
    console.log('[Motion] Reduced motion detectado - animações simplificadas');
    return;
  }

  // Selecionar todos os elementos com data-reveal
  const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');
  
  if (revealElements.length === 0) {
    return;
  }

  // Usar threshold responsivo se não foi especificado
  const threshold = finalConfig.revealThreshold ?? getResponsiveThreshold();
  
  // Ajustar rootMargin baseado no tamanho da tela (mais generoso para animações mais suaves)
  let rootMargin = '0px';
  if (window.innerWidth <= 768) {
    rootMargin = '-80px 0px'; // Mobile - trigger mais cedo
  } else if (window.innerWidth <= 1024) {
    rootMargin = '-150px 0px'; // Tablet - mais espaço para animação suave
  } else {
    rootMargin = '-200px 0px'; // Desktop - muito espaço para animação progressiva
  }

  // Configurar IntersectionObserver
  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin,
    threshold,
  };

  // Usar requestAnimationFrame para animações mais suaves durante scroll
  let rafPending = false;
  const pendingEntries: IntersectionObserverEntry[] = [];

  const processEntries = () => {
    pendingEntries.forEach((entry) => {
      const element = entry.target as HTMLElement;
      
      if (entry.isIntersecting) {
        // Elemento entrou na viewport - animação suave
        requestAnimationFrame(() => {
          element.classList.add('is-inview');
          element.classList.remove('is-outview');
        });
      } else {
        // Elemento saiu da viewport (opcional - para fade-out)
        requestAnimationFrame(() => {
          element.classList.add('is-outview');
          element.classList.remove('is-inview');
        });
      }
    });
    
    pendingEntries.length = 0;
    rafPending = false;
  };

  const observer = new IntersectionObserver((entries) => {
    // Adicionar entradas ao buffer
    pendingEntries.push(...entries);
    
    // Processar em batch usando requestAnimationFrame
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(processEntries);
    }
  }, observerOptions);

  // Observar todos os elementos
  revealElements.forEach((element) => {
    // Garantir estado inicial (opacity 0) antes de observar
    if (!element.classList.contains('is-inview')) {
      element.style.opacity = '0';
    }
    observer.observe(element);
  });

  // Configurar stagger delay para filhos
  const staggerContainers = document.querySelectorAll<HTMLElement>('[data-stagger]');
  staggerContainers.forEach((container) => {
    const children = Array.from(container.children) as HTMLElement[];
    children.forEach((child, index) => {
      child.style.setProperty('--i', String(index));
    });
  });

  // Recalcular em resize para manter responsividade
  let resizeTimeout: NodeJS.Timeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reconfigurar stagger delays se necessário
      staggerContainers.forEach((container) => {
        const children = Array.from(container.children) as HTMLElement[];
        children.forEach((child, index) => {
          child.style.setProperty('--i', String(index));
        });
      });
    }, 150);
  }, { passive: true });

  console.log(`[Motion] ${revealElements.length} elementos de reveal inicializados (threshold: ${threshold})`);
}

// ============================================
// Parallax System
// ============================================

let parallaxElements: ParallaxElement[] = [];
let rafId: number | null = null;
let lastScrollY = 0;
let ticking = false;

/**
 * Calcula e aplica transform parallax
 */
function updateParallax(): void {
  if (typeof window === 'undefined') return;
  
  // Verificar condições de desativação
  if (prefersReducedMotion() || (!DEFAULT_CONFIG.enableParallaxMobile && isMobile())) {
    parallaxElements.forEach((el) => {
      el.style.transform = '';
    });
    return;
  }

  const scrollY = window.scrollY || window.pageYOffset;
  const deltaY = scrollY - lastScrollY;
  lastScrollY = scrollY;

  parallaxElements.forEach((element) => {
    const intensity = element.parallaxIntensity ?? 0.15;
    const axis = element.parallaxAxis ?? 'y';
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const elementCenter = elementTop + rect.height / 2;
    const viewportCenter = scrollY + window.innerHeight / 2;
    
    // Calcular offset baseado na posição do elemento
    const distance = (viewportCenter - elementCenter) * intensity;
    
    if (axis === 'y') {
      element.style.transform = `translate3d(0, ${distance}px, 0)`;
    } else {
      element.style.transform = `translate3d(${distance}px, 0, 0)`;
    }
  });

  ticking = false;
}

/**
 * Inicializa o sistema de parallax
 */
export function initParallax(config: MotionConfig = {}): void {
  if (typeof window === 'undefined') return;
  
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Verificar condições de desativação
  if (prefersReducedMotion()) {
    console.log('[Motion] Parallax desativado - reduced motion');
    return;
  }

  if (!finalConfig.enableParallaxMobile && isMobile()) {
    console.log('[Motion] Parallax desativado - mobile');
    return;
  }

  // Selecionar elementos com data-parallax
  const elements = document.querySelectorAll<ParallaxElement>('[data-parallax]');
  
  if (elements.length === 0) {
    return;
  }

  // Processar cada elemento
  elements.forEach((element) => {
    // Ler atributos
    const intensityAttr = element.getAttribute('data-parallax');
    const axisAttr = element.getAttribute('data-parallax-axis') || 'y';
    
    // Parse intensity (pode ser número ou string)
    const intensity = intensityAttr 
      ? parseFloat(intensityAttr) 
      : 0.15;
    
    // Validar axis
    const axis: ParallaxAxis = (axisAttr === 'x' || axisAttr === 'y') 
      ? axisAttr 
      : 'y';
    
    // Armazenar configuração
    element.parallaxIntensity = intensity;
    element.parallaxAxis = axis;
    
    // Inicializar transform
    element.style.transform = 'translate3d(0, 0, 0)';
    element.style.willChange = 'transform';
  });

  parallaxElements = Array.from(elements);

  // Throttled scroll handler
  const throttledParallax = throttle(() => {
    if (!ticking) {
      updateParallax();
      ticking = true;
    }
  }, finalConfig.parallaxThrottle);

  // Event listeners
  window.addEventListener('scroll', throttledParallax, { passive: true });
  window.addEventListener('resize', () => {
    lastScrollY = window.scrollY || window.pageYOffset;
    updateParallax();
  }, { passive: true });

  console.log(`[Motion] ${parallaxElements.length} elementos de parallax inicializados`);
}

/**
 * Limpa recursos do parallax
 */
export function destroyParallax(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  
  parallaxElements.forEach((element) => {
    element.style.transform = '';
    element.style.willChange = '';
  });
  
  parallaxElements = [];
}

// ============================================
// Inicialização combinada
// ============================================

/**
 * Inicializa todos os sistemas de motion
 */
export function initAllMotion(config: MotionConfig = {}): void {
  initMotion(config);
  initParallax(config);
  
  console.log('[Motion] Sistema de animações inicializado');
}

// ============================================
// Exportações
// ============================================

export default {
  initMotion,
  initParallax,
  initAllMotion,
  destroyParallax,
};


