// components/layout/AdsterraLayoutWrapper.jsx
"use client";

import { useEffect, useRef } from 'react';
import { getAIOptimizer } from '../../utils/adsterra';

export default function AdsterraLayoutWrapper({ children, countryCode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized.current) {
        const optimizer = getAIOptimizer();
        if (optimizer) {
            optimizer.setGeo(countryCode);
        }

        const nativeContainer = document.getElementById('container-ea6c319bed501f507571d6db10437955');

        const visibleAds = [
            { id: 'native', src: '//fundingfashioned.com/ea6c319bed501f507571d6db10437955/invoke.js' },
            { id: 'social', src: '//fundingfashioned.com/58/8e/48/588e4888b90894cce3e5c62cbf08216a.js' }
        ];

        visibleAds.forEach(s => {
            if(document.querySelector(`script[src="${s.src}"]`)) return;
            const el = document.createElement('script');
            el.src = s.src;
            el.async = true;
            
            // PERBAIKAN: Masukkan script native ke kontainer footer jika ada
            if (s.id === 'native' && nativeContainer) {
                nativeContainer.appendChild(el);
            } else {
                document.body.appendChild(el);
            }
        });

        setTimeout(() => {
            if(document.querySelector(`script[src*="bd998872b03517b447721f2fd0ded07a"]`)) return;
            const popunder = document.createElement('script');
            popunder.src = '//fundingfashioned.com/bd/99/88/bd998872b03517b447721f2fd0ded07a.js'; 
            document.head.appendChild(popunder);
        }, 3500);

        initialized.current = true;
    }
  }, [countryCode]);

  return <>{children}</>;
}