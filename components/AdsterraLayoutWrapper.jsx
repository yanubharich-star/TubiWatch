"use client";

import { useEffect, useRef } from 'react';

export default function AdsterraLayoutWrapper({ children }) {
  const scriptsLoaded = useRef(false);
  const retryCount = useRef(0);
  const MAX_RETRIES = 2; // 2 retries cukup

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let timer;

      // ✅ SKRIPT IKLAN JUSTWATCH (SUDAH BENAR!)
      const scripts = [
        {
          id: 'adsterra-native-banner',
          src: '//fundingfashioned.com/e527b94a54d2e891ac3b8739485cbc7b/invoke.js',
          attributes: { 'data-cfasync': 'false' }
        },
        {
          id: 'adsterra-popunder', 
          src: '//fundingfashioned.com/78/f7/ad/78f7ad6f79d58032ff4fd04658ed2177.js'
        },
        {
          id: 'adsterra-social-bar',
          src: '//fundingfashioned.com/2f/14/04/2f14048d936c22da7e2199204444f9ed.js'
        }
      ];

      const loadScripts = () => {
        // Cek jika sudah dimuat
        if (scriptsLoaded.current) return;
        
        scripts.forEach(scriptConfig => {
          // Skip jika sudah ada
          if (document.getElementById(scriptConfig.id)) return;

          const script = document.createElement('script');
          script.id = scriptConfig.id;
          script.src = scriptConfig.src;
          script.async = true;

          // Set attributes
          if (scriptConfig.attributes) {
            Object.entries(scriptConfig.attributes).forEach(([key, value]) => {
              script.setAttribute(key, value);
            });
          }

          // ✅ RETRY MECHANISM (dari versi lama)
          script.onerror = () => {
            console.error(`❌ ${scriptConfig.id} failed to load`);
            retryCount.current++;
            if (retryCount.current <= MAX_RETRIES) {
              console.log(`🔄 Retrying ${scriptConfig.id}... (${retryCount.current}/${MAX_RETRIES})`);
              setTimeout(loadScripts, 1000 * retryCount.current);
            }
          };

          script.onload = () => {
            console.log(`✅ ${scriptConfig.id} loaded`);
          };

          document.body.appendChild(script);
        });

        scriptsLoaded.current = true;
        console.log('🎉 All Adsterra scripts loaded');
      };

      // Delay initial load
      timer = setTimeout(loadScripts, 1500);

      // ✅ USER INTERACTION TRIGGER (dari versi lama)
      const handleInteraction = () => {
        if (!scriptsLoaded.current) {
          loadScripts();
        }
      };

      // Attach listeners dengan once
      ['click', 'scroll', 'touchstart'].forEach(event => {
        window.addEventListener(event, handleInteraction, { once: true });
      });

      return () => {
        clearTimeout(timer);
        
        // Remove listeners
        ['click', 'scroll', 'touchstart'].forEach(event => {
          window.removeEventListener(event, handleInteraction);
        });

        // Cleanup scripts
        scripts.forEach(scriptConfig => {
          const script = document.getElementById(scriptConfig.id);
          if (script?.parentNode) {
            script.parentNode.removeChild(script);
          }
        });
        
        scriptsLoaded.current = false;
      };
    }
  }, []);

  return <>{children}</>;
}