
// context/LayoutContext.jsx
import { createContext, useState, useCallback, useEffect } from 'react';

export const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [sidebarClosed, setSidebarClosed] = useState(() => {
    // Check session storage for previous state
    return sessionStorage.getItem('two-column-sidebar-closed') === 'true';
  });

  const [mobileBackdropOpen, setMobileBackdropOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync classes on DOM elements based on sidebarClosed state
  useEffect(() => {
    const sidebar = document.getElementById('main-sidebar');
    const body = document.body;

    if (sidebarClosed) {
      sidebar?.classList.add('sidebar-close');
      body?.classList.add('sidebar-hidden');
    } else {
      sidebar?.classList.remove('sidebar-close');
      body?.classList.remove('sidebar-hidden');
    }
    sessionStorage.setItem('two-column-sidebar-closed', sidebarClosed);
  }, [sidebarClosed]);

  // Sync mobile backdrop open state
  useEffect(() => {
    const backdrop = document.getElementById('sidebar-backdrop');
    if (mobileBackdropOpen) {
      backdrop?.classList.add('d-block');
    } else {
      backdrop?.classList.remove('d-block');
    }
  }, [mobileBackdropOpen]);

  // Sync data-sidebar attribute on window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const html = document.documentElement;

      if (width <= 997.98) {
        // Mobile/Tablet
        html.setAttribute('data-sidebar', 'large');
      } else if (width <= 1199.98) {
        // Tablet horizontal or small laptop
        const layout = html.getAttribute('data-layout');
        if (layout === 'horizontal') {
          html.setAttribute('data-sidebar', 'large');
        } else {
          html.setAttribute('data-sidebar', 'small');
        }
      } else {
        // Large Desktop
        html.setAttribute('data-sidebar', 'large');
      }
    };

    // Run on initial mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = useCallback(() => {
    const width = window.innerWidth;
    setSidebarClosed((prev) => !prev);
    
    // Toggle backdrop on mobile
    if (width <= 997.98) {
      setMobileBackdropOpen((prev) => !prev);
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setSidebarClosed(true);
    setMobileBackdropOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setSidebarClosed(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const element = document.getElementById('fullScreenButton');
    const svgs = element?.querySelectorAll('svg');

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
          if (svgs && svgs.length >= 2) {
            svgs[0].classList.add('d-none');
            svgs[1].classList.remove('d-none');
          }
        })
        .catch((err) => {
          console.error('Error enabling fullscreen:', err);
        });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      if (svgs && svgs.length >= 2) {
        svgs[0].classList.remove('d-none');
        svgs[1].classList.add('d-none');
      }
    }
  }, []);

  // Listen to native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      const element = document.getElementById('fullScreenButton');
      const svgs = element?.querySelectorAll('svg');
      if (svgs && svgs.length >= 2) {
        if (document.fullscreenElement) {
          svgs[0].classList.add('d-none');
          svgs[1].classList.remove('d-none');
        } else {
          svgs[0].classList.remove('d-none');
          svgs[1].classList.add('d-none');
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        sidebarClosed,
        mobileBackdropOpen,
        isFullscreen,
        toggleSidebar,
        closeMobileSidebar,
        toggleFullscreen,
        openSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
